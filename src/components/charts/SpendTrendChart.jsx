import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { formatNumberIN } from '../../utils/dataTransformers';
import { TrendingUp, Users } from 'lucide-react';

export default function SpendTrendChart({ data = [] }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="tooltip-box">
          <div style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>
            {item.date || label}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', fontSize: '12px' }}>
            <span style={{ color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4F46E5' }}></span>
              Inbound Leads:
            </span>
            <span className="mono" style={{ fontWeight: 700, color: '#FFFFFF' }}>
              {formatNumberIN(item.leads)}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', fontSize: '12px', marginTop: '4px' }}>
            <span style={{ color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284C7' }}></span>
              Call Attempts:
            </span>
            <span className="mono" style={{ fontWeight: 700, color: '#38BDF8' }}>
              {formatNumberIN(item.attempts)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const totalLeads = data.reduce((acc, d) => acc + (d.leads || 0), 0);

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="#4F46E5" />
            <h3 style={{ fontSize: '17px', color: 'var(--text-primary)' }}>Inbound Lead Volume Timeline</h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Historical lead inflow and daily outreach activity
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#4F46E5' }}></span>
            <span>Leads</span>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', height: '260px' }}>
        {data.length === 0 ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            No timeline data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="leadAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis 
                dataKey="displayDate" 
                stroke="#94A3B8" 
                fontSize={11} 
                tickLine={false} 
                axisLine={{ stroke: '#E2E8F0' }} 
              />
              <YAxis 
                stroke="#94A3B8" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="leads"
                stroke="#4F46E5"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#leadAreaGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
