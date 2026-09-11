import React from 'react';
import { 
  Users, 
  MapPin, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import KPICard from '../components/kpi/KPICard';
import SpendTrendChart from '../components/charts/SpendTrendChart';
import CityDonut from '../components/charts/CityDonut';
import ContactSlotBar from '../components/charts/ContactSlotBar';
import LeadTable from '../components/leads/LeadTable';

import { formatNumberIN } from '../utils/dataTransformers';
import { IndianRupee, MousePointerClick, Activity } from 'lucide-react';

export default function Overview({
  activeSheetName = 'Ad Analytics',
  kpis,
  dailyTrends,
  cityBreakdown,
  contactSlotBreakdown,
  leads,

  onSelectLead,
  onUpdateStatus,
  onNavigateToTab,
  sheetUrl
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Live Google Sheet Connected Hero Header */}
      <div 
        className="glass-card responsive-hero" 
        style={{ 
          padding: '24px 28px',
          background: 'linear-gradient(135deg, #EEF2FF 0%, #F8FAFC 100%)',
          border: '1px solid #E0E7FF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-qualified" style={{ background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}>
              🟢 Live Google Sheet Connected
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Streaming directly from your spreadsheet
            </span>
          </div>
          <h2 style={{ fontSize: '24px', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {activeSheetName} Dashboard
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '780px', lineHeight: 1.5 }}>
            Real-time analytics for all inbound customer inquiries, city distribution, and call availability slots.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a 
            href={sheetUrl || '#'}
            target="_blank" 
            rel="noreferrer" 
            className="btn btn-secondary"
            style={{ fontSize: '13px' }}
          >
            <ExternalLink size={14} /> Open Live Spreadsheet
          </a>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div 
        className="responsive-kpi-grid"
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', 
          gap: '16px' 
        }}
      >
        <KPICard
          label="Total Inbound Leads"
          value={formatNumberIN(kpis.totalLeads)}
          icon={Users}
          accentColor="indigo"
          helperText="Total customer inquiries in spreadsheet"
        />

        <KPICard
          label="Active Cities Covered"
          value={`${kpis.totalCities} Cities`}
          icon={MapPin}
          accentColor="blue"
          helperText="Geographic territories identified"
        />

      </div>


      {/* Row 3: City Geographic Split & Preferred Call Slots */}
      <div 
        className="responsive-2col"
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', 
          gap: '20px' 
        }}
      >
        <CityDonut data={cityBreakdown} />
        <ContactSlotBar data={contactSlotBreakdown} />
      </div>

      {/* Row 4: Recent Lead Activity Feed Table */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>Recent Lead Activity</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Latest incoming entries from your Google Sheet</p>
          </div>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigateToTab('leads')}
          >
            View All {leads.length} Leads <ArrowRight size={14} />
          </button>
        </div>

        <LeadTable
          leads={leads.slice(0, 8)}
          onSelectLead={onSelectLead}
          onUpdateStatus={onUpdateStatus}
          showFullControls={false}
        />
      </div>

      {/* Row 5: Inbound Lead Volume Timeline */}
      <SpendTrendChart data={dailyTrends} />
    </div>
  );
}
