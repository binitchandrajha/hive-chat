/**
 * toPublicUser: the one place that decides which user fields the app may see.
 *
 * Usage:
 *   const user = await UserModel.findById(id);
 *   res.json({ ok: true, user: toPublicUser(user) });
 *
 * Add a field to the User model? It only reaches the app once it is added here.
 */
import type { HydratedDocument } from 'mongoose';
import type { User } from '../models/User.js';
import type { PublicUser } from '../types/api.js';

export function toPublicUser(user: HydratedDocument<User>): PublicUser {
  return {
    id: user.id,
    phone: user.phone,
    name: user.name ?? null,
    about: user.about ?? null,
    avatar: user.avatar ?? null,
  };
}
