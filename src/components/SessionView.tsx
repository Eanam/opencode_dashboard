import React, { useEffect, useState, useRef } from 'react';
import { Session, SessionMessageFromAPI } from '../lib/types';

interface SessionViewProps {
  sessions: Session[];
  currentSession: Session | null;
  sessionMessages: SessionMessageFromAPI[];
  onSelectSession: (session: Session) => void;
  onFetchMessages: (sessionId: string) => void;
  onSendMessage: (message: string) => void;
  isSendingMessage: boolean;
}

export const SessionView: React.FC<SessionViewProps> = ({ 
  sessions, 
  currentSession,
  sessionMessages,
  onSelectSession,
  onFetchMessages,
  onSendMessage,
  isSendingMessage
}) => {
  const [showMessages, setShowMessages] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentSession) {
      onFetchMessages(currentSession.id);
    }
  }, [currentSession, onFetchMessages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sessionMessages]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() && !isSendingMessage) {
      onSendMessage(messageInput.trim());
      setMessageInput('');
    }
  };

  const renderMessageContent = (message: SessionMessageFromAPI) => {
    return message.parts.map((part, idx) => {
      if (part.type === 'text') {
        return (
          <div key={idx} className="text-retro-text whitespace-pre-wrap">
            {part.text}
          </div>
        );
      }
      if (part.type === 'reasoning') {
        return (
          <div key={idx} className="text-retro-textMuted italic text-sm">
            💭 {part.text}
          </div>
        );
      }
      if (part.type === 'tool') {
        const toolState = part.state as { status?: string; input?: Record<string, unknown>; output?: string } | undefined;
        return (
          <div key={idx} className="bg-retro-dark3 p-2 mt-2 text-xs border-l-2 border-retro-accent3">
            <div className="flex items-center gap-2">
              <span className="text-retro-accent3 font-mono">🔧 {part.tool}</span>
              <span className={`px-2 py-0.5 text-xs ${
                toolState?.status === 'completed' ? 'bg-retro-accent4/30 text-retro-accent4' :
                toolState?.status === 'running' ? 'bg-retro-accent5/30 text-retro-accent5' :
                'bg-retro-textMuted/30 text-retro-textMuted'
              }`}>
                {toolState?.status?.toUpperCase() || 'PENDING'}
              </span>
            </div>
            {toolState?.input && (
              <div className="mt-1 text-retro-textMuted font-mono text-xs">
                {JSON.stringify(toolState.input).substring(0, 100)}
              </div>
            )}
          </div>
        );
      }
      if (part.type === 'step-start') {
        return (
          <div key={idx} className="text-retro-textMuted text-xs mt-2 border-t border-retro-border pt-2">
            ── ⚡ NEW STEP ⚡ ──
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b-3 border-retro-border bg-retro-dark3 flex justify-between items-center">
        <h2 className="title-pixel text-retro-accent">💬 SESSIONS</h2>
        {currentSession && (
          <button 
            onClick={() => setShowMessages(!showMessages)}
            className="font-pixel text-xs text-retro-accent3 hover:underline"
          >
            {showMessages ? '◀ BACK' : 'VIEW ▶'}
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-hidden">
        {showMessages && currentSession ? (
          <div className="h-full flex flex-col">
            <div className="p-3 bg-retro-purple/20 border-b-3 border-retro-border">
              <h3 className="font-pixel text-xs text-retro-white truncate">
                {currentSession.title || 'UNTITLED'}
              </h3>
              <p className="text-xs text-retro-textMuted">
                {sessionMessages.length} MESSAGES • {currentSession.id.substring(0, 12)}...
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-retro-bg">
              {sessionMessages.map((message, idx) => (
                <div 
                  key={idx}
                  className={`p-4 border-3 ${
                    message.info.role === 'user' 
                      ? 'border-retro-accent bg-retro-accent/10 ml-8' 
                      : 'border-retro-accent2 bg-retro-accent2/10 mr-8'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-pixel text-xs ${
                      message.info.role === 'user' ? 'text-retro-accent' : 'text-retro-accent2'
                    }`}>
                      {message.info.role === 'user' ? '👤 PLAYER' : '🤖 AI BOT'}
                    </span>
                    <span className="font-pixel text-xs text-retro-textMuted">
                      {formatTime(message.info.time.created)}
                    </span>
                  </div>
                  {renderMessageContent(message)}
                </div>
              ))}
              {isSendingMessage && (
                <div className="p-4 border-3 border-retro-accent2 bg-retro-accent2/10 mr-8">
                  <div className="flex items-center gap-2 text-retro-accent2">
                    <span className="animate-blink text-xl">🤖</span>
                    <span className="font-pixel text-xs">THINKING...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t-3 border-retro-border bg-retro-dark3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your command..."
                  className="flex-1 input-pixel font-mono text-sm"
                  disabled={isSendingMessage}
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim() || isSendingMessage}
                  className="px-6 py-3 bg-retro-accent text-white font-pixel text-xs border-3 border-black shadow-pixel hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:opacity-50"
                >
                  {isSendingMessage ? '...' : 'SEND'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
            {sessions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎮</div>
                <p className="title-pixel text-retro-textMuted">NO SESSIONS</p>
                <p className="text-retro-textMuted text-sm mt-2">Start a new adventure!</p>
              </div>
            ) : (
              <div className="divide-y divide-retro-border">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => {
                      onSelectSession(session);
                      setShowMessages(true);
                    }}
                    className="p-4 hover:bg-retro-dark3 cursor-pointer transition-colors border-l-4 border-transparent hover:border-retro-accent"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-pixel text-xs text-retro-text truncate">
                        {session.title || 'UNTITLED SESSION'}
                      </h3>
                      {session.agent && (
                        <span className="text-xs text-retro-textMuted bg-retro-dark3 px-2 py-1">
                          {session.agent}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2 font-pixel text-xs text-retro-textMuted">
                      <span>ID: {session.id.substring(0, 8)}...</span>
                      <span>{formatTime(session.time?.updated || session.updatedAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
