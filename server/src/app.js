import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import hospitalsRoutes from './routes/hospitals.routes.js';
import tokensRoutes from './routes/tokens.routes.js';
import receptionistRoutes from './routes/receptionist.routes.js';
import notificationRoutes from './routes/notifications.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'MediQ REST API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/hospitals', hospitalsRoutes);
app.use('/api/tokens', tokensRoutes);
app.use('/api/receptionist', receptionistRoutes);
app.use('/api/notifications', notificationRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled API Error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

export default app;
