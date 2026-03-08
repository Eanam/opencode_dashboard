import React, { useEffect, useRef } from 'react';
import { ToolCall } from '../lib/types';

interface ToolLogProps {
  toolCalls: ToolCall[];
}

const getToolIcon = (name: string): string => {
  const icons: Record<string, string> = {
    bash: '⬛',
    edit: '📝',
    grep: '🔍',
    glob: '📁',
    read: '📄',
    write: '✍️',
    todowrite: '☑️',
    webfetch: '🌐',
    websearch: '🔎',
  };
  return icons[name] || '🔧';
};

const getStatusColor = (status: ToolCall['status']): string => {
  switch (status) {
    case 'pending': return 'text-retro-textMuted';
    case 'running': return 'text-retro-accent5';
    case 'completed': return 'text-retro-accent4';
    case 'error': return 'text-retro-red';
    default: return 'text-retro-textMuted';
  }
};

const formatInput = (input: Record<string, unknown>): string => {
  if (!input) return '';
  const keys = Object.keys(input);
  if (keys.length === 0) return '';
  const firstKey = keys[0];
  const value = input[firstKey];
  if (typeof value === 'string') {
    return value.substring(0, 80) + (value.length > 80 ? '...' : '');
  }
  if (Array.isArray(value)) {
    return `${firstKey}: [${value.length} items]`;
  }
  return `${firstKey}: ${JSON.stringify(value).substring(0, 60)}`;
};

export const ToolLog: React.FC<ToolLogProps> = ({ toolCalls }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [toolCalls]);

  const formatDuration = (start: number, end?: number): string => {
    const duration = (end || Date.now()) - start;
    if (duration < 1000) return `${duration}ms`;
    return `${(duration / 1000).toFixed(2)}s`;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b-3 border-retro-border bg-retro-dark3 flex justify-between items-center">
        <h2 className="title-pixel text-retro-accent5">🔧 TOOL LOG</h2>
        <span className="font-pixel text-xs text-retro-textMuted">{toolCalls.length} CALLS</span>
      </div>
      
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-retro-bg"
      >
        {toolCalls.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔧</div>
            <p className="title-pixel text-retro-textMuted">NO TOOLS USED</p>
            <p className="text-retro-textMuted text-sm mt-2">Tools will appear here</p>
          </div>
        ) : (
          toolCalls.map((tool, index) => (
            <div 
              key={tool.id || index}
              className="card-pixel border-l-4 border-retro-accent5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getToolIcon(tool.name)}</span>
                  <span className="font-mono text-sm text-retro-white font-bold">
                    {tool.name.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-pixel text-xs ${getStatusColor(tool.status)}`}>
                    {tool.status.toUpperCase()}
                  </span>
                  <span className="font-pixel text-xs text-retro-textMuted">
                    {formatDuration(tool.startTime, tool.endTime)}
                  </span>
                </div>
              </div>
              
              <div className="mt-2">
                <p className="text-xs text-retro-textMuted font-mono bg-retro-dark3 p-2">
                  {formatInput(tool.input) || 'NO INPUT'}
                </p>
              </div>
              
              {tool.output && (
                <div className="mt-2">
                  <p className="text-xs text-retro-textMuted">OUTPUT:</p>
                  <pre className="text-xs text-retro-text font-mono bg-retro-dark3 p-2 mt-1 overflow-x-auto max-h-32">
                    {tool.output.substring(0, 500)}
                    {tool.output.length > 500 && '...'}
                  </pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
