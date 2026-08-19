import React, { useState } from 'react';
import { Sliders, Sparkles, TrendingUp, DollarSign, Target, Award } from 'lucide-react';
import { formatINR, formatNumberIN } from '../../utils/dataTransformers';

export default function InteractiveBudgetSlider({ currentSpend = 120000, currentLeads = 320, currentCpl = 375 }) {
  const [multiplier, setMultiplier] = useState(1.0);

  const simulatedSpend = Math.round(currentSpend * multiplier);
  // Diminishing returns formula for realistic performance ad scaling
  const scalingEfficiency = 1 - (multiplier > 1 ? (multiplier - 1) * 0.08 : 0);
  const simulatedLeads = Math.round(currentLeads * multiplier * Math.max(0.75, scalingEfficiency));
  const simulatedCpl = simulatedLeads > 0 ? Math.round(simulatedSpend / simulatedLeads) : currentCpl;
  const simulatedSignedHospitals = Math.round(simulatedLeads * 0.11);
  const projectedMonthlyRevenue = simulatedSignedHospitals * 120 * 26 * 50; // 120 OPD/day @ ₹50/pt

  return (
    <div 
      className="glass-card" 
      style={{ 
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(87, 70, 227, 0.12) 0%, rgba(0, 129, 251, 0.06) 100%)',
        border: '1px solid rgba(87, 70, 227, 0.3)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="#818CF8" />
            <h3 style={{ fontSize: '17px', color: 'var(--text-primary)' }}>Live Meta Ad Scale & Budget Forecast Engine</h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Drag slider to forecast lead volume & signed clinics as ad spend scales
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button className={`btn btn-sm ${multiplier === 1.0 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMultiplier(1.0)}>1.0x (Current)</button>
          <button className={`btn btn-sm ${multiplier === 1.5 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMultiplier(1.5)}>1.5x Scale</button>
          <button className={`btn btn-sm ${multiplier === 2.0 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMultiplier(2.0)}>2.0x Double</button>
          <button className={`btn btn-sm ${multiplier === 3.0 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMultiplier(3.0)}>3.0x Aggressive</button>
        </div>
      </div>

      {/* Interactive Range Slider */}
      <div style={{ margin: '20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
          <span>Scaling Factor: <strong style={{ color: '#F8FAFC' }}>{multiplier.toFixed(1)}x</strong></span>
          <span className="mono" style={{ color: '#38BDF8', fontSize: '15px' }}>{formatINR(simulatedSpend)} Monthly Budget</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="3.5"
          step="0.1"
          value={multiplier}
          onChange={(e) => setMultiplier(parseFloat(e.target.value))}
          style={{ width: '100%', height: '8px', borderRadius: '4px', accentColor: '#6366F1', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
          <span>0.5x (Conservative)</span>
          <span>1.0x (Baseline)</span>
          <span>2.0x (High Growth)</span>
          <span>3.5x (Aggressive blitz)</span>
        </div>
      </div>

      {/* Projected Metrics Output Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Target size={13} color="#818CF8" /> Projected Inquiries
          </div>
          <div className="mono" style={{ fontSize: '20px', fontWeight: 800, color: '#38BDF8', marginTop: '4px' }}>
            {formatNumberIN(simulatedLeads)} <span style={{ fontSize: '11px', fontWeight: 400, color: 'var(--text-muted)' }}>({multiplier >= 1 ? `+${((simulatedLeads - currentLeads) / currentLeads * 100).toFixed(0)}%` : `${((simulatedLeads - currentLeads) / currentLeads * 100).toFixed(0)}%`})</span>
          </div>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <DollarSign size={13} color="#F59E0B" /> Estimated CPL
          </div>
          <div className="mono" style={{ fontSize: '20px', fontWeight: 800, color: simulatedCpl <= currentCpl ? '#34D399' : '#FBBF24', marginTop: '4px' }}>
            ₹{simulatedCpl} <span style={{ fontSize: '11px', fontWeight: 400, color: 'var(--text-muted)' }}>/ hospital</span>
          </div>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Award size={13} color="#10B981" /> Signed Facilities
          </div>
          <div className="mono" style={{ fontSize: '20px', fontWeight: 800, color: '#34D399', marginTop: '4px' }}>
            {simulatedSignedHospitals} facilities
          </div>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={13} color="#A78BFA" /> Projected Monthly ARR Boost
          </div>
          <div className="mono" style={{ fontSize: '20px', fontWeight: 800, color: '#A78BFA', marginTop: '4px' }}>
            {formatINR(projectedMonthlyRevenue)}
          </div>
        </div>
      </div>
    </div>
  );
}
