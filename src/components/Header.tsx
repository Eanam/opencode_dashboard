import React from 'react';
import { ServerState, Project } from '../lib/types';

interface HeaderProps {
  serverState: ServerState;
  project: Project | null;
}

export const Header: React.FC<HeaderProps> = ({ serverState, project }) => {
  const getStatusColor = () => {
    if (serverState.isConnecting) return 'bg-retro-accent5';
    if (serverState.isConnected) return 'bg-retro-accent4 animate-glow';
    return 'bg-retro-red';
  };

  const getStatusText = () => {
    if (serverState.isConnecting) return 'CONNECTING...';
    if (serverState.isConnected) return 'ONLINE';
    return 'OFFLINE';
  };

  return (
    <header className="h-14 bg-retro-dark3 border-b-3 border-retro-border flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🕹️</span>
          <span className="title-pixel text-retro-accent3">OPENCODE DASHBOARD</span>
        </div>
        <span className="text-retro-textMuted">|</span>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 ${getStatusColor()}`} />
          <span className="font-pixel text-xs text-retro-textMuted">{getStatusText()}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        {serverState.health && (
          <span className="font-pixel text-xs text-retro-accent5">
            v{serverState.health.version}
          </span>
        )}
        
        {project && (
          <div className="flex items-center gap-2 font-pixel text-xs">
            <span className="text-retro-textMuted">DIR:</span>
            <span className="text-retro-accent3">{project.name}</span>
          </div>
        )}
        
        <span className="font-pixel text-xs text-retro-textMuted">
          {serverState.hostname}:{serverState.port}
        </span>
      </div>
    </header>
  );
};
