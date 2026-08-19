import React, { useState } from 'react';
import { X, Calculator, Sparkles, TrendingUp } from 'lucide-react';
import { formatINR, formatNumberIN } from '../../utils/dataTransformers';

export default function RoiCalculatorModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [monthlyBudget, setMonthlyBudget] = useState(100000); // ₹1,00,000
  const [targetCpl, setTargetCpl] = useState(180); // ₹180
  const [conversionRate, setConversionRate] = useState(8); // 8%
  const [ticketSize, setTicketSize] = useState(45000); // ₹45,000

  // Calculations
  const projectedLeads = targetCpl > 0 ? Math.floor(monthlyBudget / targetCpl) : 0;
  const projectedDeals = Math.floor(projectedLeads * (conversionRate / 100));
  const projectedRevenue = projectedDeals * ticketSize;
  const projectedProfit = projectedRevenue - monthlyBudget;
  const roas = monthlyBudget > 0 ? (projectedRevenue / monthlyBudget).toFixed(2) : '0';

  const applyPreset = (budget, cpl, cr, ticket) => {
    setMonthlyBudget(budget);
    setTargetCpl(cpl);
    setConversionRate(cr);
    setTicketSize(ticket);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '640px',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calculator size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>Ad Budget & ROI Projection Planner</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Simulate revenue outcomes by adjusting ad spend and CPL targets</p>
            </div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Quick Industry Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Quick Presets:</span>
          <button className="btn btn-secondary btn-sm" onClick={() => applyPreset(150000, 350, 4, 150000)}>
            🏢 Real Estate
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => applyPreset(80000, 140, 10, 24000)}>
            💻 B2B SaaS
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => applyPreset(50000, 75, 12, 12000)}>
            🎓 EdTech / Coaching
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => applyPreset(120000, 220, 7, 65000)}>
            ✨ Luxury Services
          </button>
        </div>

        {/* Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Monthly Ad Spend Budget (₹)
            </label>
            <input 
              type="number"
              className="input-control"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(Number(e.target.value))}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Target Cost Per Lead - CPL (₹)
            </label>
            <input 
              type="number"
              className="input-control"
              value={targetCpl}
              onChange={(e) => setTargetCpl(Number(e.target.value))}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Lead-to-Deal Conversion Rate (%)
            </label>
            <input 
              type="number"
              className="input-control"
              value={conversionRate}
              onChange={(e) => setConversionRate(Number(e.target.value))}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Average Deal / Ticket Value (₹)
            </label>
            <input 
              type="number"
              className="input-control"
              value={ticketSize}
              onChange={(e) => setTicketSize(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Results Banner */}
        <div 
          className="glass-card" 
          style={{ 
            padding: '20px', 
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(16, 185, 129, 0.12) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Projected Leads</div>
              <div className="mono" style={{ fontSize: '20px', fontWeight: 800, color: '#38BDF8', marginTop: '2px' }}>
                {formatNumberIN(projectedLeads)}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Closed Deals</div>
              <div className="mono" style={{ fontSize: '20px', fontWeight: 800, color: '#34D399', marginTop: '2px' }}>
                {formatNumberIN(projectedDeals)}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Projected ROAS</div>
              <div className="mono" style={{ fontSize: '20px', fontWeight: 800, color: '#A78BFA', marginTop: '2px' }}>
                {roas}x
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Projected Revenue:</div>
              <div className="mono" style={{ fontSize: '18px', fontWeight: 800, color: '#F8FAFC' }}>
                {formatINR(projectedRevenue)}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Net Gross Profit:</div>
              <div className="mono" style={{ fontSize: '18px', fontWeight: 800, color: projectedProfit >= 0 ? '#34D399' : '#FB7185' }}>
                {formatINR(projectedProfit)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
