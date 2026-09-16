import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { surveysRouter } from './routes/surveys.routes.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());

  app.use('/api/surveys', surveysRouter);

  app.use(errorHandler);

  return app;
}
