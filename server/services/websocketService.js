import { WebSocketServer } from 'ws';

let wssInstance = null;

export function setupWebSocket(server) {
  const wss = new WebSocketServer({ server });
  
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    // Send initial connection message
    ws.send(JSON.stringify({
      type: 'output',
      data: 'Connected to server\n'
    }));
    
    ws.on('close', () => console.log('Client disconnected from WebSocket'));
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
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

  const message = JSON.stringify({
    type: 'output',
    data: data.toString()
  });

  activeWss.clients.forEach((client) => {
    if (client.readyState === WebSocketServer.OPEN) {
      try {
        client.send(message);
      } catch (error) {
        console.error('Failed to send message to client:', error);
      }
    }
  });
}