import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { errorHandler, AppError } from './middlewares/errorHandler.js';
import connectDB from './config/db.js';

// Route Imports
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import resourceRoutes from './routes/resource.routes.js';
import forumRoutes from './routes/forum.routes.js';
import placementRoutes from './routes/placement.routes.js';
import researchRoutes from './routes/research.routes.js';
import adminRoutes from './routes/admin.routes.js';
import chatRoutes from './routes/chat.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import marketplaceRoutes from './routes/marketplace.routes.js';
import eventRoutes from './routes/event.routes.js';
import mentorshipRoutes from './routes/mentorship.routes.js';
import studyGroupRoutes from './routes/studygroup.routes.js';
import statsRoutes from './routes/stats.routes.js';

const app = express();

// Security Headers
app.use(helmet());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// CORS — allow localhost + any Vercel subdomain + the deployed frontend URL
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, curl, etc.)
      if (!origin) return callback(null, true);
      // Allow any vercel.app subdomain automatically
      if (origin.endsWith('.vercel.app') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy blocked: ${origin}`));
    },
    credentials: true,
  })
);

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'development' ? 2000 : 300,
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// ── DB Connection Middleware (serverless-safe) ───────────────────────────────
// Ensures the DB is connected before any request is processed.
// Uses readyState caching so reconnection is skipped when already connected.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(new AppError('Database connection failed', 503));
  }
});

// Mount API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/resources', resourceRoutes);
app.use('/api/v1/forum', forumRoutes);
app.use('/api/v1/placements', placementRoutes);
app.use('/api/v1/research', researchRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/marketplace', marketplaceRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/mentorship', mentorshipRoutes);
app.use('/api/v1/study-groups', studyGroupRoutes);
app.use('/api/v1/stats', statsRoutes);

// Health Check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date(),
  });
});

// 404 Route
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(errorHandler);

export default app;
