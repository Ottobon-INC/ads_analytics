import React, { useState, useEffect } from 'react';
import { 
  X, 
  Phone, 
  MessageSquare, 
  Calendar, 
  MapPin, 
  Clock, 
  Save, 
  Check, 
  Copy, 
  PhoneCall
} from 'lucide-react';

const STATUS_OPTIONS = ['New', 'Contacted', 'In Progress', 'Qualified', 'Converted', 'Lost'];

export default function LeadDetailModal({ 
  lead, 
  onClose, 
  onSaveLead 
}) {
  if (!lead) return null;

  const [status, setStatus] = useState(lead.status || 'New');
  const [notes, setNotes] = useState(lead.notes || '');
  const [attempts, setAttempts] = useState(lead.attempts || 1);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    setStatus(lead.status || 'New');
    setNotes(lead.notes || '');
    setAttempts(lead.attempts || 1);
    setIsSaved(false);
  }, [lead]);

  const handleSave = () => {
    if (onSaveLead) {
      onSaveLead(lead.id, { status, notes, attempts });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    }
  };

  const handleCopy = (val, fieldName) => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
  const waUrl = cleanPhone ? `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=Hi%20${encodeURIComponent(lead.name)},%20connecting%20regarding%20your%20inquiry.` : null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '500px',
          height: '100%',
          padding: '24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          borderLeft: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Lead Profile & Contact Card
            </span>
            <h2 style={{ fontSize: '22px', color: 'var(--text-primary)', marginTop: '2px' }}>
              {lead.name}
            </h2>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <MapPin size={14} color="#4F46E5" />
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{lead.city || 'Location N/A'}</span>
            </div>
          </div>
          <button 
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            style={{ borderRadius: '50%', padding: '8px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Action Contact Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {cleanPhone && (
            <a 
              href={`tel:${lead.phone}`}
              className="btn btn-secondary"
              style={{ padding: '10px', fontSize: '12px', color: '#0284C7' }}
            >
              <Phone size={15} /> Call ({lead.phone})
            </a>
          )}
          {waUrl && (
            <a 
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
              style={{ padding: '10px', fontSize: '12px', color: '#059669' }}
            >
              <MessageSquare size={15} /> WhatsApp
            </a>
          )}
        </div>

        {/* Preferred Time Slot & Call Attempts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="glass-card" style={{ padding: '14px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={13} color="#D97706" /> Preferred Slot
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#D97706', marginTop: '4px' }}>
              {lead.contactTime || 'Anytime'} {lead.time ? `(${lead.time})` : ''}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '14px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <PhoneCall size={13} color="#0284C7" /> Call Attempts
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span className="mono" style={{ fontSize: '14px', fontWeight: 700, color: '#0284C7' }}>
                {attempts} calls
              </span>
              <button 
                className="btn btn-secondary btn-sm" 
                style={{ padding: '1px 6px', fontSize: '10px' }}
                onClick={() => setAttempts(a => a + 1)}
              >
                + Log Call
              </button>
            </div>
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="glass-card" style={{ padding: '16px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
            Pipeline Status
          </label>
          <select 
            className="select-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ fontSize: '14px', fontWeight: 600 }}
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Lead Details Grid */}
        <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={14} /> Phone Number
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="mono" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{lead.phone}</span>
              <button 
                className="btn btn-ghost btn-icon" 
                style={{ padding: '2px 4px' }}
                onClick={() => handleCopy(lead.phone, 'phone')}
              >
                {copiedField === 'phone' ? <Check size={12} color="#059669" /> : <Copy size={12} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} /> City
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
              {lead.city}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 700 }}>🩺</span> Speciality
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
              {lead.speciality || '—'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} /> Submission Date
            </span>
            <span className="mono" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {lead.date}
            </span>
          </div>
        </div>

        {/* Discussion Notes Editor */}
        <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Discussion Notes
            </label>
            {isSaved && (
              <span style={{ fontSize: '11px', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <Check size={12} /> Changes Saved!
              </span>
            )}
          </div>
          <textarea
            className="input-control"
            rows={4}
            placeholder="Record customer preferences, callback notes, conversation summary..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ resize: 'vertical', lineHeight: 1.6 }}
          />

          <button 
            className="btn btn-primary"
            onClick={handleSave}
            style={{ alignSelf: 'flex-end', marginTop: '4px' }}
          >
            <Save size={14} /> Save Follow-up Update
          </button>
        </div>
      </div>
    </div>
  );
}
