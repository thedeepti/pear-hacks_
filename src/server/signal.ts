import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

interface SignalData {
  peerId: string;
  signal: any;
}

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Keep track of connected peers
const peers = new Map<string, string>();

io.on('connection', (socket: Socket) => {
  console.log('Client connected:', socket.id);

  // Handle peer registration
  socket.on('register', (peerId: string) => {
    peers.set(peerId, socket.id);
    console.log('Peer registered:', peerId);
    socket.broadcast.emit('peer-joined', peerId);
  });

  // Handle signaling data
  socket.on('signal', ({ peerId, signal }: SignalData) => {
    const targetSocketId = peers.get(peerId);
    if (targetSocketId) {
      io.to(targetSocketId).emit('signal', {
        peerId: socket.id,
        signal
      });
    }
  });

  // Handle peer disconnection
  socket.on('disconnect', () => {
    let disconnectedPeerId: string | undefined;
    for (const [peerId, socketId] of peers.entries()) {
      if (socketId === socket.id) {
        disconnectedPeerId = peerId;
        peers.delete(peerId);
        break;
      }
    }
    if (disconnectedPeerId) {
      console.log('Peer disconnected:', disconnectedPeerId);
      socket.broadcast.emit('peer-left', disconnectedPeerId);
    }
  });
});

const port = process.env.SIGNAL_PORT || 3003;
httpServer.listen(port);
console.log(`Signaling server listening on port ${port}`); 