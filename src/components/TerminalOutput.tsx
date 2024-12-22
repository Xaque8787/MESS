import React, { useEffect, useRef, useState } from 'react';

interface TerminalOutputProps {
  show: boolean;
  onClose: () => void;
}

export function TerminalOutput({ show, onClose }: TerminalOutputProps) {
  const [output, setOutput] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (show) {
      setOutput([]); // Clear previous output
      
      const wsUrl = `ws://${window.location.hostname}:3001`;
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
      };
      
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'output') {
            setOutput(prev => [...prev, message.data]);
            
            // Ensure scroll to bottom happens after state update
            setTimeout(() => {
              if (terminalRef.current) {
                terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
              }
            }, 0);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setOutput(prev => [...prev, `WebSocket error: ${error}\n`]);
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
      };
      
      wsRef.current = ws;
      
      return () => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.close();
        }
      };
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg p-4 w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-white font-mono">Terminal Output</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>
        <div
          ref={terminalRef}
          className="flex-1 overflow-auto font-mono text-sm text-green-400 bg-black p-4 rounded"
        >
          {output.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap">{line}</div>
          ))}
          {output.length === 0 && (
            <div className="text-gray-500">Waiting for output...</div>
          )}
        </div>
      </div>
    </div>
  );
}