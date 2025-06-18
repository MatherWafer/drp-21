import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextRequest, NextResponse } from 'next/server';

// Store the Socket.IO server instance globally
let io: SocketIOServer | null = null;

export async function GET(req: NextRequest) {
  const httpServer = (req as any).nextRequest?.socket?.server as HTTPServer;

  if (!io) {
    io = new SocketIOServer(httpServer, {
      path: '/api/socket',
      cors: {
        origin: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  return NextResponse.json({ message: 'Socket.IO server initialized' });
}