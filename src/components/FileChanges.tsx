import React, { useState } from 'react';
import { FileChange } from '../lib/types';

interface FileChangesProps {
  fileChanges: FileChange[];
}

export const FileChanges: React.FC<FileChangesProps> = ({ fileChanges }) => {
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());

  const toggleExpand = (path: string) => {
    setExpandedFiles(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const getActionIcon = (action: FileChange['action']): string => {
    const icons: Record<string, string> = {
      create: '✨',
      update: '📝',
      delete: '🗑️',
    };
    return icons[action] || '📄';
  };

  const getActionColor = (action: FileChange['action']): string => {
    const colors: Record<string, string> = {
      create: 'text-retro-accent4',
      update: 'text-retro-accent3',
      delete: 'text-retro-red',
    };
    return colors[action] || 'text-retro-textMuted';
  };

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b-3 border-retro-border bg-retro-dark3 flex justify-between items-center">
        <h2 className="title-pixel text-retro-accent4">📁 FILE CHANGES</h2>
        <span className="font-pixel text-xs text-retro-textMuted">{fileChanges.length} FILES</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-retro-bg">
        {fileChanges.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📁</div>
            <p className="title-pixel text-retro-textMuted">NO CHANGES</p>
            <p className="text-retro-textMuted text-sm mt-2">Modified files will appear here</p>
          </div>
        ) : (
          fileChanges.map((change, index) => {
            const isExpanded = expandedFiles.has(change.path);
            return (
              <div 
                key={index}
                className="card-pixel border-l-4 border-retro-accent4"
              >
                <div 
                  className="flex items-center justify-between p-2 cursor-pointer hover:bg-retro-dark3"
                  onClick={() => toggleExpand(change.path)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span>{getActionIcon(change.action)}</span>
                    <span className={`font-mono text-sm ${getActionColor(change.action)}`}>
                      {change.action.toUpperCase()}
                    </span>
                    <span className="text-retro-text truncate">{change.path}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-pixel text-xs text-retro-textMuted">
                      {formatTime(change.timestamp)}
                    </span>
                    <span className="text-retro-textMuted">
                      {isExpanded ? '▼' : '▶'}
                    </span>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="border-t-3 border-retro-border p-3 bg-retro-dark3">
                    {change.diff && (
                      <pre className="text-xs font-mono text-retro-text whitespace-pre-wrap overflow-x-auto max-h-64">
                        {change.diff}
                      </pre>
                    )}
                    {change.content && !change.diff && (
                      <pre className="text-xs font-mono text-retro-text whitespace-pre-wrap overflow-x-auto max-h-64">
                        {change.content}
                      </pre>
                    )}
                    {!change.diff && !change.content && (
                      <p className="text-xs text-retro-textMuted">NO CONTENT AVAILABLE</p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
