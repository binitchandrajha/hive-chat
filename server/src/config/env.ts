/**
 * Typed, validated environment variables. Import `env` instead of reading process.env.
 * Usage: import { env } from './config/env.js'; env.PORT
 */
import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

const NODE_ENV = process.env['NODE_ENV'] ?? 'development';

export const env = {
  NODE_ENV,
  IS_PRODUCTION: NODE_ENV === 'production',
  PORT: Number(process.env['PORT'] ?? 4000),
  MONGO_URI: process.env['MONGO_URI'] ?? 'mongodb://127.0.0.1:27017/hive-chat',
  JWT_SECRET: required('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env['JWT_EXPIRES_IN'] ?? '7d',
  CORS_ORIGIN: process.env['CORS_ORIGIN'] ?? '*',
} as const;
