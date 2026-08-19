import React, { useState } from 'react';
import { X, Calculator, Sparkles, HeartPulse, Clock, TrendingUp, CheckCircle2 } from 'lucide-react';
import { formatINR, formatNumberIN } from '../../utils/dataTransformers';
import { MEDCY_INFO } from '../../config/sheets';

export default function MedcyPricingCalculator({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [dailyOpd, setDailyOpd] = useState(120); // 120 patients/day
  const [workingDays, setWorkingDays] = useState(26); // 26 days/month
  const [doctorsCount, setDoctorsCount] = useState(4);
  const [packageType, setPackageType] = useState('complete'); // 'whatsapp', 'op_desk', 'sakhi', 'complete'

  // Pricing constants based on Medcy Health Tech model
  const costPerPatient = packageType === 'complete' ? 50 : (packageType === 'sakhi' ? 35 : 25);
  const monthlyPatients = dailyOpd * workingDays;
  const monthlyCost = monthlyPatients * costPerPatient;

  // Impact metrics
  const hoursSavedPerMonth = Math.round(monthlyPatients * 0.12); // ~7 mins saved per patient registration & post-care
  const extraRevisitsPerMonth = Math.round(monthlyPatients * 0.09); // 9% boost from Post-Care Sakhi follow-up reminders
  const revenueBoostFromRevisits = extraRevisitsPerMonth * 600; // avg ₹600 OPD consult fee
  const netEstimatedBenefit = revenueBoostFromRevisits - monthlyCost;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
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
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          border: '1px solid rgba(87, 70, 227, 0.3)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(87, 70, 227, 0.2)', color: '#818CF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HeartPulse size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '19px', color: 'var(--text-primary)' }}>Medcy Patient Experience ROI Calculator</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Solutions starting as low as ₹50 per patient for clinics & hospitals
              </p>
            </div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Quick Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Facility Presets:</span>
          <button className="btn btn-secondary btn-sm" onClick={() => { setDailyOpd(45); setDoctorsCount(2); setPackageType('whatsapp'); }}>
            🏥 Small Clinic (45 OPD)
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => { setDailyOpd(120); setDoctorsCount(5); setPackageType('complete'); }}>
            🏩 Poly-Clinic / Specialty (120 OPD)
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => { setDailyOpd(350); setDoctorsCount(15); setPackageType('complete'); }}>
            🏢 100-Bed Hospital (350 OPD)
          </button>
        </div>

        {/* Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Average Daily OPD Patients
            </label>
            <input 
              type="number"
              className="input-control"
              value={dailyOpd}
              onChange={(e) => setDailyOpd(Math.max(1, Number(e.target.value)))}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Active Doctors / Consultation Rooms
            </label>
            <input 
              type="number"
              className="input-control"
              value={doctorsCount}
              onChange={(e) => setDoctorsCount(Math.max(1, Number(e.target.value)))}
            />
          </div>
        </div>

        {/* Package Selector */}
        <div>
          <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
            Select Medcy Solution Suite:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
            <button
              type="button"
              className={`btn btn-sm ${packageType === 'whatsapp' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setPackageType('whatsapp')}
              style={{ fontSize: '11px', padding: '8px' }}
            >
              WhatsApp Only (₹25/pt)
            </button>
            <button
              type="button"
              className={`btn btn-sm ${packageType === 'op_desk' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setPackageType('op_desk')}
              style={{ fontSize: '11px', padding: '8px' }}
            >
              Digital OP Desk (₹25/pt)
            </button>
            <button
              type="button"
              className={`btn btn-sm ${packageType === 'sakhi' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setPackageType('sakhi')}
              style={{ fontSize: '11px', padding: '8px' }}
            >
              Post-Care Sakhi (₹35/pt)
            </button>
            <button
              type="button"
              className={`btn btn-sm ${packageType === 'complete' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setPackageType('complete')}
              style={{ fontSize: '11px', padding: '8px' }}
            >
              Complete Bundle (₹50/pt)
            </button>
          </div>
        </div>

        {/* Projected ROI Results Card */}
        <div 
          className="glass-card" 
          style={{ 
            padding: '20px', 
            background: 'linear-gradient(135deg, rgba(87, 70, 227, 0.15) 0%, rgba(16, 185, 129, 0.12) 100%)',
            border: '1px solid rgba(87, 70, 227, 0.3)'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Monthly Patients</div>
              <div className="mono" style={{ fontSize: '20px', fontWeight: 800, color: '#F8FAFC', marginTop: '2px' }}>
                {formatNumberIN(monthlyPatients)}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Front-Desk Hours Saved</div>
              <div className="mono" style={{ fontSize: '20px', fontWeight: 800, color: '#38BDF8', marginTop: '2px' }}>
                {hoursSavedPerMonth} hrs/mo
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Follow-up Revisit Boost</div>
              <div className="mono" style={{ fontSize: '20px', fontWeight: 800, color: '#34D399', marginTop: '2px' }}>
                +{extraRevisitsPerMonth} patients
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Monthly Medcy Software Cost:</div>
              <div className="mono" style={{ fontSize: '18px', fontWeight: 800, color: '#A78BFA' }}>
                {formatINR(monthlyCost)} <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--text-muted)' }}>(₹{costPerPatient}/patient)</span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Estimated Net Revenue Gain:</div>
              <div className="mono" style={{ fontSize: '18px', fontWeight: 800, color: netEstimatedBenefit >= 0 ? '#34D399' : '#FB7185' }}>
                +{formatINR(Math.max(0, netEstimatedBenefit))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255, 255, 255, 0.02)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '12px' }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Questions on custom hospital pricing?</span>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Contact {MEDCY_INFO.contactEmail} • {MEDCY_INFO.contactPhone}</div>
          </div>
          <a href={`mailto:${MEDCY_INFO.contactEmail}?subject=Medcy%20Pricing%20Discussion`} className="btn btn-primary btn-sm">
            Contact Gitika
          </a>
        </div>
      </div>
    </div>
  );
}
