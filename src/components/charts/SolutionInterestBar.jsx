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
import { Sparkles, MessageCircle, Monitor, HeartHandshake, Layers } from 'lucide-react';

const SOLUTION_ICONS = {
  'WhatsApp Automation': MessageCircle,
  'Digital OP Desk': Monitor,
  'Post-Care Sakhi': HeartHandshake,
  'Complete Patient Experience': Layers
};

export default function SolutionInterestBar({ data = [] }) {
  const totalInquiries = data.reduce((sum, item) => sum + item.count, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const pct = totalInquiries > 0 ? ((item.count / totalInquiries) * 100).toFixed(1) : 0;
      return (
        <div className="tooltip-box">
          <div style={{ fontWeight: 700, color: '#F8FAFC', marginBottom: '4px' }}>
            {item.name}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Demand Count:</span>
            <span className="mono" style={{ fontWeight: 700, color: '#F8FAFC' }}>{formatNumberIN(item.count)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Interest Share:</span>
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
            <Sparkles size={18} color="#10B981" />
            <h3 style={{ fontSize: '17px', color: 'var(--text-primary)' }}>Medcy Solutions in Highest Demand</h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            What features clinics and hospitals are requesting most
          </p>
        </div>
      </div>

      <div style={{ width: '100%', height: '240px' }}>
        {data.length === 0 ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            No solution data recorded
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#94A3B8" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                width={160}
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

      {/* Feature Pills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
        {data.map(item => {
          const Icon = SOLUTION_ICONS[item.name] || Sparkles;
          return (
            <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-secondary)' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: `${item.fill}22`, color: item.fill, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={12} />
              </div>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.count}</span>
              <span>{item.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
