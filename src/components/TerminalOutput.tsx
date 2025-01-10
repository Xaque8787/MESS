import React, { useEffect, useRef, useState } from 'react';

interface TerminalOutputProps {
  show: boolean;
  onClose: () => void;
}

export function TerminalOutput({ show, onClose }: TerminalOutputProps) {
  const [output, setOutput] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 3;

  const connectWebSocket = () => {
    if (reconnectAttempts.current >= maxReconnectAttempts) {
      setError('Maximum reconnection attempts reached');
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    console.log('[WS] Connecting to WebSocket:', wsUrl);
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('[WS] Connected');
      setConnected(true);
      setError(null);
      reconnectAttempts.current = 0;
    };
    
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'output') {
          setOutput(prev => [...prev, message.data]);
          
          // Check for completion or error messages
          if (message.data.includes('Deployment completed successfully')) {
            console.log('[WS] Deployment completed successfully');
            setTimeout(() => {
              if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.close();
              }
              wsRef.current = null;
              onClose();
              window.location.reload();
            }, 1500);
          } else if (message.data.includes('Error:')) {
            setError(message.data.replace('Error:', '').trim());
          }
          
          // Scroll to bottom
          requestAnimationFrame(() => {
            if (terminalRef.current) {
              terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
            }
          });
        }
      } catch (error) {
        console.error('[WS] Error parsing message:', error);
        setOutput(prev => [...prev, `Error: ${error}\n`]);
      }
    };

    ws.onerror = (error) => {
      console.error('[WS] Error:', error);
      setConnected(false);
      setError('WebSocket connection error');
    };

    ws.onclose = () => {
      console.log('[WS] Closed');
      setConnected(false);
      
      if (show && !error) {
        console.log('[WS] Attempting to reconnect...');
        reconnectAttempts.current++;
        setTimeout(() => {
          connectWebSocket();
        }, 1000 * Math.min(reconnectAttempts.current, 3));
      }
    };
    
    wsRef.current = ws;
  };

  useEffect(() => {
    if (show) {
      setOutput([]);
      setError(null);
      reconnectAttempts.current = 0;
      connectWebSocket();
    }

    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      wsRef.current = null;
    };
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
        {error && (
          <div className="bg-red-900 text-red-100 p-2 mb-2 rounded">
            {error}
          </div>
        )}
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