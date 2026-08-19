import React from 'react';
import LeadTable from '../components/leads/LeadTable';
import CityDonut from '../components/charts/CityDonut';
import ContactSlotBar from '../components/charts/ContactSlotBar';

export default function Leads({
  leads = [],
  cityBreakdown,
  contactSlotBreakdown,
  onSelectLead,
  onUpdateStatus
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner with City & Contact Slot Summaries */}
      <div 
        className="responsive-2col"
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '20px',
          alignItems: 'start'
        }}
      >
        <CityDonut data={cityBreakdown} />
        <ContactSlotBar data={contactSlotBreakdown} />
      </div>

      {/* Main CRM Table View */}
      <LeadTable
        leads={leads}
        onSelectLead={onSelectLead}
        onUpdateStatus={onUpdateStatus}
        showFullControls={true}
      />
    </div>
  );
}
