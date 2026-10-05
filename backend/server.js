import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import errorHandler from './middleware/errorHandler.js';

// Load environment variables from .env file
dotenv.config();

/**
 * Validates that all critical environment variables are present before starting.
 * If any are missing, logs the missing names and exits the process immediately.
 */
const checkRequiredEnvVars = () => {
  const required = ['MONGODB_URI', 'JWT_SECRET'];
  const missing = required.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    console.error(`[Fatal Error] Missing required environment variables: ${missing.join(', ')}`);
    console.error('Server startup aborted.');
    process.exit(1);
  }
};

// Run environment validation
checkRequiredEnvVars();

// Establish connection to MongoDB Atlas database
connectDB();

const app = express();

// Trust proxy headers (required for rate limiting when deployed behind proxies like Railway/Vercel/Heroku)
app.set('trust proxy', 1);

// Global Middleware Config

// Use Helmet to secure HTTP headers
app.use(helmet());

// Improved Request Logging based on environment
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Production-ready dynamic CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://your-app.vercel.app',
  'http://localhost:5173'
].filter(Boolean); // Filter out undefined if FRONTEND_URL is not set

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, postman, curl, or same-origin)
      // Also allow any local development server port (e.g., localhost:5174)
      if (!origin || allowedOrigins.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  })
);

// Body parser configuration with size limits to prevent body-parsing flood attacks
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Express 5 compatibility workaround to make req.query writable for express-mongo-sanitize
app.use((req, res, next) => {
  Object.defineProperty(req, 'query', {
    value: { ...req.query },
    writable: true,
    enumerable: true,
    configurable: true
  });
  next();
});

// MongoDB injection protection to sanitize req.body, req.query, and req.params
app.use(mongoSanitize());

// Rate Limiting Config
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: 'Too many auth attempts.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiters
app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);

// Core Routes

// Server Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date()
  });
});

// Register Authentication Routes
app.use('/api/auth', authRoutes);

// Register Lead Routing
app.use('/api/leads', leadRoutes);

// Register Global Error Handling Middleware (must be registered last)
app.use(errorHandler);

// Listen on configured port
const PORT = process.env.PORT || 5000;
const MODE = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${MODE} mode`);
});

/**
 * Handles graceful shutdown by closing server port listeners and Mongoose connections.
 * 
 * @param {string} signal - The signal received (SIGINT or SIGTERM).
 */
const gracefulShutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Server shutting down gracefully...`);
  
  // Stop accepting new connections
  server.close(async () => {
    console.log('HTTP server closed.');
    
    try {
      // Close Mongoose connection cleanly
      await mongoose.connection.close();
      console.log('MongoDB connection closed.');
      console.log('Server shutting down gracefully');
      process.exit(0);
    } catch (err) {
      console.error('Error during MongoDB connection cleanup:', err);
      process.exit(1);
    }
  });

  // Force close after 10 seconds if graceful shutdown hangs
  setTimeout(() => {
    console.error('Force shutting down due to timeout.');
    process.exit(1);
  }, 10000);
};

// Handle process termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
