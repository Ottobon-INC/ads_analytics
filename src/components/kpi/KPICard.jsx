import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function KPICard({
  label,
  value,
  icon: Icon,
  trend,
  isPositiveTrend = true,
  helperText,
  accentColor = 'indigo'
}) {
  const getAccentConfig = (color) => {
    switch (color) {
      case 'emerald':
        return { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' };
      case 'amber':
        return { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' };
      case 'blue':
        return { bg: '#EFF6FF', text: '#0284C7', border: '#BAE6FD' };
      case 'purple':
        return { bg: '#FAF5FF', text: '#7C3AED', border: '#E9D5FF' };
      case 'rose':
        return { bg: '#FFF1F2', text: '#E11D48', border: '#FECDD3' };
      default: // indigo
        return { bg: '#EEF2FF', text: '#4F46E5', border: '#C7D2FE' };
    }
  };

  const accent = getAccentConfig(accentColor);

  return (
    <div 
      className="glass-card"
      style={{
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '130px',
        background: '#FFFFFF',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-card)'
      }}
    >
      {/* Top Label & Icon */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {label}
        </span>
        {Icon && (
          <div 
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: accent.bg,
              color: accent.text,
              border: `1px solid ${accent.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon size={18} />
          </div>
        )}
      </div>

      {/* Main Metric Value */}
      <div style={{ margin: '10px 0 6px 0' }}>
        <div 
          className="mono"
          style={{
            fontSize: '28px',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
            lineHeight: 1.1
          }}
        >
          {value}
        </div>
      </div>

      {/* Footer Helper / Trend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
        {trend !== undefined && trend !== null ? (
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 600,
              color: isPositiveTrend ? '#059669' : '#E11D48'
            }}
          >
            {isPositiveTrend ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            <span>{trend > 0 ? `+${trend}%` : `${trend}%`}</span>
            <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>vs previous</span>
          </div>
        ) : helperText ? (
          <span style={{ color: 'var(--text-muted)' }}>{helperText}</span>
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>Updated live from sheet</span>
        )}
      </div>
    </div>
  );
}
