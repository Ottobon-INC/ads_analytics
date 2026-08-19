import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  RefreshCw, 
  Clock, 
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import { USER_LIVE_SHEET_URL } from '../../config/sheets';

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
  error
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
      style={{
        padding: '16px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        background: '#FFFFFF',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 9
      }}
    >
      {/* Date Range Selector Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px', marginRight: '4px', fontWeight: 500 }}>
          <Calendar size={15} color="#4F46E5" /> Range:
        </div>
        <div style={{ display: 'flex', background: '#F1F5F9', padding: '3px', borderRadius: '10px' }}>
          {DATE_RANGE_OPTIONS.map((opt) => {
            const isActive = dateRange === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onChangeDateRange(opt.id)}
                className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}
                style={{
                  fontSize: '12px',
                  padding: '5px 12px',
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

      {/* Sync Status & Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Live Google Sheet Link */}
        <a 
          href={USER_LIVE_SHEET_URL}
          target="_blank"
          rel="noreferrer"
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '12px', padding: '6px 12px', color: 'var(--text-primary)' }}
        >
          <FileSpreadsheet size={14} color="#059669" />
          <span>View Spreadsheet</span>
        </a>

        {/* Sync Status badge */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            fontSize: '12px', 
            color: error ? '#E11D48' : 'var(--text-secondary)',
            background: '#F8FAFC',
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)'
          }}
        >
          {error ? (
            <>
              <AlertTriangle size={14} color="#E11D48" />
              <span>Sync Alert</span>
            </>
          ) : (
            <>
              <Clock size={14} color="#059669" />
              <span>Synced {timeAgo}</span>
            </>
          )}
        </div>

        {/* Refresh Button */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          style={{ padding: '7px 14px' }}
          title="Refresh Data from Google Sheet"
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin-fast' : ''} />
          <span>{isRefreshing ? 'Syncing...' : 'Sync'}</span>
        </button>
      </div>
    </header>
  );
}
