import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./hooks/useOpenCodeServer', () => ({
  useOpenCodeServer: () => ({
    serverState: {
      isConnected: false,
      isConnecting: false,
      health: null,
      error: null,
      port: 4096,
      hostname: '127.0.0.1',
    },
    events: [],
    currentSession: null,
    sessions: [],
    currentProject: null,
    toolCalls: [],
    fileChanges: [],
    bashOutputs: [],
    sessionMessages: [],
    isCreatingSession: false,
    isSendingMessage: false,
    connect: jest.fn(),
    disconnect: jest.fn(),
    refreshSessionMessages: jest.fn(),
    createAndStartSession: jest.fn(),
    sendMessage: jest.fn(),
  }),
}));

test('renders the dashboard and its initial event state', () => {
  render(<App />);

  expect(screen.getByText('OPENCODE DASHBOARD')).toBeInTheDocument();
  expect(screen.getByText('OFFLINE')).toBeInTheDocument();
  expect(screen.getByText('NO EVENTS YET')).toBeInTheDocument();
});

test('navigates to the sessions view', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /CHAT/ }));

  expect(screen.getByRole('heading', { name: /SESSIONS/ })).toBeInTheDocument();
  expect(screen.getByText('NO SESSIONS')).toBeInTheDocument();
});
