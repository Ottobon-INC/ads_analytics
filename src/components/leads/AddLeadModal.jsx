import React, { useState } from 'react';
import { X, Send, CheckCircle2, UserPlus, MapPin, Clock, PhoneCall } from 'lucide-react';
import { CONTACT_SLOTS } from '../../config/sheets';

export default function AddLeadModal({ isOpen, onClose, onAddLead }) {
  if (!isOpen) return null;

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [contactTime, setContactTime] = useState('Morning');
  const [specificTime, setSpecificTime] = useState('');
  const [attempts, setAttempts] = useState(1);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    onAddLead({
      name: fullName,
      phone,
      city: city || 'Not Specified',
      contactTime,
      time: specificTime || '',
      attempts: Number(attempts) || 1,
      status: 'New',
      notes: notes || `Preferred call slot: ${contactTime} (${specificTime || 'flexible'}). City: ${city}`,
      date: new Date().toLocaleDateString()
    });

    onClose();
  };

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
          maxWidth: '520px',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={20} color="var(--primary-light)" />
            <h3 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>Add New Inbound Lead</h3>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Full Name */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
              Full Name *
            </label>
            <input 
              type="text" 
              className="input-control" 
              required
              placeholder="e.g. Ramesh Kumar"
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
            />
          </div>

          {/* Phone & City */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                Phone Number *
              </label>
              <input 
                type="tel" 
                className="input-control" 
                required
                placeholder="+91 98765 43210"
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                City / Location
              </label>
              <input 
                type="text" 
                className="input-control" 
                placeholder="e.g. Hyderabad / Mumbai"
                value={city} 
                onChange={(e) => setCity(e.target.value)} 
              />
            </div>
          </div>

          {/* Preferred Call Slot & Specific Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                Preferred Contact Slot
              </label>
              <select 
                className="select-control"
                value={contactTime}
                onChange={(e) => setContactTime(e.target.value)}
              >
                {CONTACT_SLOTS.map(slot => (
                  <option key={slot} value={slot} style={{ background: '#0E1424', color: '#F8FAFC' }}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                Specific Time (Optional)
              </label>
              <input 
                type="text" 
                className="input-control" 
                placeholder="e.g. 10:30 AM / 4:00 PM"
                value={specificTime} 
                onChange={(e) => setSpecificTime(e.target.value)} 
              />
            </div>
          </div>

          {/* Previous Attempts */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
              Previous Call Attempts
            </label>
            <input 
              type="number" 
              min="0"
              className="input-control" 
              value={attempts} 
              onChange={(e) => setAttempts(e.target.value)} 
            />
          </div>

          {/* Notes */}
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              CRM Discussion Notes
            </label>
            <textarea 
              className="input-control" 
              rows={2} 
              placeholder="Initial customer requirements, budget discussion, callback instructions..."
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Lead to CRM
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
