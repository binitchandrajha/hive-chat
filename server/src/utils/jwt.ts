/**
 * JWT helpers for the login token.
 *
 * Usage:
 *   const token = signAuthToken(user.id);        // after OTP is verified
 *   const { userId } = verifyAuthToken(token);   // in the auth middleware
 *
 * The token only carries the user id (as `sub`). Never put the phone, name or
 * anything secret in it: a JWT is signed, not encrypted, so anyone can read it.
 */
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from './AppError.js';

export interface AuthTokenPayload {
  userId: string;
}

export function signAuthToken(userId: string): string {
  return jwt.sign({}, env.JWT_SECRET, { subject: userId, expiresIn: env.JWT_EXPIRES_IN });
}

/**
 * Checks the signature and expiry. Throws on a bad token: jsonwebtoken's own
 * errors become 401 in the global errorHandler.
 */
export function verifyAuthToken(token: string): AuthTokenPayload {
  const payload = jwt.verify(token, env.JWT_SECRET);
  if (typeof payload === 'string' || typeof payload.sub !== 'string') {
    throw AppError.unauthorized('Invalid token');
  }
  return { userId: payload.sub };
}
