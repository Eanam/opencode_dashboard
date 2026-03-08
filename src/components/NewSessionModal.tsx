import React, { useState } from 'react';

interface NewSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSession: (directory: string, prompt: string) => void;
  isStarting: boolean;
}

export const NewSessionModal: React.FC<NewSessionModalProps> = ({ 
  isOpen, 
  onClose, 
  onStartSession,
  isStarting 
}) => {
  const [directory, setDirectory] = useState('');
  const [prompt, setPrompt] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (directory.trim()) {
      onStartSession(directory.trim(), prompt.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-retro-dark2 border-3 border-retro-accent shadow-pixel-lg w-full max-w-lg">
        <div className="p-6 border-b-3 border-retro-border bg-retro-purple/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🚀</div>
              <div>
                <h2 className="title-pixel text-retro-accent3 text-sm">NEW ADVENTURE</h2>
                <p className="text-retro-textMuted text-sm">Start a new OpenCode session</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 bg-retro-red text-white font-pixel text-xs border-3 border-black hover:bg-red-600"
            >
              X
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block font-pixel text-xs text-retro-accent3 mb-2">
              📁 PROJECT DIRECTORY
            </label>
            <div className="relative">
              <input
                type="text"
                value={directory}
                onChange={(e) => setDirectory(e.target.value)}
                placeholder="/path/to/project"
                className="w-full input-pixel font-mono text-sm"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setDirectory('/Users/eanamchan/VibeCoding')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-retro-accent hover:text-retro-accent2 underline"
              >
                [QUICK]
              </button>
            </div>
          </div>

          <div>
            <label className="block font-pixel text-xs text-retro-accent4 mb-2">
              💬 MISSION (Optional)
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="What would you like to accomplish?"
              rows={3}
              className="w-full input-pixel text-sm resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-retro-dark3 border-3 border-retro-border text-retro-textMuted font-pixel text-xs hover:bg-retro-surface"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={!directory.trim() || isStarting}
              className="flex-1 px-4 py-3 bg-retro-accent4 text-black font-pixel text-xs border-3 border-black shadow-pixel hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isStarting ? (
                <>
                  <span className="animate-blink">⏳</span>
                  LOADING...
                </>
              ) : (
                <>
                  <span>▶️</span>
                  START
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface QuickStartProps {
  onNewSession: () => void;
}

export const QuickStart: React.FC<QuickStartProps> = ({ onNewSession }) => {
  return (
    <div className="p-4 border-b-3 border-retro-border bg-gradient-to-r from-retro-purple/30 to-retro-accent/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-3xl">👾</div>
          <div>
            <h2 className="title-pixel text-retro-white">WELCOME PLAYER ONE</h2>
            <p className="text-retro-textMuted text-sm">Monitor and control your OpenCode sessions</p>
          </div>
        </div>
        <button
          onClick={onNewSession}
          className="px-6 py-3 bg-retro-accent text-white font-pixel text-xs border-3 border-black shadow-pixel hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none flex items-center gap-2"
        >
          <span>➕</span>
          NEW GAME
        </button>
      </div>
    </div>
  );
};
