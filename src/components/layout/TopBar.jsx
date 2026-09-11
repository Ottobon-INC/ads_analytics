import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  RefreshCw, 
  Clock, 
  AlertTriangle,
  FileSpreadsheet,
  Menu
} from 'lucide-react';

const DATE_RANGE_OPTIONS = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: '7d', label: 'Last 7 Days' },
  { id: '30d', label: 'Last 30 Days' },
  { id: 'this_month', label: 'This Month' },
  { id: 'all', label: 'All Time' }
];

export default function TopBar({
  dateRange,
  onChangeDateRange,
  onRefresh,
  isRefreshing,
  lastSyncTime,
  error,
  onToggleMobileSidebar,
  sheetsList,
  activeSheetId,
  setActiveSheetId,
  sheetUrl
}) {
  const [timeAgo, setTimeAgo] = useState('just now');

  useEffect(() => {
    if (!lastSyncTime) return;

    const updateRelativeTime = () => {
      const seconds = Math.floor((new Date() - new Date(lastSyncTime)) / 1000);
      if (seconds < 5) setTimeAgo('just now');
      else if (seconds < 60) setTimeAgo(`${seconds}s ago`);
      else if (seconds < 3600) setTimeAgo(`${Math.floor(seconds / 60)}m ago`);
      else setTimeAgo(`${Math.floor(seconds / 3600)}h ago`);
    };

    updateRelativeTime();
    const interval = setInterval(updateRelativeTime, 5000);
    return () => clearInterval(interval);
  }, [lastSyncTime]);

  return (
    <header 
      className="topbar-header"
      style={{
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        background: '#FFFFFF',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 9
      }}
    >
      {/* Left: Tablet Hamburger Trigger & Date Filter & Account Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {/* Hamburger button visible only on Tablet & Mobile */}
        <button
          className="btn btn-secondary btn-icon tablet-hamburger-btn"
          onClick={onToggleMobileSidebar}
          style={{ padding: '7px 9px', borderRadius: '8px' }}
          title="Open Menu"
        >
          <Menu size={18} />
        </button>

        {/* Sheet Switcher */}
        {sheetsList && sheetsList.length > 0 && (
          <select 
            value={activeSheetId} 
            onChange={(e) => setActiveSheetId(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              background: '#F8FAFC',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--text-primary)',
              cursor: 'pointer',
              outline: 'none',
              minWidth: '150px'
            }}
          >
            {sheetsList.map((sheet) => (
              <option key={sheet.id} value={sheet.id}>
                {sheet.name || 'Unnamed Sheet'}
              </option>
            ))}
          </select>
        )}

        {/* Date Range Selector Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500 }}>
            <Calendar size={14} color="#4F46E5" /> Range:
          </div>
          <div style={{ display: 'flex', background: '#F1F5F9', padding: '3px', borderRadius: '10px', flexWrap: 'wrap', gap: '2px' }}>
            {DATE_RANGE_OPTIONS.map((opt) => {
              const isActive = dateRange === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => onChangeDateRange(opt.id)}
                  className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}
                  style={{
                    fontSize: '11px',
                    padding: '4px 10px',
                    borderRadius: '7px',
                    background: isActive ? '#FFFFFF' : 'transparent',
                    color: isActive ? '#0F172A' : 'var(--text-secondary)',
                    boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    fontWeight: isActive ? 700 : 500
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Sync Status & Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {/* Live Google Sheet Link */}
        <a 
          href={sheetUrl || '#'}
          target="_blank"
          rel="noreferrer"
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '12px', padding: '6px 10px', color: 'var(--text-primary)' }}
        >
          <FileSpreadsheet size={14} color="#059669" />
          <span>Spreadsheet</span>
        </a>

        {/* Sync Status badge */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '5px', 
            fontSize: '11px', 
            color: error ? '#E11D48' : 'var(--text-secondary)',
            background: '#F8FAFC',
            padding: '5px 10px',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)'
          }}
        >
          {error ? (
            <>
              <AlertTriangle size={13} color="#E11D48" />
              <span>Sync Alert</span>
            </>
          ) : (
            <>
              <Clock size={13} color="#059669" />
              <span>Synced {timeAgo}</span>
            </>
          )}
        </div>

        {/* Refresh Button */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          style={{ padding: '6px 12px' }}
          title="Refresh Data from Google Sheet"
        >
          <RefreshCw size={13} className={isRefreshing ? 'animate-spin-fast' : ''} />
          <span>{isRefreshing ? 'Syncing...' : 'Sync'}</span>
        </button>
      </div>
    </header>
  );
}
