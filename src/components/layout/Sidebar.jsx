import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  FileSpreadsheet, 
  ExternalLink, 
  BarChart3,
  X 
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'leads', label: 'Leads & CRM', icon: Users },
  { id: 'settings', label: 'Sheet Settings', icon: Settings },
];

export default function Sidebar({ 
  activeTab, 
  onSelectTab,
  isOpen = false,
  onClose,
  sheetUrl
}) {
  const handleItemClick = (id) => {
    onSelectTab(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Tablet / Mobile Backdrop Overlay */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />

      {/* Main Sidebar Navigation Panel */}
      <aside className={`app-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Brand Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div 
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#4F46E5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)',
                  flexShrink: 0
                }}
              >
                <BarChart3 size={20} color="#FFFFFF" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '17px', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                  Ad Analytics
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.02em' }}>
                  Live Dashboard
                </div>
              </div>
            </div>

            {/* Close Button on Tablet Drawer */}
            <button
              className="btn btn-ghost btn-icon sidebar-close-btn"
              onClick={onClose}
              style={{ padding: '6px', borderRadius: '8px' }}
              title="Close Menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: 'none',
                    background: isActive ? '#EEF2FF' : 'transparent',
                    color: isActive ? '#4F46E5' : 'var(--text-secondary)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = '#F8FAFC';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  <Icon size={18} color={isActive ? '#4F46E5' : 'currentColor'} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Live Sheet Status Card */}
        <div>
          <div 
            style={{
              padding: '14px 16px',
              background: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              fontSize: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileSpreadsheet size={15} color="#059669" /> Google Sheet
              </span>
              <a 
                href={sheetUrl || '#'} 
                target="_blank" 
                rel="noreferrer" 
                style={{ color: '#4F46E5', display: 'flex', alignItems: 'center' }}
                title="Open Google Sheet in new tab"
              >
                <ExternalLink size={13} />
              </a>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '11px', lineHeight: 1.4 }}>
              Syncing data in real-time.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
