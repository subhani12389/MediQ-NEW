import http from 'http';
import app from './app.js';
import { initSocket } from './socket/socketHandler.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Database
connectDB();

// Create HTTP Server & Attach Socket.IO
const httpServer = http.createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`\n🏥 =================================================`);
  console.log(`   MediQ Real-Time Queue API Server Running`);
  console.log(`   Database: MongoDB (Mongoose)`);
  console.log(`   URL: http://localhost:${PORT}`);
  console.log(`   Socket.IO: Enabled (ws://localhost:${PORT})`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=================================================\n`);
});
