/**
 * requireAuth: lets a request through only if it carries a valid login token.
 *
 * Usage (routes/index.ts):
 *   router.use('/me', requireAuth, meRouter);
 * Inside those routes, `req.userId` is the logged-in user's id.
 *
 * The client sends the token from /auth/verify-otp as a header:
 *   Authorization: Bearer <token>
 */
import type { RequestHandler } from 'express';
import { AppError } from '../utils/AppError.js';
import { verifyAuthToken } from '../utils/jwt.js';

const BEARER = 'Bearer ';

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith(BEARER)) {
    throw AppError.unauthorized('Missing token');
  }

  const token = header.slice(BEARER.length).trim();
  if (!token) {
    throw AppError.unauthorized('Missing token');
  }

  // Throws on a bad signature or an expired token; errorHandler turns that into 401.
  const { userId } = verifyAuthToken(token);

  req.userId = userId;
  next();
};
