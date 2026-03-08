import React, { useEffect, useRef, useMemo } from 'react';
import AnsiToHtml from 'ansi-to-html';
import { BashOutput } from '../lib/types';

interface TerminalOutputProps {
  bashOutputs: BashOutput[];
}

const ansiConverter = new AnsiToHtml({
  fg: '#eeffff',
  bg: '#1e1e2e',
  newline: true,
  escapeXML: true,
  colors: {
    0: '#1e1e2e',
    1: '#ef4444',
    2: '#22c55e',
    3: '#eab308',
    4: '#3b82f6',
    5: '#ec4899',
    6: '#06b6d4',
    7: '#eeffff',
    8: '#8792a2',
    9: '#ef4444',
    10: '#22c55e',
    11: '#eab308',
    12: '#3b82f6',
    13: '#ec4899',
    14: '#06b6d4',
    15: '#eeffff',
  },
});

export const TerminalOutput: React.FC<TerminalOutputProps> = ({ bashOutputs }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [bashOutputs]);

  const groupedOutputs = useMemo(() => {
    const groups: Record<string, BashOutput[]> = {};
    bashOutputs.forEach(output => {
      const key = output.toolCallId;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(output);
    });
    return groups;
  }, [bashOutputs]);

  const renderContent = (content: string) => {
    return { __html: ansiConverter.toHtml(content) };
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b-3 border-retro-border bg-retro-dark3 flex justify-between items-center">
        <h2 className="title-pixel text-retro-accent2">⬛ TERMINAL</h2>
        <span className="font-pixel text-xs text-retro-textMuted">
          {bashOutputs.length} LINES
        </span>
      </div>
      
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm bg-retro-bg"
      >
        {bashOutputs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⬛</div>
            <p className="title-pixel text-retro-textMuted">NO OUTPUT</p>
            <p className="text-retro-textMuted text-sm mt-2">Bash output will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedOutputs).map(([toolCallId, outputs]) => (
              <div key={toolCallId} className="border-3 border-retro-border overflow-hidden">
                <div className="bg-retro-dark3 px-3 py-2 text-xs border-b-3 border-retro-border">
                  <span className="font-pixel text-retro-accent2">CMD</span>
                  <span className="text-retro-textMuted"> #{toolCallId.substring(0, 8)}</span>
                </div>
                <div className="p-3 bg-retro-surface">
                  {outputs.map((output, index) => (
                    <div
                      key={index}
                      className={`${
                        output.type === 'stderr' ? 'text-retro-red' : 'text-retro-text'
                      } whitespace-pre-wrap break-all`}
                      dangerouslySetInnerHTML={renderContent(output.content)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
