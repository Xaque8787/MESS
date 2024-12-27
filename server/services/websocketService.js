import { WebSocketServer, WebSocket } from 'ws';

let wssInstance = null;
const clients = new Set();

export function setupWebSocket(server, path = '/ws') {
  const wss = new WebSocketServer({ 
    server, 
    path,
    clientTracking: true 
  });
  
  wss.on('connection', (ws) => {
    console.log('Client connected');
    clients.add(ws);

    // Send immediate connection confirmation
    ws.send(JSON.stringify({ 
      type: 'output', 
      data: 'WebSocket connected\n' 
    }));

    ws.on('close', () => {
      console.log('Client disconnected');
      clients.delete(ws);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });

  wssInstance = wss;
  return wss;
}

export function broadcastOutput(data) {
  if (!wssInstance) {
    console.warn('No WebSocket server instance available');
    return;
  }

  // Ensure data is a string
  const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  const message = JSON.stringify({ 
    type: 'output', 
    data: text.endsWith('\n') ? text : text + '\n'
  });

  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(message);
      } catch (error) {
        console.error('Failed to send to client:', error);
        clients.delete(client);
      }
    } else {
      clients.delete(client);
    }
  }
}