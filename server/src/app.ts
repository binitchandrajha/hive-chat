import express from 'express';
import type { Express } from 'express';
import cors from 'cors';
import routes from './routes/index.ts'
import { env } from './config/env.js';
import { notFound } from './middleware/notFound.ts';
import { errorHandler } from './middleware/errorHandler.ts';

export function createApp(): Express {
  const app = express();
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use(routes);

  // Order matters: these two must stay last.
  app.use(notFound); // no route matched -> 404
  app.use(errorHandler); // every error -> { ok: false, error: { code, message } }

  return app;
}
