import React from 'react';
import { LayoutDashboard, Users, Settings, Target } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'clicks', label: 'Tracking', icon: Target },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function MobileBottomNav({ activeTab, onSelectTab }) {
  return (
    <nav className="mobile-bottom-nav">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => onSelectTab(item.id)}
          >
            <Icon size={20} className="mobile-nav-icon" />
            <span className="mobile-nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
