import express, { Express, Request, Response, NextFunction } from 'express';
import http from 'http';
import connectDB from './config/database'; // Importa tu función de conexión
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes'; // Importa las rutas de autenticación

connectDB();

const PORT: string | number = process.env.PORT || 3000;

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware Example
app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello From test request!');
});

// 404 Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error("Route doesn't exist");
  next(error);
});

// Global Error Handler Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const statusCode = (err as any).statusCode || 500;
  res.status(statusCode).json({
    error: {
      message: err.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined // Show stack in development
    },
  });
});

app.use('/api/auth', authRoutes);

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server listen in port: ${PORT}`);
  console.log(`Make requests from: http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  console.log('Closing server...');
  mongoose.connection.close()
    .then(() => {
      server.close(() => {
        console.log('Server closed.');
        process.exit(0);
      });
    })
    .catch((err) => {
      console.error('Error closing MongoDB connection:', err);
      process.exit(1);
    });
});