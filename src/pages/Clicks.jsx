import React, { useState, useEffect } from 'react';
import { Target } from 'lucide-react';

export default function Clicks() {
  const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClicks = async () => {
    try {
      setLoading(true);
      const apiBaseUrl = process.env.NODE_ENV === 'production' 
        ? '' 
        : 'http://localhost:3001';

      const response = await fetch(`${apiBaseUrl}/api/clicks`);
      if (!response.ok) {
        throw new Error('Failed to fetch clicks');
      }
      const data = await response.json();
      data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setClicks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClicks();
    const interval = setInterval(fetchClicks, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ animation: 'fade-in 0.3s ease-out' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
          IP Tracking Log
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Real-time feed of user clicks captured from your landing page.
        </p>
      </div>

      <div className="card">
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: '600' }}>
            <Target size={18} color="#4F46E5" /> Recent Clicks
          </h3>
          <button 
            className="btn btn-primary" 
            onClick={fetchClicks}
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            Refresh Data
          </button>
        </div>

        {loading && clicks.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading clicks...
          </div>
        ) : error ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#EF4444' }}>
            Error: {error}
          </div>
        ) : clicks.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Target size={40} color="#CBD5E1" style={{ margin: '0 auto 12px' }} />
            <p>No clicks tracked yet.</p>
            <p style={{ fontSize: '13px', marginTop: '8px' }}>Once a user clicks the tracked button on your landing page, it will appear here.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>IP Address</th>
                  <th>Element Clicked</th>
                </tr>
              </thead>
              <tbody>
                {clicks.map((click, index) => (
                  <tr key={index}>
                    <td style={{ whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                      {new Date(click.timestamp).toLocaleString()}
                    </td>
                    <td style={{ fontWeight: '500', color: '#0F172A' }}>
                      <span style={{ background: '#F1F5F9', padding: '4px 8px', borderRadius: '6px', fontFamily: 'monospace' }}>
                        {click.ip}
                      </span>
                    </td>
                    <td>{click.element}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
