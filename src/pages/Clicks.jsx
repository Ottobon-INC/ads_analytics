import React, { useState, useEffect } from 'react';
import { Target, MapPin, MousePointerClick, Clock, Monitor } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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
          Live IP Tracking
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Real-time feed of user engagement on your landing page.
        </p>
      </div>

      <div className="glass-card">
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FAFAFA' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: '600' }}>
            <Monitor size={18} color="var(--primary)" /> Activity Stream
          </h3>
          <button 
            className="btn btn-primary" 
            onClick={fetchClicks}
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            Refresh Stream
          </button>
        </div>

        {loading && clicks.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading live activity...
          </div>
        ) : error ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#EF4444' }}>
            Error: {error}
          </div>
        ) : clicks.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Target size={40} color="#CBD5E1" style={{ margin: '0 auto 12px' }} />
            <p>No activity tracked yet.</p>
            <p style={{ fontSize: '13px', marginTop: '8px' }}>Waiting for users to interact with your landing page...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table" style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                  <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '13px' }}>Time</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '13px' }}>IP Address</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '13px' }}>Location</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '13px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {clicks.map((click, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background-color 0.2s', ':hover': { backgroundColor: 'var(--bg-surface-hover)' } }}>
                    <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontWeight: '500', fontSize: '14px' }}>
                        <Clock size={14} color="var(--text-muted)" />
                        {formatDistanceToNow(new Date(click.timestamp), { addSuffix: true })}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px', marginLeft: '20px' }}>
                        {new Date(click.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ 
                        background: 'rgba(79, 70, 229, 0.1)', 
                        color: 'var(--primary)', 
                        padding: '6px 10px', 
                        borderRadius: '6px', 
                        fontFamily: 'monospace',
                        fontWeight: '600',
                        fontSize: '13px'
                      }}>
                        {click.ip}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: click.location === 'Unknown' ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                        <MapPin size={16} color={click.location === 'Unknown' ? "var(--text-muted)" : "var(--accent-emerald)"} />
                        {click.location || 'Unknown'}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                       <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#F1F5F9', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                        <MousePointerClick size={14} color="var(--text-secondary)" />
                        {click.element}
                      </div>
                    </td>
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
