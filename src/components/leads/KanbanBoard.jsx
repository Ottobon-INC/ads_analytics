import React from 'react';
import { 
  Building2, 
  Phone, 
  MessageSquare, 
  ChevronRight, 
  ChevronLeft, 
  MapPin,
  Clock,
  Flame,
  PhoneCall
} from 'lucide-react';

const COLUMNS = [
  { id: 'New', label: 'New Leads', color: '#0081FB', bg: 'rgba(0, 129, 251, 0.1)' },
  { id: 'Contacted', label: 'Contacted', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
  { id: 'In Progress', label: 'In Follow-up', color: '#5746E3', bg: 'rgba(87, 70, 227, 0.1)' },
  { id: 'Qualified', label: 'Qualified', color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.1)' },
  { id: 'Converted', label: 'Converted / Won', color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' }
];

export default function KanbanBoard({ 
  leads = [], 
  onSelectLead, 
  onUpdateStatus 
}) {
  const getNextStatus = (current) => {
    const idx = COLUMNS.findIndex(c => c.id === current);
    return idx < COLUMNS.length - 1 ? COLUMNS[idx + 1].id : null;
  };

  const getPrevStatus = (current) => {
    const idx = COLUMNS.findIndex(c => c.id === current);
    return idx > 0 ? COLUMNS[idx - 1].id : null;
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', overflowX: 'auto', paddingBottom: '16px' }}>
      {COLUMNS.map(col => {
        const colLeads = leads.filter(l => l.status === col.id);

        return (
          <div key={col.id} className="kanban-col">
            {/* Column Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: `2px solid ${col.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color }} />
                <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>
                  {col.label}
                </span>
              </div>
              <span 
                className="mono"
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: col.bg,
                  color: col.color,
                  border: `1px solid ${col.color}44`
                }}
              >
                {colLeads.length}
              </span>
            </div>

            {/* Column Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, minHeight: '300px' }}>
              {colLeads.length === 0 ? (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '12px', fontStyle: 'italic', border: '1px dashed var(--border-subtle)', borderRadius: '8px', minHeight: '120px' }}>
                  No leads in this stage
                </div>
              ) : (
                colLeads.map(lead => {
                  const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
                  const waUrl = cleanPhone ? `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=Hi%20${encodeURIComponent(lead.name)},%20connecting%20regarding%20your%20inquiry.` : null;
                  const next = getNextStatus(lead.status);
                  const prev = getPrevStatus(lead.status);

                  return (
                    <div 
                      key={lead.id} 
                      className="kanban-card"
                      onClick={() => onSelectLead && onSelectLead(lead)}
                    >
                      {/* Top Lead Name & Score */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px' }}>
                        <div>
                          <div style={{ fontWeight: 700, color: '#F8FAFC', fontSize: '13px' }}>
                            {lead.name}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <MapPin size={11} color="var(--primary-light)" />
                            <span>{lead.city || 'Location N/A'}</span>
                          </div>
                        </div>

                        <span 
                          style={{ 
                            fontSize: '10px', 
                            fontWeight: 700, 
                            color: '#34D399', 
                            background: 'rgba(16, 185, 129, 0.15)', 
                            padding: '2px 6px', 
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px'
                          }}
                        >
                          <Flame size={10} color="#F59E0B" /> 92%
                        </span>
                      </div>

                      {/* Contact Slot & Attempts Pill */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '4px 0' }}>
                        <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Clock size={10} /> {lead.contactTime || 'Anytime'}
                        </span>
                        <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <PhoneCall size={10} /> {lead.attempts || 1} call{(lead.attempts || 1) > 1 ? 's' : ''}
                        </span>
                      </div>

                      {/* Notes snippet */}
                      {lead.notes && (
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'rgba(0, 0, 0, 0.2)', padding: '6px 8px', borderRadius: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          "{lead.notes}"
                        </div>
                      )}

                      {/* Card Bottom Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {waUrl && (
                            <a 
                              href={waUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="btn btn-ghost btn-icon"
                              style={{ padding: '3px 5px', color: '#34D399' }}
                              title="WhatsApp Lead"
                            >
                              <MessageSquare size={13} />
                            </a>
                          )}
                          {lead.phone && (
                            <a 
                              href={`tel:${lead.phone}`} 
                              className="btn btn-ghost btn-icon"
                              style={{ padding: '3px 5px', color: '#38BDF8' }}
                              title="Call Lead"
                            >
                              <Phone size={13} />
                            </a>
                          )}
                        </div>

                        {/* Stage Mover */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {prev && (
                            <button
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '2px 6px', fontSize: '10px' }}
                              onClick={() => onUpdateStatus(lead.id, prev)}
                              title="Move Back"
                            >
                              <ChevronLeft size={12} />
                            </button>
                          )}
                          {next && (
                            <button
                              className="btn btn-primary btn-sm"
                              style={{ padding: '2px 8px', fontSize: '10px' }}
                              onClick={() => onUpdateStatus(lead.id, next)}
                              title="Advance Stage"
                            >
                              Advance <ChevronRight size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
