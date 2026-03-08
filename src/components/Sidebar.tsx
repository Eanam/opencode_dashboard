import React from 'react';

export type ViewType = 'events' | 'session' | 'tools' | 'terminal' | 'files' | 'settings';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const navItems: { id: ViewType; label: string; icon: string; color: string }[] = [
  { id: 'events', label: 'EVENTS', icon: '📡', color: 'text-retro-accent3' },
  { id: 'session', label: 'CHAT', icon: '💬', color: 'text-retro-accent' },
  { id: 'tools', label: 'TOOLS', icon: '🔧', color: 'text-retro-accent5' },
  { id: 'terminal', label: 'TERMINAL', icon: '⬛', color: 'text-retro-accent2' },
  { id: 'files', label: 'FILES', icon: '📁', color: 'text-retro-accent4' },
  { id: 'settings', label: 'CONFIG', icon: '⚙️', color: 'text-retro-textMuted' },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  return (
    <aside className="w-44 bg-retro-dark2 border-r-3 border-retro-border flex flex-col">
      <nav className="flex-1 py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all font-pixel text-xs
              ${activeView === item.id 
                ? 'bg-retro-purple text-white border-l-4 border-retro-accent' 
                : 'text-retro-textMuted hover:bg-retro-dark3 hover:text-retro-text'
              }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className={activeView === item.id ? item.color : ''}>{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="p-4 border-t-3 border-retro-border">
        <div className="text-center">
          <div className="text-xs mb-1">🎮</div>
          <p className="font-pixel text-xs text-retro-textMuted">
            READY
          </p>
        </div>
      </div>
    </aside>
  );
};
