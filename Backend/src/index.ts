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
  credentials: true // If you plan to use cookies or sessions later
}));

// Body parsing middleware
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

// --- Static Files (Optional) ---
// If your 'public' folder (containing uploads) should be publicly accessible
// import path from 'path';
// app.use('/static', express.static(path.join(__dirname, '../public'))); // Adjust path if needed

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
// app.use('/api/other-feature', otherRoutes);

// --- 404 Not Found Handler ---
// This should be after all your API routes
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Route not found - ${req.method} ${req.originalUrl}`);
  (error as any).statusCode = 404; // Add a statusCode property
  next(error); // Pass the error to the global error handler
});

// --- Global Error Handler ---
// This MUST be the last piece of middleware in the stack
app.use(globalErrorHandler);

// --- Start Server ---
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
    mongoose.connection.close(false).then(() => { // Mongoose 7.x+ .close(false)
      console.log('MongoDB connection closed.');
      process.exit(0);
    }).catch(err => {
      console.error('Error closing MongoDB connection:', err);
      process.exit(1);
    });
  });
};

process.on('SIGINT', () => shutdown('SIGINT')); // Ctrl+C
process.on('SIGTERM', () => shutdown('SIGTERM')); // kill command

// Handle unhandled promise rejections (optional but good practice)
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
  // Consider exiting the process cleanly after logging, as the app might be in an unstable state
  // server.close(() => process.exit(1)); // Example of exiting
});

// Handle uncaught exceptions (optional but good practice)
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  // Application specific logging
  // It's generally recommended to exit the process cleanly, as the app is in an undefined state
  // server.close(() => process.exit(1)); // Example of exiting
});