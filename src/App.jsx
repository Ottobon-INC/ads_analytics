import React, { useState, useMemo } from 'react';
import { useSheetData } from './hooks/useSheetData';
import { 
  computeKPIs, 
  getDailyTrends, 
  getStatusBreakdown, 
  getCityBreakdown, 
  getContactSlotBreakdown, 
  extractLeadList 
} from './utils/dataTransformers';

import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import MobileBottomNav from './components/layout/MobileBottomNav';
import Overview from './pages/Overview';
import Leads from './pages/Leads';
import Clicks from './pages/Clicks';
import Settings from './pages/Settings';
import LeadDetailModal from './components/leads/LeadDetailModal';



export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedLead, setSelectedLead] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);


  // Data fetching hook connected to user's real Google Sheet
  const {
    rawData,
    headers,
    loading,
    isRefreshing,
    error,
    lastSyncTime,
    isDemoMode,
    sheetsList,
    activeSheetId,
    sheetUrl,
    columnMap,
    refreshInterval,
    dateRange,
    crmOverrides,
    setActiveSheetId,
    addSheet,
    removeSheet,
    setColumnMap,
    setRefreshInterval,
    setDateRange,
    updateLeadCRM,
    refreshData: refreshSheetData,
    parseUploadedCSV,
    loadDemoData
  } = useSheetData();



  const refreshData = () => {
    refreshSheetData();
  };

  const activeSheetName = sheetsList.find(s => s.id === activeSheetId)?.name || 'Ad Analytics';

  // Metric Computations with useMemo
  const kpis = useMemo(() => {
    return computeKPIs(rawData, columnMap, dateRange);
  }, [rawData, columnMap, dateRange]);

  const dailyTrends = useMemo(() => {
    return getDailyTrends(rawData, columnMap, dateRange);
  }, [rawData, columnMap, dateRange]);

  const statusBreakdown = useMemo(() => {
    return getStatusBreakdown(rawData, columnMap, dateRange);
  }, [rawData, columnMap, dateRange]);

  const cityBreakdown = useMemo(() => {
    return getCityBreakdown(rawData, columnMap, dateRange);
  }, [rawData, columnMap, dateRange]);

  const contactSlotBreakdown = useMemo(() => {
    return getContactSlotBreakdown(rawData, columnMap, dateRange);
  }, [rawData, columnMap, dateRange]);

  // Merge raw extracted leads with CRM overrides
  const allLeads = useMemo(() => {
    const extracted = extractLeadList(rawData, columnMap);
    
    return extracted.map(lead => {
      const override = crmOverrides[lead.id];
      if (override) {
        return {
          ...lead,
          status: override.status || lead.status,
          notes: override.notes !== undefined ? override.notes : lead.notes,
          attempts: override.attempts !== undefined ? override.attempts : lead.attempts
        };
      }
      return lead;
    });
  }, [rawData, columnMap, crmOverrides]);

  const handleUpdateStatus = (leadId, newStatus) => {
    updateLeadCRM(leadId, { status: newStatus });
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleSaveLead = (leadId, updates) => {
    updateLeadCRM(leadId, updates);
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => ({ ...prev, ...updates }));
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        sheetUrl={sheetUrl}
      />

      {/* Main Content Area */}
      <div className="app-main-content">
        {/* Top Bar */}
        <TopBar
          dateRange={dateRange}
          onChangeDateRange={setDateRange}
          onRefresh={refreshData}
          isRefreshing={isRefreshing}
          lastSyncTime={lastSyncTime}
          error={error}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          sheetsList={sheetsList}
          activeSheetId={activeSheetId}
          setActiveSheetId={setActiveSheetId}
          sheetUrl={sheetUrl}
        />

        {/* Dynamic Page Content */}
        <main className="app-page-wrapper">
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="skeleton" style={{ height: '120px' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="skeleton" style={{ height: '300px' }} />
                <div className="skeleton" style={{ height: '300px' }} />
              </div>
              <div className="skeleton" style={{ height: '240px' }} />
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <Overview
                  activeSheetName={activeSheetName}
                  kpis={kpis}
                  dailyTrends={dailyTrends}
                  cityBreakdown={cityBreakdown}
                  contactSlotBreakdown={contactSlotBreakdown}
                  leads={allLeads}
                  onSelectLead={setSelectedLead}
                  onUpdateStatus={handleUpdateStatus}
                  onNavigateToTab={setActiveTab}
                  sheetUrl={sheetUrl}
                />
              )}

              {activeTab === 'leads' && (
                <Leads
                  leads={allLeads}
                  cityBreakdown={cityBreakdown}
                  contactSlotBreakdown={contactSlotBreakdown}
                  onSelectLead={setSelectedLead}
                  onUpdateStatus={handleUpdateStatus}
                />
              )}

              {activeTab === 'clicks' && (
                <Clicks />
              )}

              {activeTab === 'settings' && (
                <Settings
                  sheetsList={sheetsList}
                  activeSheetId={activeSheetId}
                  addSheet={addSheet}
                  removeSheet={removeSheet}
                  setActiveSheetId={setActiveSheetId}
                  sheetUrl={sheetUrl}
                  headers={headers}
                  columnMap={columnMap}
                  refreshInterval={refreshInterval}
                  isDemoMode={isDemoMode}
                  lastSyncTime={lastSyncTime}
                  onSaveColumnMap={setColumnMap}
                  onSaveRefreshInterval={setRefreshInterval}
                  onUploadCSV={parseUploadedCSV}
                  onLoadDemoData={loadDemoData}
                  onTestConnection={refreshData}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Slide-over Lead Detail Modal */}
      <LeadDetailModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onSaveLead={handleSaveLead}
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav 
        activeTab={activeTab} 
        onSelectTab={setActiveTab} 
      />
    </div>
  );
}
