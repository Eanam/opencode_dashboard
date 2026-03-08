import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, ViewType } from './components/Sidebar';
import { EventStream } from './components/EventStream';
import { SessionView } from './components/SessionView';
import { ToolLog } from './components/ToolLog';
import { TerminalOutput } from './components/TerminalOutput';
import { FileChanges } from './components/FileChanges';
import { Settings } from './components/Settings';
import { NewSessionModal, QuickStart } from './components/NewSessionModal';
import { useOpenCodeServer } from './hooks/useOpenCodeServer';
import { ServerConfig } from './lib/types';

const DEFAULT_CONFIG: ServerConfig = {
  port: 4096,
  hostname: '127.0.0.1',
  autoStart: false,
};

const STORAGE_KEY = 'opencode_dashboard_config';

function loadConfig(): ServerConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
    }
  } catch {}
  return DEFAULT_CONFIG;
}

function App() {
  const [config, setConfig] = useState<ServerConfig>(loadConfig);
  const [activeView, setActiveView] = useState<ViewType>('events');
  const [showNewSession, setShowNewSession] = useState(false);

  const {
    serverState,
    events,
    currentSession,
    sessions,
    currentProject,
    toolCalls,
    fileChanges,
    bashOutputs,
    sessionMessages,
    isCreatingSession,
    isSendingMessage,
    connect,
    disconnect,
    refreshSessionMessages,
    createAndStartSession,
    sendMessage,
  } = useOpenCodeServer(config.port, config.hostname);

  useEffect(() => {
    connect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (serverState.isConnected) {
      setActiveView('events');
    }
  }, [serverState.isConnected]);

  const handleConfigChange = (newConfig: ServerConfig) => {
    setConfig(newConfig);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    disconnect();
    setTimeout(() => connect(), 500);
  };

  const handleRetry = () => {
    disconnect();
    setTimeout(() => connect(), 500);
  };

  const handleNewSession = (directory: string, prompt: string) => {
    createAndStartSession(directory, prompt);
    setShowNewSession(false);
    setTimeout(() => setActiveView('session'), 500);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'events':
        return <EventStream events={events} />;
      case 'session':
        return (
          <SessionView 
            sessions={sessions} 
            currentSession={currentSession}
            sessionMessages={sessionMessages}
            onSelectSession={(s) => {}}
            onFetchMessages={refreshSessionMessages}
            onSendMessage={sendMessage}
            isSendingMessage={isSendingMessage}
          />
        );
      case 'tools':
        return <ToolLog toolCalls={toolCalls} />;
      case 'terminal':
        return <TerminalOutput bashOutputs={bashOutputs} />;
      case 'files':
        return <FileChanges fileChanges={fileChanges} />;
      case 'settings':
        return <Settings config={config} onConfigChange={handleConfigChange} />;
      default:
        return <EventStream events={events} />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-retro-bg text-retro-text">
      <Header 
        serverState={serverState} 
        project={currentProject} 
      />
      
      <QuickStart onNewSession={() => setShowNewSession(true)} />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          activeView={activeView} 
          onViewChange={setActiveView} 
        />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          {renderContent()}
        </main>
      </div>

      <NewSessionModal
        isOpen={showNewSession}
        onClose={() => setShowNewSession(false)}
        onStartSession={handleNewSession}
        isStarting={isCreatingSession}
      />

      {serverState.error && (
        <div className="fixed bottom-4 right-4 bg-retro-red/20 border-3 border-retro-red text-retro-red px-4 py-3 max-w-md shadow-pixel">
          <div className="flex justify-between items-center gap-4">
            <span className="font-pixel text-xs">⚠️ ERROR: {serverState.error}</span>
            <button 
              onClick={handleRetry}
              className="px-3 py-1 bg-retro-red text-white font-pixel text-xs border-2 border-black hover:bg-red-600"
            >
              RETRY
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
