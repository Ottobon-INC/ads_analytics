import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  Phone, 
  MessageSquare, 
  Copy, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Clock 
} from 'lucide-react';
import { exportToCSV } from '../../utils/dataTransformers';
import { CONTACT_SLOTS } from '../../config/sheets';

const STATUS_OPTIONS = ['All', 'New', 'Contacted', 'In Progress', 'Qualified', 'Converted', 'Lost'];

export default function LeadTable({ 
  leads = [], 
  onSelectLead, 
  onUpdateStatus, 
  showFullControls = true 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedSlot, setSelectedSlot] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [copiedId, setCopiedId] = useState(null);

  // Extract unique cities from sheet
  const cityOptions = useMemo(() => {
    const set = new Set(leads.map(l => l.city).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [leads]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      if (selectedStatus !== 'All' && lead.status !== selectedStatus) {
        return false;
      }
      if (selectedCity !== 'All' && (lead.city || '').toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }
      if (selectedSlot !== 'All' && !(lead.contactTime || '').toLowerCase().includes(selectedSlot.toLowerCase())) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (lead.name || '').toLowerCase().includes(q);
        const matchCity = (lead.city || '').toLowerCase().includes(q);
        const matchPhone = (lead.phone || '').toLowerCase().includes(q);
        const matchTime = (lead.contactTime || '').toLowerCase().includes(q);
        const matchNotes = (lead.notes || '').toLowerCase().includes(q);
        if (!matchName && !matchCity && !matchPhone && !matchTime && !matchNotes) {
          return false;
        }
      }
      return true;
    });
  }, [leads, selectedStatus, selectedCity, selectedSlot, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage, pageSize]);

  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'New': return 'badge-new';
      case 'Contacted': return 'badge-contacted';
      case 'In Progress': return 'badge-in_progress';
      case 'Qualified': return 'badge-qualified';
      case 'Converted': return 'badge-converted';
      case 'Lost': return 'badge-lost';
      default: return 'badge-new';
    }
  };

  const getSlotColor = (slot) => {
    const lower = (slot || '').toLowerCase();
    if (lower.includes('morn')) return { bg: '#FFFBEB', color: '#D97706', border: '#FDE68A' };
    if (lower.includes('after')) return { bg: '#EFF6FF', color: '#0284C7', border: '#BAE6FD' };
    if (lower.includes('even')) return { bg: '#FAF5FF', color: '#7C3AED', border: '#E9D5FF' };
    return { bg: '#ECFDF5', color: '#059669', border: '#A7F3D0' };
  };

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>Live Google Sheet Leads & CRM Table</h3>
              <span className="badge badge-qualified" style={{ fontSize: '11px' }}>🟢 Live Sync</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Showing {filteredLeads.length} leads loaded directly from your Google Sheet
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => exportToCSV(filteredLeads)}
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        {showFullControls && (
          <div className="responsive-filter-bar" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', alignItems: 'center' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', gridColumn: 'span 2' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="input-control"
                placeholder="Search by name, phone, city, preferred time..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                style={{ paddingLeft: '36px' }}
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                className="select-control"
                value={selectedStatus}
                onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>
                    Status: {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <select
                className="select-control"
                value={selectedCity}
                onChange={(e) => { setSelectedCity(e.target.value); setCurrentPage(1); }}
              >
                {cityOptions.map(city => (
                  <option key={city} value={city}>
                    City: {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Contact Slot Filter */}
            <div>
              <select
                className="select-control"
                value={selectedSlot}
                onChange={(e) => { setSelectedSlot(e.target.value); setCurrentPage(1); }}
              >
                <option value="All">All Call Slots</option>
                {CONTACT_SLOTS.map(slot => (
                  <option key={slot} value={slot}>
                    Slot: {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
        <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>Full Name</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>Phone Number</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>City</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>Speciality</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>Preferred Slot</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>Attempts</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>Date</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLeads.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No leads found matching current filters in your Google Sheet.
                </td>
              </tr>
            ) : (
              paginatedLeads.map((lead) => {
                const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
                const waUrl = cleanPhone ? `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=Hi%20${encodeURIComponent(lead.name)},%20reaching%20out%20regarding%20your%20inquiry.` : null;
                const slotStyle = getSlotColor(lead.contactTime);

                return (
                  <tr 
                    key={lead.id}
                    style={{ 
                      borderBottom: '1px solid #F1F5F9',
                      transition: 'background var(--transition-fast)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    onClick={() => onSelectLead && onSelectLead(lead)}
                  >
                    {/* Full Name */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{lead.name}</div>
                      {lead.time && (
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Time: {lead.time}</div>
                      )}
                    </td>

                    {/* Phone Number */}
                    <td style={{ padding: '12px 16px' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="mono" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {lead.phone}
                        </span>
                        {lead.phone && lead.phone !== '—' && (
                          <button
                            className="btn btn-ghost btn-icon"
                            style={{ padding: '2px 4px', fontSize: '10px' }}
                            onClick={() => handleCopy(lead.phone, `phone-${lead.id}`)}
                            title="Copy Phone"
                          >
                            {copiedId === `phone-${lead.id}` ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                          </button>
                        )}
                      </div>
                    </td>

                    {/* City */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontWeight: 500 }}>
                        <MapPin size={13} color="#4F46E5" />
                        <span>{lead.city}</span>
                      </div>
                    </td>

                    {/* Speciality */}
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)' }}>
                        {lead.speciality || '—'}
                      </span>
                    </td>

                    {/* Preferred Slot */}
                    <td style={{ padding: '12px 16px' }}>
                      <span 
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: slotStyle.bg,
                          color: slotStyle.color,
                          border: `1px solid ${slotStyle.border}`,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Clock size={11} /> {lead.contactTime || 'Anytime'}
                      </span>
                    </td>

                    {/* Previous Attempts */}
                    <td style={{ padding: '12px 16px' }}>
                      <span className="mono" style={{ fontSize: '12px', fontWeight: 700, color: lead.attempts > 1 ? '#D97706' : 'var(--text-secondary)' }}>
                        {lead.attempts} {lead.attempts === 1 ? 'call' : 'calls'}
                      </span>
                    </td>

                    {/* Date */}
                    <td style={{ padding: '12px 16px' }}>
                      <span className="mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {lead.date}
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td style={{ padding: '12px 16px' }} onClick={(e) => e.stopPropagation()}>
                      <select
                        className={`badge ${getStatusBadgeClass(lead.status)}`}
                        value={lead.status}
                        onChange={(e) => onUpdateStatus && onUpdateStatus(lead.id, e.target.value)}
                        style={{ border: 'none', outline: 'none', cursor: 'pointer', padding: '4px 10px' }}
                      >
                        {STATUS_OPTIONS.filter(s => s !== 'All').map(s => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px 16px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                        {lead.phone && lead.phone !== '—' && (
                          <>
                            <a 
                              href={`tel:${lead.phone}`}
                              className="btn btn-ghost btn-icon"
                              title="Call Lead"
                              style={{ padding: '4px 6px', color: '#0284C7' }}
                            >
                              <Phone size={14} />
                            </a>
                            {waUrl && (
                              <a 
                                href={waUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-ghost btn-icon"
                                title="WhatsApp Chat"
                                style={{ padding: '4px 6px', color: '#059669' }}
                              >
                                <MessageSquare size={14} />
                              </a>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredLeads.length)} of {filteredLeads.length} leads
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button 
              className="btn btn-secondary btn-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              style={{ opacity: currentPage === 1 ? 0.5 : 1, padding: '4px 8px' }}
            >
              <ChevronLeft size={14} />
            </button>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', padding: '0 8px' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button 
              className="btn btn-secondary btn-sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              style={{ opacity: currentPage === totalPages ? 0.5 : 1, padding: '4px 8px' }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
