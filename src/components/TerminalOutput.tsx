import React, { useEffect, useRef, useState } from 'react';

interface TerminalOutputProps {
  show: boolean;
  onClose: () => void;
}

export function TerminalOutput({ show, onClose }: TerminalOutputProps) {
  const [output, setOutput] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (show) {
      setOutput([]); // Clear previous output
      
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      console.log('Connecting to WebSocket:', wsUrl);
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setConnected(true);
      };
      
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'output') {
            setOutput(prev => [...prev, message.data]);
            // Scroll to bottom after update
            requestAnimationFrame(() => {
              if (terminalRef.current) {
                terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
              }
            });
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          setOutput(prev => [...prev, `Error: ${error}\n`]);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnected(false);
        setOutput(prev => [...prev, 'WebSocket error occurred\n']);
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
        setConnected(false);
        setOutput(prev => [...prev, 'Disconnected from server\n']);
      };
      
      wsRef.current = ws;
      
      return () => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.close();
        }
        wsRef.current = null;
      };
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg p-4 w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-mono">Terminal Output</h3>
            <span 
              className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} 
              title={connected ? 'Connected' : 'Disconnected'}
            />
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white px-2 py-1"
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