export interface ServerConfig {
  port: number;
  hostname: string;
  autoStart: boolean;
}

export interface HealthResponse {
  healthy: boolean;
  version: string;
}

export interface Project {
  id: string;
  name: string;
  directory: string;
  lastOpened: number;
}

export interface Session {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  agent?: string;
  time?: {
    created: number;
    updated: number;
  };
}

export interface SessionMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  parts: MessagePart[];
  createdAt: number;
}

export interface SessionMessageFromAPI {
  info: {
    role: 'user' | 'assistant';
    time: { created: number };
    agent?: string;
    model?: { providerID: string; modelID: string };
    id: string;
    sessionID: string;
  };
  parts: {
    type: string;
    text?: string;
    tool?: string;
    callID?: string;
    state?: { status: string; input?: Record<string, unknown>; output?: string };
    [key: string]: unknown;
  }[];
}

export interface MessagePart {
  type: 'text' | 'tool_use' | 'tool_result' | 'image' | 'file';
  [key: string]: unknown;
}

export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
  output?: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  startTime: number;
  endTime?: number;
}

export interface FileChange {
  path: string;
  action: 'create' | 'update' | 'delete';
  content?: string;
  diff?: string;
  timestamp: number;
}

export interface BashOutput {
  sessionId: string;
  toolCallId: string;
  type: 'stdout' | 'stderr';
  content: string;
  timestamp: number;
}

export interface BusEvent {
  type: string;
  sessionId?: string;
  timestamp: number;
  data?: unknown;
}

export type EventType = 
  | 'server.connected'
  | 'server.disconnected'
  | 'session.started'
  | 'session.ended'
  | 'session.status'
  | 'message.started'
  | 'message.continued'
  | 'message.completed'
  | 'message.part.updated'
  | 'tool.started'
  | 'tool.ended'
  | 'tool.output'
  | 'bash.stdout'
  | 'bash.stderr'
  | 'edit.create'
  | 'edit.update'
  | 'edit.delete';

export interface ServerState {
  isConnected: boolean;
  isConnecting: boolean;
  health: HealthResponse | null;
  error: string | null;
  port: number;
  hostname: string;
}
