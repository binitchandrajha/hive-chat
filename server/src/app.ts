import express from 'express';
import type { Express } from 'express';
import cors from 'cors';
import { env } from './config/env.js';

export function createApp(): Express {
  const app = express();
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  return app;
}
