import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatNumberIN } from '../../utils/dataTransformers';
import { Building2 } from 'lucide-react';

export default function OrgTypeDonut({ data = [] }) {
  const total = data.reduce((acc, item) => acc + (item.value || 0), 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
      return (
        <div className="tooltip-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.payload.fill }}></span>
            <span style={{ fontWeight: 700, color: '#F8FAFC' }}>{item.name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Facilities:</span>
            <span className="mono" style={{ fontWeight: 700, color: '#F8FAFC' }}>{formatNumberIN(item.value)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Share:</span>
            <span className="mono" style={{ fontWeight: 700, color: '#38BDF8' }}>{pct}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={18} color="var(--primary-light)" />
            <h3 style={{ fontSize: '17px', color: 'var(--text-primary)' }}>Healthcare Facility Split</h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Breakdown of clinics, hospitals, and diagnostic labs
          </p>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%', height: '220px' }}>
        {total === 0 ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            No organization data recorded
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={88}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div 
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none'
              }}
            >
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }} className="mono">
                {formatNumberIN(total)}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                Facilities
              </div>
            </div>
          </>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginTop: '12px' }}>
        {data.map((item) => {
          const pct = total > 0 ? ((item.value / total) * 100).toFixed(0) : 0;
          return (
            <div 
              key={item.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 10px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.fill, flexShrink: 0 }}></span>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {item.name}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                <span className="mono" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {item.value}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  ({pct}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
