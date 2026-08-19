import React from 'react';
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
import { formatNumberIN } from '../../utils/dataTransformers';
import { Clock, Sun, Sunrise, Sunset } from 'lucide-react';

const SLOT_ICONS = {
  'Morning': Sunrise,
  'Afternoon': Sun,
  'Evening': Sunset,
  'Anytime': Clock
};

export default function ContactSlotBar({ data = [] }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;
      return (
        <div className="tooltip-box">
          <div style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
            {item.name} Preferred Slot
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '12px' }}>
            <span style={{ color: '#94A3B8' }}>Leads:</span>
            <span className="mono" style={{ fontWeight: 700, color: '#FFFFFF' }}>{formatNumberIN(item.count)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '12px' }}>
            <span style={{ color: '#94A3B8' }}>Share:</span>
            <span className="mono" style={{ fontWeight: 700, color: '#38BDF8' }}>{pct}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color="#D97706" />
            <h3 style={{ fontSize: '17px', color: 'var(--text-primary)' }}>Best Time to Call & Connect</h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Preferred contact windows specified by prospective leads
          </p>
        </div>
      </div>

      <div style={{ width: '100%', height: '220px' }}>
        {data.length === 0 ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            No preferred contact slot data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#475569" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                width={100}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Quick Slot Pills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
        {data.map(item => {
          const Icon = SLOT_ICONS[item.name] || Clock;
          return (
            <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: `${item.fill}15`, color: item.fill, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={13} />
              </div>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.count}</span>
              <span>{item.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
