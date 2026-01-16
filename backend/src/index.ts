import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import apiRoutes from './routes';

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Index Fund DCA Simulator API',
    version: '1.0.0',
    endpoints: {
      indices: 'GET /api/indices',
      simulate: 'POST /api/simulate',
      health: 'GET /api/health',
    },
  });
});

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Index Fund DCA Simulator API`);
  console.log(`🌐 http://localhost:${PORT}`);
});
