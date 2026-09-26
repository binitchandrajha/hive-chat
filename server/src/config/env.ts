/**
 * Typed, validated environment variables. Import `env` instead of reading process.env.
 * Usage: import { env } from './config/env.js'; env.PORT
 */
import 'dotenv/config';
import type { StringValue } from 'ms';

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

/** A duration jsonwebtoken understands: "7d", "12h", "30 m", "3600". */
function duration(name: string, fallback: StringValue): StringValue {
  const value = process.env[name] ?? fallback;
  if (!/^\d+\s?[a-z]*$/i.test(value)) throw new Error(`Invalid duration in env var ${name}: "${value}"`);
  return value as StringValue;
}

const NODE_ENV = process.env['NODE_ENV'] ?? 'development';

export const env = {
  NODE_ENV,
  IS_PRODUCTION: NODE_ENV === 'production',
  PORT: Number(process.env['PORT'] ?? 4000),
  MONGO_URI: process.env['MONGO_URI'] ?? 'mongodb://127.0.0.1:27017/hive-chat',
  JWT_SECRET: required('JWT_SECRET'),
  JWT_EXPIRES_IN: duration('JWT_EXPIRES_IN', '7d'),
  CORS_ORIGIN: process.env['CORS_ORIGIN'] ?? '*',
} as const;
