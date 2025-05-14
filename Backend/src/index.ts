import express, { Express, Request, Response, NextFunction } from "express";
import http from "http"; 
import dotenv from 'dotenv';
dotenv.config();

const PORT: string | number = process.env.PORT || 3000;

const app: Express = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Middleware Example
app.get('/', (req: Request, res: Response) => {
  res.status(200).send("Hello From test request!");
});

// 404 Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error("Route doesns't exist");
  next(error); // Pasa el error al siguiente middleware
});

// Global Error Handler Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode || 500;
  res.status(statusCode).json({
    error: {
      message: err.message || 'Internal Server Error',
    }
  });
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server listen in port: ${PORT}`);
  console.log(`Make requests from: http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  console.log('Closing derver...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});