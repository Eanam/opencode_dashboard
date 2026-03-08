import { HealthResponse, Project, Session } from './types';

const getBaseUrl = (port: number, hostname: string) => 
  `http://${hostname}:${port}`;

export class OpenCodeAPI {
  private baseUrl: string;

  constructor(port: number, hostname: string = '127.0.0.1') {
    this.baseUrl = getBaseUrl(port, hostname);
  }

  setPort(port: number, hostname: string = '127.0.0.1') {
    this.baseUrl = getBaseUrl(port, hostname);
  }

  async getHealth(): Promise<HealthResponse> {
    const response = await fetch(`${this.baseUrl}/global/health`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }
    return response.json();
  }

  async getProjects(): Promise<Project[]> {
    const response = await fetch(`${this.baseUrl}/project`);
    if (!response.ok) {
      throw new Error(`Failed to get projects: ${response.statusText}`);
    }
    return response.json();
  }

  async getCurrentProject(): Promise<Project | null> {
    const response = await fetch(`${this.baseUrl}/project/current`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error(`Failed to get current project: ${response.statusText}`);
    }
    return response.json();
  }

  async getSessions(): Promise<Session[]> {
    const response = await fetch(`${this.baseUrl}/session`);
    if (!response.ok) {
      throw new Error(`Failed to get sessions: ${response.statusText}`);
    }
    return response.json();
  }

  async getSession(sessionId: string): Promise<Session> {
    const response = await fetch(`${this.baseUrl}/session/${sessionId}`);
    if (!response.ok) {
      throw new Error(`Failed to get session: ${response.statusText}`);
    }
    return response.json();
  }

  async getSessionMessages(sessionId: string): Promise<unknown[]> {
    const response = await fetch(`${this.baseUrl}/session/${sessionId}/message`);
    if (!response.ok) {
      throw new Error(`Failed to get messages: ${response.statusText}`);
    }
    return response.json();
  }

  async getSessionStatus(sessionId: string): Promise<{ status: string }> {
    const response = await fetch(`${this.baseUrl}/session/${sessionId}/status`);
    if (!response.ok) {
      throw new Error(`Failed to get session status: ${response.statusText}`);
    }
    return response.json();
  }

  async sendMessage(sessionId: string, text: string, directory?: string): Promise<void> {
    const url = new URL(`${this.baseUrl}/session/${sessionId}/message`);
    if (directory) {
      url.searchParams.set('directory', directory);
    }
    
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parts: [{ type: 'text', text }],
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }
  }

  async createSession(title?: string): Promise<{ id: string }> {
    const response = await fetch(`${this.baseUrl}/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });
    if (!response.ok) {
      throw new Error(`Failed to create session: ${response.statusText}`);
    }
    return response.json();
  }

  async sendPromptAsync(sessionId: string, prompt: string, directory?: string): Promise<void> {
    const url = new URL(`${this.baseUrl}/session/${sessionId}/prompt_async`);
    if (directory) {
      url.searchParams.set('directory', directory);
    }
    
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parts: [{ type: 'text', text: prompt }],
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to send prompt: ${response.statusText}`);
    }
  }

  getEventSource(): EventSource {
    return new EventSource(`${this.baseUrl}/event`);
  }
}

export const createApi = (port: number, hostname: string = '127.0.0.1') => 
  new OpenCodeAPI(port, hostname);
