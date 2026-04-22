import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { Server as SocketServer } from 'socket.io';

import { connectDB } from './config/database';
import { errorHandler, notFound } from './middleware/errorHandler';

// Routes
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import rentalRoutes from './routes/rental.routes';
import reviewRoutes from './routes/review.routes';
import paymentRoutes from './routes/payment.routes';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io for real-time notifications
export const io = new SocketServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join', (userId: string) => {
    socket.join(userId); // user joins their own room
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

// Static files (local image uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);

// 404 & Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Only start the HTTP server when running locally (not as a Vercel serverless function)
if (process.env.VERCEL !== '1') {
  const start = async () => {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`🚀 Rentify server running on port ${PORT}`);
    });
  };

  start();
}

export default app;
