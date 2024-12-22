import { WebSocketServer } from 'ws';

let wssInstance = null;

export function setupWebSocket(server) {
  const wss = new WebSocketServer({ server });
  
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    // Send initial connection message
    broadcastOutput(wss, 'Connected to server\n');
    
    ws.on('close', () => console.log('Client disconnected from WebSocket'));
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      broadcastOutput(wss, `WebSocket error: ${error.message}\n`);
    });
  });
  
  wssInstance = wss;
  return wss;
}

export function broadcastOutput(wss, data) {
  const activeWss = wss || wssInstance;
  if (!activeWss) {
    console.warn('No WebSocket server instance available');
    return;
  }

  // Ensure data is properly formatted
  const message = {
    type: 'output',
    data: data.toString()
  };

  activeWss.clients.forEach((client) => {
    if (client.readyState === WebSocketServer.OPEN) {
      try {
        client.send(JSON.stringify(message));
      } catch (error) {
        console.error('Failed to send message to client:', error);
      }
    }
  });
}