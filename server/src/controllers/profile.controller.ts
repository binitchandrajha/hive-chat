/**
 * Profile controller: handlers for /profile. Every route here sits behind
 * requireAuth (see routes/index.ts), so req.userId is the logged-in user.
 */
import type { Request, Response } from 'express';
import { UserModel } from '../models/User.js';
import type { GetMeResponse, UpdateMeResponse } from '../types/api.js';
import { AppError } from '../utils/AppError.js';
import { toPublicUser } from '../utils/publicUser.js';

export const NAME_MAX = 50;
export const ABOUT_MAX = 140;
export const AVATAR_MAX = 2048;

/** The only fields a user may change here. Anything else in the body is ignored. */
type ProfileField = 'name' | 'about' | 'avatar';

interface UpdateMeBody {
  name?: unknown;
  about?: unknown;
  avatar?: unknown;
}

function fieldError(field: ProfileField, message: string): AppError {
  return AppError.validation(message, [{ field, message }]);
}

/** Required text: trimmed, 1..NAME_MAX characters. A name can be changed, never removed. */
function parseName(value: unknown): string {
  if (typeof value !== 'string') throw fieldError('name', 'name must be text');
  const name = value.trim();
  if (!name) throw fieldError('name', 'name cannot be empty');
  if (name.length > NAME_MAX) throw fieldError('name', `name must be at most ${NAME_MAX} characters`);
  return name;
}

/** Optional text. null or "" means "clear it". */
function parseAbout(value: unknown): string | null {
  if (value === null) return null;
  if (typeof value !== 'string') throw fieldError('about', 'about must be text or null');
  const about = value.trim();
  if (about.length > ABOUT_MAX) throw fieldError('about', `about must be at most ${ABOUT_MAX} characters`);
  return about || null;
}

/** Optional http(s) URL. null means "remove the photo". */
function parseAvatar(value: unknown): string | null {
  if (value === null) return null;
  const message = 'avatar must be an http(s) URL or null';
  if (typeof value !== 'string' || value.length > AVATAR_MAX) throw fieldError('avatar', message);
  // URL.canParse checks the format without throwing; then allow only web links.
  if (!URL.canParse(value)) throw fieldError('avatar', message);
  const { protocol } = new URL(value);
  if (protocol !== 'https:' && protocol !== 'http:') throw fieldError('avatar', message);
  return value;
}

/** GET /profile/me: the logged-in user's own profile. */
export async function getMe(req: Request, res: Response<GetMeResponse>): Promise<void> {
  // Only undefined if this route was mounted without requireAuth: a coding bug, not a user error.
  if (!req.userId) throw AppError.unauthorized();

  const user = await UserModel.findById(req.userId);
  // The token is valid but the account is gone (e.g. deleted after login).
  if (!user) throw AppError.notFound('User not found');

  res.json({ ok: true, user: toPublicUser(user) });
}

/**
 * PATCH /profile/me: change some of name / about / avatar.
 * Only the fields sent are touched. Body example: { "name": "Binit", "about": null }
 */
export async function updateMe(
  req: Request<unknown, UpdateMeResponse, UpdateMeBody>,
  res: Response<UpdateMeResponse>,
): Promise<void> {
  if (!req.userId) throw AppError.unauthorized();
  const body: UpdateMeBody = req.body ?? {};

  // Build the update from validated values only. Never pass req.body to the DB:
  // a client could send { "phone": "..." } and change fields it must not touch.
  const toSet: Partial<Record<ProfileField, string>> = {};
  const toUnset: Partial<Record<ProfileField, ''>> = {};

  if (body.name !== undefined) toSet.name = parseName(body.name);

  if (body.about !== undefined) {
    const about = parseAbout(body.about);
    if (about === null) toUnset.about = '';
    else toSet.about = about;
  }

  if (body.avatar !== undefined) {
    const avatar = parseAvatar(body.avatar);
    if (avatar === null) toUnset.avatar = '';
    else toSet.avatar = avatar;
  }

  if (Object.keys(toSet).length === 0 && Object.keys(toUnset).length === 0) {
    throw AppError.validation('Send at least one of: name, about, avatar');
  }

  const user = await UserModel.findByIdAndUpdate(
    req.userId,
    { $set: toSet, $unset: toUnset },
    { new: true, runValidators: true },
  );
  if (!user) throw AppError.notFound('User not found');

  res.json({ ok: true, user: toPublicUser(user) });
}
