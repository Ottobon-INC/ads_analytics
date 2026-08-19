import React from 'react';
import { X, Flame } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 2000,
        maxWidth: '400px',
        background: '#FFFFFF',
        border: '1px solid #CBD5E1',
        boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.12), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
        borderRadius: '14px',
        padding: '16px 18px',
        animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
      }}
    >
      <div 
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '10px',
          background: '#FFFBEB',
          color: '#D97706',
          border: '1px solid #FDE68A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <Flame size={18} color="#D97706" />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span style={{ fontWeight: 700, fontSize: '13px', color: '#0F172A' }}>
            {toast.title}
          </span>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>
            {toast.time}
          </span>
        </div>
        <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
          {toast.message}
        </p>
      </div>

      <button 
        className="btn btn-ghost btn-icon"
        onClick={onClose}
        style={{ padding: '4px', margin: '-4px -6px 0 0', borderRadius: '50%', color: '#94A3B8' }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
