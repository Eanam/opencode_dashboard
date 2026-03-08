import React, { useEffect, useRef } from 'react';
import { BusEvent } from '../lib/types';

interface EventStreamProps {
  events: BusEvent[];
}

const getEventIcon = (type: string): string => {
  if (type.includes('tool')) return '🔧';
  if (type.includes('message')) return '💬';
  if (type.includes('session')) return '📋';
  if (type.includes('bash')) return '⬛';
  if (type.includes('edit')) return '📝';
  if (type.includes('server')) return '🖥️';
  return '📌';
};

const getEventColor = (type: string): string => {
  if (type.includes('error')) return 'text-retro-red';
  if (type.includes('tool.started')) return 'text-retro-accent5';
  if (type.includes('tool.ended') || type.includes('completed')) return 'text-retro-accent4';
  if (type.includes('message')) return 'text-retro-accent';
  if (type.includes('bash')) return 'text-retro-orange';
  if (type.includes('edit')) return 'text-retro-accent3';
  return 'text-retro-textMuted';
};

const formatEventData = (data: unknown): string => {
  if (!data) return '';
  if (typeof data === 'string') return data.substring(0, 100);
  if (typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (obj.name) return `${obj.name}`;
    if (obj.content) return `${obj.content}`.substring(0, 100);
    if (obj.path) return `${obj.path}`;
    return JSON.stringify(obj).substring(0, 100);
  }
  return String(data).substring(0, 100);
};

export const EventStream: React.FC<EventStreamProps> = ({ events }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b-3 border-retro-border bg-retro-dark3 flex justify-between items-center">
        <h2 className="title-pixel text-retro-accent3">📡 EVENT LOG</h2>
        <span className="font-pixel text-xs text-retro-textMuted">{events.length} EVENTS</span>
      </div>
      
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 bg-retro-bg"
      >
        {events.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎮</div>
            <p className="title-pixel text-retro-textMuted">NO EVENTS YET</p>
            <p className="text-retro-textMuted text-sm mt-2">Start using OpenCode to see events</p>
          </div>
        ) : (
          events.map((event, index) => (
            <div 
              key={index}
              className="card-pixel hover:border-retro-accent transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">{getEventIcon(event.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-sm ${getEventColor(event.type)}`}>
                      {event.type}
                    </span>
                    <span className="font-pixel text-xs text-retro-textMuted">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  {event.data && (
                    <p className="text-xs text-retro-textMuted mt-1 font-mono truncate">
                      {formatEventData(event.data)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
