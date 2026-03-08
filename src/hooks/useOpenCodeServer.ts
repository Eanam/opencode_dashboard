import { useState, useEffect, useCallback, useRef } from 'react';
import { createApi, OpenCodeAPI } from '../lib/api';
import { 
  ServerState, 
  BusEvent, 
  Session, 
  Project,
  ToolCall,
  FileChange,
  BashOutput,
  SessionMessageFromAPI
} from '../lib/types';

interface UseOpenCodeServerReturn {
  serverState: ServerState;
  events: BusEvent[];
  currentSession: Session | null;
  sessions: Session[];
  currentProject: Project | null;
  toolCalls: ToolCall[];
  fileChanges: FileChange[];
  bashOutputs: BashOutput[];
  sessionMessages: SessionMessageFromAPI[];
  isCreatingSession: boolean;
  isSendingMessage: boolean;
  connect: () => void;
  disconnect: () => void;
  refreshHealth: () => Promise<void>;
  refreshSessions: () => Promise<void>;
  refreshProject: () => Promise<void>;
  refreshSessionMessages: (sessionId: string) => Promise<void>;
  createAndStartSession: (directory: string, prompt: string) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  clearEvents: () => void;
}

export const useOpenCodeServer = (
  port: number,
  hostname: string = '127.0.0.1'
): UseOpenCodeServerReturn => {
  const apiRef = useRef<OpenCodeAPI | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  
  const [serverState, setServerState] = useState<ServerState>({
    isConnected: false,
    isConnecting: false,
    health: null,
    error: null,
    port,
    hostname,
  });
  
  const [events, setEvents] = useState<BusEvent[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([]);
  const [fileChanges, setFileChanges] = useState<FileChange[]>([]);
  const [bashOutputs, setBashOutputs] = useState<BashOutput[]>([]);
  const [sessionMessages, setSessionMessages] = useState<SessionMessageFromAPI[]>([]);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const refreshHealth = useCallback(async () => {
    if (!apiRef.current) return;
    try {
      const health = await apiRef.current.getHealth();
      setServerState(prev => ({
        ...prev,
        health,
        isConnected: true,
        error: null,
      }));
    } catch (err) {
      setServerState(prev => ({
        ...prev,
        isConnected: false,
        error: err instanceof Error ? err.message : 'Connection failed',
      }));
    }
  }, []);

  const refreshSessions = useCallback(async () => {
    if (!apiRef.current) return;
    try {
      const sessionList = await apiRef.current.getSessions();
      setSessions(sessionList);
      if (sessionList.length > 0 && !currentSession) {
        setCurrentSession(sessionList[0]);
      }
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    }
  }, [currentSession]);

  const refreshProject = useCallback(async () => {
    if (!apiRef.current) return;
    try {
      const project = await apiRef.current.getCurrentProject();
      setCurrentProject(project);
    } catch (err) {
      console.error('Failed to fetch project:', err);
    }
  }, []);

  const refreshSessionMessages = useCallback(async (sessionId: string) => {
    if (!apiRef.current) return;
    try {
      const messages = await apiRef.current.getSessionMessages(sessionId);
      setSessionMessages(messages as SessionMessageFromAPI[]);
    } catch (err) {
      console.error('Failed to fetch session messages:', err);
    }
  }, []);

  const createAndStartSession = useCallback(async (directory: string, prompt: string) => {
    if (!apiRef.current) return;
    
    setIsCreatingSession(true);
    try {
      const { id } = await apiRef.current.createSession('New Session');
      await apiRef.current.sendPromptAsync(id, prompt || 'Hello', directory);
      setCurrentSession({ id, title: 'New Session', createdAt: Date.now(), updatedAt: Date.now() });
      await refreshSessions();
    } catch (err) {
      console.error('Failed to create session:', err);
    } finally {
      setIsCreatingSession(false);
    }
  }, [refreshSessions]);

  const sendMessage = useCallback(async (message: string) => {
    if (!apiRef.current || !currentSession) return;
    
    setIsSendingMessage(true);
    try {
      await apiRef.current.sendMessage(currentSession.id, message);
      await refreshSessionMessages(currentSession.id);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSendingMessage(false);
    }
  }, [currentSession, refreshSessionMessages]);

  const connect = useCallback(() => {
    if (apiRef.current) {
      apiRef.current.setPort(port, hostname);
    } else {
      apiRef.current = createApi(port, hostname);
    }
    
    setServerState(prev => ({ ...prev, isConnecting: true, port, hostname }));

    const eventSource = apiRef.current.getEventSource();
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setServerState(prev => ({ 
        ...prev, 
        isConnecting: false, 
        isConnected: true,
        error: null 
      }));
      refreshHealth();
      refreshSessions();
      refreshProject();
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const busEvent: BusEvent = {
          type: data.type || 'unknown',
          sessionId: data.sessionId,
          timestamp: Date.now(),
          data: data.data || data,
        };
        
        setEvents(prev => [...prev.slice(-499), busEvent]);

        if (busEvent.type === 'tool.started') {
          const toolData = busEvent.data as { id?: string; name?: string; input?: Record<string, unknown> };
          setToolCalls(prev => [...prev, {
            id: toolData.id || crypto.randomUUID(),
            name: toolData.name || 'unknown',
            input: toolData.input || {},
            status: 'running',
            startTime: Date.now(),
          }]);
        }

        if (busEvent.type === 'tool.ended') {
          const toolData = busEvent.data as { id?: string; output?: string };
          setToolCalls(prev => prev.map(tc => 
            tc.id === toolData.id 
              ? { ...tc, status: 'completed', output: toolData.output, endTime: Date.now() }
              : tc
          ));
        }

        if (busEvent.type === 'tool.output') {
          const toolData = busEvent.data as { id?: string; output?: string };
          setToolCalls(prev => prev.map(tc => 
            tc.id === toolData.id 
              ? { ...tc, output: (tc.output || '') + (toolData.output || '') }
              : tc
          ));
        }

        if (busEvent.type === 'bash.stdout') {
          const bashData = busEvent.data as { sessionId?: string; toolCallId?: string; content?: string };
          setBashOutputs(prev => [...prev, {
            sessionId: bashData.sessionId || '',
            toolCallId: bashData.toolCallId || '',
            type: 'stdout',
            content: bashData.content || '',
            timestamp: Date.now(),
          }]);
        }

        if (busEvent.type === 'bash.stderr') {
          const bashData = busEvent.data as { sessionId?: string; toolCallId?: string; content?: string };
          setBashOutputs(prev => [...prev, {
            sessionId: bashData.sessionId || '',
            toolCallId: bashData.toolCallId || '',
            type: 'stderr',
            content: bashData.content || '',
            timestamp: Date.now(),
          }]);
        }

        if (busEvent.type === 'edit.create' || busEvent.type === 'edit.update') {
          const editData = busEvent.data as { path?: string; content?: string; diff?: string };
          setFileChanges(prev => [...prev, {
            path: editData.path || 'unknown',
            action: busEvent.type === 'edit.create' ? 'create' : 'update',
            content: editData.content,
            diff: editData.diff,
            timestamp: Date.now(),
          }]);
        }

        if (busEvent.type === 'session.started') {
          const sessionData = busEvent.data as { session?: Session };
          if (sessionData.session) {
            setCurrentSession(sessionData.session);
            refreshSessions();
          }
        }

      } catch (err) {
        console.error('Failed to parse event:', err);
      }
    };

    eventSource.onerror = () => {
      setServerState(prev => ({ 
        ...prev, 
        isConnecting: false, 
        isConnected: false,
        error: 'SSE connection failed',
      }));
    };
  }, [port, hostname, refreshHealth, refreshSessions, refreshProject]);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setServerState(prev => ({ 
      ...prev, 
      isConnecting: false, 
      isConnected: false,
    }));
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
    setToolCalls([]);
    setFileChanges([]);
    setBashOutputs([]);
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  useEffect(() => {
    if (!serverState.isConnected) return;
    
    const interval = setInterval(() => {
      refreshSessions();
      refreshProject();
    }, 3000);
    
    return () => clearInterval(interval);
  }, [serverState.isConnected, refreshSessions, refreshProject]);

  return {
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
    refreshHealth,
    refreshSessions,
    refreshProject,
    refreshSessionMessages,
    createAndStartSession,
    sendMessage,
    clearEvents,
  };
};
