import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { formatINR, formatNumberIN } from '../../utils/dataTransformers';
import { ArrowUpDown, Award, AlertCircle } from 'lucide-react';

export default function CampaignBarChart({ campaigns = [] }) {
  const [sortBy, setSortBy] = useState('spend'); // 'spend', 'leads', 'cpl'

  const sortedCampaigns = [...campaigns].sort((a, b) => {
    if (sortBy === 'spend') return b.spend - a.spend;
    if (sortBy === 'leads') return b.leads - a.leads;
    if (sortBy === 'cpl') return a.cpl - b.cpl; // lower CPL first
    return 0;
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const camp = payload[0].payload;
      return (
        <div className="tooltip-box">
          <div style={{ fontWeight: 700, marginBottom: '6px', color: '#F8FAFC' }}>
            {camp.name}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', color: '#818CF8' }}>
              <span>Total Spend:</span>
              <span className="mono" style={{ fontWeight: 700 }}>{formatINR(camp.spend)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', color: '#34D399' }}>
              <span>Leads Generated:</span>
              <span className="mono" style={{ fontWeight: 700 }}>{formatNumberIN(camp.leads)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', color: '#FBBF24' }}>
              <span>Cost Per Lead (CPL):</span>
              <span className="mono" style={{ fontWeight: 700 }}>₹{camp.cpl}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', color: '#38BDF8' }}>
              <span>CTR:</span>
              <span className="mono" style={{ fontWeight: 700 }}>{camp.ctr}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '17px', color: 'var(--text-primary)' }}>Campaign Performance Ranking</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Comparing efficiency and volume across all ad campaigns
          </p>
        </div>

        {/* Sort controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.04)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '0 6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowUpDown size={12} /> Sort:
          </span>
          <button 
            className={`btn btn-sm ${sortBy === 'spend' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setSortBy('spend')}
            style={{ fontSize: '11px', padding: '4px 8px' }}
          >
            Spend
          </button>
          <button 
            className={`btn btn-sm ${sortBy === 'leads' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setSortBy('leads')}
            style={{ fontSize: '11px', padding: '4px 8px' }}
          >
            Leads
          </button>
          <button 
            className={`btn btn-sm ${sortBy === 'cpl' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setSortBy('cpl')}
            style={{ fontSize: '11px', padding: '4px 8px' }}
          >
            Lowest CPL
          </button>
        </div>
      </div>

      <div style={{ width: '100%', height: '280px' }}>
        {sortedCampaigns.length === 0 ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            No campaign data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedCampaigns} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#64748B" 
                fontSize={10}
                tickLine={false}
                interval={0}
                tick={({ x, y, payload }) => {
                  const label = payload.value.length > 18 ? payload.value.substring(0, 16) + '...' : payload.value;
                  return (
                    <text x={x} y={y + 12} fill="#94A3B8" fontSize={10} textAnchor="middle">
                      {label}
                    </text>
                  );
                }}
              />
              <YAxis 
                stroke="#64748B" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => sortBy === 'spend' ? `₹${val > 999 ? `${(val/1000).toFixed(0)}k` : val}` : val}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey={sortBy === 'cpl' ? 'cpl' : sortBy} 
                radius={[6, 6, 0, 0]}
              >
                {sortedCampaigns.map((entry, index) => {
                  let fillColor = '#6366F1';
                  if (sortBy === 'spend') fillColor = index === 0 ? '#8B5CF6' : '#6366F1';
                  if (sortBy === 'leads') fillColor = index === 0 ? '#10B981' : '#059669';
                  if (sortBy === 'cpl') fillColor = index === 0 ? '#10B981' : '#F59E0B';
                  return <Cell key={`cell-${index}`} fill={fillColor} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
