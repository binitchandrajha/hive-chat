/**
 * Profile controller: handlers for /profile. Every route here sits behind
 * requireAuth (see routes/index.ts), so req.userId is the logged-in user.
 */
import type { Request, Response } from 'express';
import { UserModel } from '../models/User.js';
import type { GetMeResponse } from '../types/api.js';
import { AppError } from '../utils/AppError.js';
import { toPublicUser } from '../utils/publicUser.js';

/** GET /profile/me: the logged-in user's own profile. */
export async function getMe(req: Request, res: Response<GetMeResponse>): Promise<void> {
  // Only undefined if this route was mounted without requireAuth: a coding bug, not a user error.
  if (!req.userId) throw AppError.unauthorized();

  const user = await UserModel.findById(req.userId);
  // The token is valid but the account is gone (e.g. deleted after login).
  if (!user) throw AppError.notFound('User not found');

  res.json({ ok: true, user: toPublicUser(user) });
}
