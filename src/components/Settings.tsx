import React, { useState, useEffect } from 'react';
import { ServerConfig } from '../lib/types';

interface SettingsProps {
  config: ServerConfig;
  onConfigChange: (config: ServerConfig) => void;
}

const DEFAULT_CONFIG: ServerConfig = {
  port: 4096,
  hostname: '127.0.0.1',
  autoStart: false,
};

const STORAGE_KEY = 'opencode_dashboard_config';

export const Settings: React.FC<SettingsProps> = ({ config, onConfigChange }) => {
  const [localConfig, setLocalConfig] = useState<ServerConfig>(config);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setLocalConfig({ ...DEFAULT_CONFIG, ...parsed });
      } catch {}
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localConfig));
    onConfigChange(localConfig);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setLocalConfig(DEFAULT_CONFIG);
    localStorage.removeItem(STORAGE_KEY);
    onConfigChange(DEFAULT_CONFIG);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b-3 border-retro-border bg-retro-dark3">
        <h2 className="title-pixel text-retro-textMuted">⚙️ CONFIG</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-retro-bg">
        <section className="card-pixel">
          <h3 className="title-pixel text-retro-accent3 mb-4">🎮 SERVER CONNECTION</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block font-pixel text-xs text-retro-accent5 mb-2">PORT</label>
              <input
                type="number"
                value={localConfig.port}
                onChange={(e) => setLocalConfig(prev => ({ ...prev, port: parseInt(e.target.value) || 4096 }))}
                className="w-full input-pixel font-mono"
                placeholder="4096"
                min={1024}
                max={65535}
              />
              <p className="text-xs text-retro-textMuted mt-2">
                Server port number
              </p>
            </div>

            <div>
              <label className="block font-pixel text-xs text-retro-accent5 mb-2">HOSTNAME</label>
              <input
                type="text"
                value={localConfig.hostname}
                onChange={(e) => setLocalConfig(prev => ({ ...prev, hostname: e.target.value }))}
                className="w-full input-pixel font-mono"
                placeholder="127.0.0.1"
              />
              <p className="text-xs text-retro-textMuted mt-2">
                Server IP or hostname
              </p>
            </div>
          </div>
        </section>

        <section className="card-pixel border-retro-accent2">
          <h3 className="title-pixel text-retro-accent mb-4">📋 HOW TO PLAY</h3>
          <div className="space-y-3 text-sm">
            <p className="text-retro-text">
              1. Start the OpenCode server:
            </p>
            <div className="bg-retro-dark3 p-3 border-l-2 border-retro-accent3">
              <code className="text-retro-accent3 font-mono text-sm">
                opencode serve --port {localConfig.port}
              </code>
            </div>
            <p className="text-retro-text mt-2">
              2. Use attach in your projects:
            </p>
            <div className="bg-retro-dark3 p-3 border-l-2 border-retro-accent3">
              <code className="text-retro-accent3 font-mono text-sm">
                opencode attach http://localhost:{localConfig.port}
              </code>
            </div>
          </div>
        </section>

        <section className="card-pixel">
          <h3 className="title-pixel text-retro-accent4 mb-4">👤 ABOUT</h3>
          <div className="space-y-2 text-sm">
            <p className="text-retro-white">OPENCODE DASHBOARD</p>
            <p className="text-retro-textMuted">
              A pixel-perfect monitor for your AI coding sessions
            </p>
            <p className="text-retro-textMuted text-xs mt-4">
              Connect to <code className="bg-retro-dark3 px-1">opencode serve</code> to see events, tool calls, and more!
            </p>
          </div>
        </section>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-retro-accent4 text-black font-pixel text-xs border-3 border-black shadow-pixel hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
          >
            {saved ? '✓ SAVED!' : 'SAVE'}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-3 bg-retro-dark3 border-3 border-retro-border text-retro-textMuted font-pixel text-xs hover:bg-retro-surface"
          >
            RESET
          </button>
        </div>
      </div>
    </div>
  );
};
