import { useState, useCallback } from 'react';

interface ServerProcessState {
  isRunning: boolean;
  isStarting: boolean;
  error: string | null;
  pid: number | null;
}

interface UseServerProcessReturn {
  processState: ServerProcessState;
  startServer: (port: number, hostname: string) => void;
  stopServer: () => void;
}

export const useServerProcess = (): UseServerProcessReturn => {
  const [processState, setProcessState] = useState<ServerProcessState>({
    isRunning: false,
    isStarting: false,
    error: null,
    pid: null,
  });

  const startServer = useCallback((port: number, hostname: string) => {
    setProcessState({
      isRunning: false,
      isStarting: false,
      error: 'Auto-start is not available in browser. Please run "opencode serve" manually in your terminal.',
      pid: null,
    });
  }, []);

  const stopServer = useCallback(() => {
    setProcessState({
      isRunning: false,
      isStarting: false,
      error: null,
      pid: null,
    });
  }, []);

  return {
    processState,
    startServer,
    stopServer,
  };
};
