/**
 * Auth service: the OTP login logic. Knows nothing about req/res, so it can be
 * called from a controller, a socket handler or a test.
 *
 * Usage:
 *   await requestOtp('+9779812345678');
 *   const { token, isNewUser, user } = await verifyOtpAndLogin('+9779812345678', '123456');
 *
 * Callers must pass a phone already normalised with normalizePhone().
 */
import { OtpModel } from '../models/Otp.js';
import { UserModel } from '../models/User.js';
import type { PublicUser } from '../types/api.js';
import { AppError } from '../utils/AppError.js';
import { signAuthToken } from '../utils/jwt.js';
import { generateOtp, hashOtp, safeEqual } from '../utils/otp.js';

export const OTP_TTL_MS = 5 * 60 * 1000;
export const MAX_OTP_ATTEMPTS = 5;

export interface LoginResult {
  token: string;
  isNewUser: boolean;
  user: PublicUser;
}

/** Create a new code for this phone (replacing any old one) and "send" it. */
export async function requestOtp(phone: string): Promise<void> {
  const code = generateOtp();

  // One Otp document per phone (phone is unique): create it, or replace the old one.
  await OtpModel.findOneAndUpdate(
    { phone },
    { codeHash: hashOtp(code), expiresAt: new Date(Date.now() + OTP_TTL_MS), attempts: 0 },
    { upsert: true },
  );

  // No SMS provider yet, so print the code in the server terminal.
  console.log(`[otp] ${phone} -> ${code}`);
}

/** Check the code; on success, find or create the user and return a login token. */
export async function verifyOtpAndLogin(phone: string, code: string): Promise<LoginResult> {
  // 1. Take one attempt, in a single atomic DB step. The filter only matches a
  //    code that is not expired and not locked, and $inc counts this try.
  const otp = await OtpModel.findOneAndUpdate(
    { phone, expiresAt: { $gt: new Date() }, attempts: { $lt: MAX_OTP_ATTEMPTS } },
    { $inc: { attempts: 1 } },
    { new: true },
  );

  if (!otp) {
    const locked = await OtpModel.exists({ phone, attempts: { $gte: MAX_OTP_ATTEMPTS } });
    if (locked) throw AppError.tooManyRequests('Too many wrong attempts. Request a new code.');
    // Same message for "no code", "expired" and "wrong", so nobody learns which one it was.
    throw AppError.unauthorized('Invalid or expired code');
  }

  // 2. Compare hashes in constant time.
  if (!safeEqual(hashOtp(code), otp.codeHash)) {
    throw AppError.unauthorized('Invalid or expired code');
  }

  // 3. Use the code up. If two requests with the right code race, only one deletes it.
  const { deletedCount } = await OtpModel.deleteOne({ _id: otp._id });
  if (deletedCount === 0) throw AppError.unauthorized('Invalid or expired code');

  // 4. Find the user, or create one on first login (upsert = atomic, no duplicates).
  const user = await UserModel.findOneAndUpdate(
    { phone },
    { $setOnInsert: { phone } },
    { upsert: true, new: true },
  );

  return {
    token: signAuthToken(user.id),
    // "New" = has not finished ProfileSetup yet, even if the account already exists.
    isNewUser: !user.name,
    user: {
      id: user.id,
      phone: user.phone,
      name: user.name ?? null,
      about: user.about ?? null,
      avatar: user.avatar ?? null,
    },
  };
}
