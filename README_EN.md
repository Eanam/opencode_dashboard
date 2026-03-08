# OpenCode Dashboard

A web control panel for interacting with the [OpenCode](https://opencode.ai) server.

## Features

- **Real-time Event Stream** - Monitor all server events
- **Session Management** - Create and manage multiple AI programming sessions
- **Tool Log** - Track tool calls and execution status
- **Terminal Output** - View real-time Bash command output
- **File Changes** - Monitor file creation, modification, and deletion
- **Flexible Configuration** - Customizable server address and port

## Screenshots

![Dashboard Screenshot 1](images/Screenshot%202026-03-08%20at%2011.06.56.png)

![Dashboard Screenshot 2](images/Screenshot%202026-03-08%20at%2011.07.04.png)

## Tech Stack

- React 19
- TypeScript
- Tailwind CSS
- Server-Sent Events (SSE)

## Quick Start

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm start
```

Visit http://localhost:3000

### Build for Production

```bash
npm run build
```

## Configuration

In the Settings page you can configure:

- Server address (default: 127.0.0.1)
- Server port (default: 4096)
- Auto-connect toggle

## Project Structure

```
src/
├── components/       # React components
│   ├── Header.tsx          # Top navigation bar
│   ├── Sidebar.tsx         # Sidebar navigation
│   ├── EventStream.tsx    # Event stream display
│   ├── SessionView.tsx    # Session view
│   ├── ToolLog.tsx        # Tool log
│   ├── TerminalOutput.tsx # Terminal output
│   ├── FileChanges.tsx    # File changes
│   └── Settings.tsx       # Settings page
├── hooks/
│   └── useOpenCodeServer.ts  # OpenCode server interaction logic
└── lib/
    ├── api.ts          # API client
    └── types.ts        # TypeScript type definitions
```

## Note

- This project requires a running OpenCode server to function properly
- Ensure the server address and port are configured correctly
