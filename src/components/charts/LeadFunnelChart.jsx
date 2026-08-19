import React from 'react';
import { formatNumberIN } from '../../utils/dataTransformers';
import { Eye, MousePointerClick, UserCheck, Award, ArrowDown } from 'lucide-react';

const STAGE_ICONS = [Eye, MousePointerClick, UserCheck, Award];

export default function LeadFunnelChart({ data = [] }) {
  if (!data || data.length === 0) return null;

  const maxVal = data[0]?.count || 1;

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '17px', color: 'var(--text-primary)' }}>Marketing Conversion Funnel</h3>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Step-by-step drop-off from impressions to converted sales
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {data.map((stage, idx) => {
          const Icon = STAGE_ICONS[idx] || Eye;
          const percentageOfMax = Math.max(8, (stage.count / maxVal) * 100);

          return (
            <React.Fragment key={stage.stage}>
              <div 
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div 
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: `${stage.fill}22`,
                        color: stage.fill,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Icon size={15} />
                    </div>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {stage.stage}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="mono" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {formatNumberIN(stage.count)}
                    </span>
                    <span 
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: `${stage.fill}25`,
                        color: stage.fill,
                        border: `1px solid ${stage.fill}44`
                      }}
                    >
                      {stage.rate}
                    </span>
                  </div>
                </div>

                {/* Funnel Progress Bar */}
                <div 
                  style={{
                    width: '100%',
                    height: '6px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}
                >
                  <div 
                    style={{
                      width: `${percentageOfMax}%`,
                      height: '100%',
                      background: stage.fill,
                      borderRadius: '4px',
                      transition: 'width 0.6s ease-out'
                    }}
                  />
                </div>
              </div>

              {/* Drop-off indicator between stages */}
              {idx < data.length - 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '-6px 0', gap: '6px' }}>
                  <ArrowDown size={13} color="var(--text-muted)" />
                  <span style={{ fontSize: '10px', color: 'var(--accent-rose)', fontWeight: 600 }}>
                    {data[idx + 1].dropOff}
                  </span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
