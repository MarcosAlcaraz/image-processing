import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file as early as possible

import express, { Express, Request, Response, NextFunction } from 'express';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors'; // If you use CORS

// Import configurations and utilities
import connectDB from './config/database';

// Import middleware
import { globalErrorHandler } from './middleware/globalErrorHandler'; // Your new global error handler

// Import routes
import authRoutes from './routes/authRoutes';
import imageRoutes from './routes/imageRoutes';
// import other routes as your project grows

// --- Initialize Express App ---
const app: Express = express();

// --- Connect to Database ---
connectDB(); // Call the function to establish MongoDB connection

const allowedOrigins = ['http://localhost:5173'];
if (process.env.FRONTEND_PROD_URL) {
  allowedOrigins.push(process.env.FRONTEND_PROD_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true 
}));

// Body parsing middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 



app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);


app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Route not found - ${req.method} ${req.originalUrl}`);
  (error as any).statusCode = 404;
  next(error); 
});


app.use(globalErrorHandler);

// Start Server 
const PORT: string | number = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
  console.log(`Access API at: http://localhost:${PORT}`);
  if (process.env.NODE_ENV) {
    console.log(`Running in ${process.env.NODE_ENV} mode.`);
  }
});

// --- Graceful Shutdown ---
const shutdown = (signal: string) => {
  console.log(`\n${signal} signal received. Closing server...`);
  server.close(() => {
    console.log('HTTP server closed.');
    mongoose.connection.close(false).then(() => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    }).catch(err => {
      console.error('Error closing MongoDB connection:', err);
      process.exit(1);
    });
  });
};

process.on('SIGINT', () => shutdown('SIGINT')); 
process.on('SIGTERM', () => shutdown('SIGTERM')); 

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
});