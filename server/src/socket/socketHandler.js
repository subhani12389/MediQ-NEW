import { Server } from 'socket.io';

let ioInstance = null;

export const initSocket = (httpServer) => {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
    }
  });

  ioInstance.on('connection', (socket) => {
    console.log(`🔌 [Socket.IO] Client connected: ${socket.id}`);

    // Join hospital / department room
    socket.on('join_hospital', (hospitalId) => {
      if (hospitalId) {
        socket.join(`hospital:${hospitalId}`);
        console.log(`📡 [Socket.IO] Client ${socket.id} joined hospital:${hospitalId}`);
      }
    });

    socket.on('join_department', (deptId) => {
      if (deptId) {
        socket.join(`dept:${deptId}`);
        console.log(`📡 [Socket.IO] Client ${socket.id} joined dept:${deptId}`);
      }
    });

    socket.on('join_token', (tokenId) => {
      if (tokenId) {
        socket.join(`token:${tokenId}`);
        console.log(`📡 [Socket.IO] Client ${socket.id} joined token:${tokenId}`);
      }
    });

    socket.on('leave_hospital', (hospitalId) => {
      socket.leave(`hospital:${hospitalId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 [Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  return ioInstance;
};

export const getIO = () => {
  if (!ioInstance) {
    console.warn('⚠️ [Socket.IO] Socket instance requested before initialization');
  }
  return ioInstance;
};

// Emit real-time queue change event to rooms
export const emitQueueUpdate = (hospitalId, departmentId, eventData) => {
  const io = getIO();
  if (!io) return;

  const payload = {
    timestamp: new Date().toISOString(),
    hospitalId,
    departmentId,
    ...eventData
  };

  if (hospitalId) {
    io.to(`hospital:${hospitalId}`).emit('queue_updated', payload);
  }
  if (departmentId) {
    io.to(`dept:${departmentId}`).emit('queue_updated', payload);
  }
  if (eventData.token && eventData.token.id) {
    io.to(`token:${eventData.token.id}`).emit('token_status_changed', payload);
  }

  // Also broadcast globally for admin views
  io.emit('global_queue_event', payload);
};
