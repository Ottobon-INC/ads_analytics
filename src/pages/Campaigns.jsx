import React, { useState } from 'react';
import { 
  Target, 
  IndianRupee, 
  TrendingUp, 
  Award, 
  Search,
  Zap,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import CampaignBarChart from '../components/charts/CampaignBarChart';
import InteractiveBudgetSlider from '../components/charts/InteractiveBudgetSlider';
import { formatINR, formatNumberIN } from '../utils/dataTransformers';

export default function Campaigns({ campaigns = [], kpis }) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('spend');
  const [sortAsc, setSortAsc] = useState(false);

  const filteredCampaigns = campaigns.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    let diff = 0;
    if (sortField === 'name') diff = a.name.localeCompare(b.name);
    else if (sortField === 'spend') diff = a.spend - b.spend;
    else if (sortField === 'leads') diff = a.leads - b.leads;
    else if (sortField === 'cpl') diff = a.cpl - b.cpl;
    else if (sortField === 'ctr') diff = a.ctr - b.ctr;
    else if (sortField === 'convRate') diff = a.convRate - b.convRate;
    return sortAsc ? diff : -diff;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const topCampaign = [...campaigns].sort((a, b) => (a.cpl > 0 ? a.cpl : 9999) - (b.cpl > 0 ? b.cpl : 9999))[0];
  const highestVolumeCampaign = [...campaigns].sort((a, b) => b.leads - a.leads)[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '24px', color: 'var(--text-primary)' }}>Medcy Meta & Instagram Ads Campaign Matrix</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Real-time ad spend efficiency, Cost Per Lead (CPL in ₹), and dynamic budget scaling projections.
        </p>
      </div>

      {/* Senior Marketer Strategic Insights Banner */}
      <div 
        className="glass-card" 
        style={{ 
          padding: '20px', 
          background: 'linear-gradient(135deg, rgba(87, 70, 227, 0.1) 0%, rgba(0, 129, 251, 0.05) 100%)',
          border: '1px solid rgba(87, 70, 227, 0.25)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Zap size={18} color="#818CF8" />
          <h3 style={{ fontSize: '15px', color: '#F8FAFC' }}>Doctor Acquisition Strategy Insights</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {topCampaign && (
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34D399', fontSize: '12px', fontWeight: 600 }}>
                <CheckCircle2 size={14} /> Lowest Cost Per Doctor Lead
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                {topCampaign.name}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                Delivering lowest CPL at ₹{topCampaign.cpl} with {topCampaign.leads} inquiries. Highly recommended to scale daily budget by 40%.
              </div>
            </div>
          )}

          {highestVolumeCampaign && (
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38BDF8', fontSize: '12px', fontWeight: 600 }}>
                <TrendingUp size={14} /> Volume Leader (Most Demos)
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                {highestVolumeCampaign.name}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                Captured {highestVolumeCampaign.leads} hospital inquiries ({((highestVolumeCampaign.leads / (kpis.totalLeads || 1)) * 100).toFixed(0)}% of total pipeline) with {highestVolumeCampaign.ctr}% CTR.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Ad Spend Scale Engine */}
      <InteractiveBudgetSlider 
        currentSpend={kpis.totalSpend || 120000}
        currentLeads={kpis.totalLeads || 340}
        currentCpl={Math.round(kpis.cpl) || 350}
      />

      {/* Campaign Bar Chart */}
      <CampaignBarChart campaigns={campaigns} />

      {/* Full Campaign Matrix Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '17px', color: 'var(--text-primary)' }}>All Active Advertising Campaigns</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Click any column header to sort
            </p>
          </div>

          <div style={{ width: '260px', position: 'relative' }}>
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="input-control"
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '32px', fontSize: '12px' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', cursor: 'pointer' }} onClick={() => handleSort('name')}>
                  Campaign Name {sortField === 'name' ? (sortAsc ? '↑' : '↓') : ''}
                </th>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'right' }} onClick={() => handleSort('spend')}>
                  Spend (₹) {sortField === 'spend' ? (sortAsc ? '↑' : '↓') : ''}
                </th>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'right' }} onClick={() => handleSort('leads')}>
                  Inquiries {sortField === 'leads' ? (sortAsc ? '↑' : '↓') : ''}
                </th>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'right' }} onClick={() => handleSort('cpl')}>
                  CPL (₹) {sortField === 'cpl' ? (sortAsc ? '↑' : '↓') : ''}
                </th>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'right' }} onClick={() => handleSort('ctr')}>
                  CTR (%) {sortField === 'ctr' ? (sortAsc ? '↑' : '↓') : ''}
                </th>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                  Performance
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((camp) => (
                <tr 
                  key={camp.name}
                  style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background var(--transition-fast)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{camp.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {formatNumberIN(camp.impressions)} impressions • {formatNumberIN(camp.clicks)} link clicks
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <span className="mono" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{formatINR(camp.spend)}</span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <span className="mono" style={{ fontWeight: 700, color: '#34D399' }}>{formatNumberIN(camp.leads)}</span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <span className="mono" style={{ fontWeight: 700, color: '#FBBF24' }}>₹{camp.cpl}</span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <span className="mono" style={{ color: '#38BDF8' }}>{camp.ctr}%</span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span className={`badge ${camp.badgeClass}`}>
                      {camp.badge}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
