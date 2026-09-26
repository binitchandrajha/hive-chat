/**
 * Auth controller: handlers for the /auth routes.
 * A controller reads the request, calls models/utils, and sends the response.
 * The route file only says "this URL -> this function".
 * On failure, throw an AppError: the global errorHandler sends the response.
 */
import type { Request, Response } from 'express';
import { OtpModel } from '../models/Otp.js';
import { AppError } from '../utils/AppError.js';
import { generateOtp, hashOtp } from '../utils/otp.js';
import { normalizePhone } from '../utils/phone.js';

const OTP_TTL_MS = 5 * 60 * 1000;

interface SendOtpBody {
  phone?: unknown;
}

export async function sendOtp(req: Request<unknown, unknown, SendOtpBody>, res: Response): Promise<void> {
  const rawPhone = req.body?.phone;
  if (typeof rawPhone !== 'string') {
    throw AppError.validation('phone is required', [{ field: 'phone', message: 'phone is required' }]);
  }

  const phone = normalizePhone(rawPhone);
  if (!phone) {
    throw AppError.validation('Invalid phone number', [{ field: 'phone', message: 'Invalid phone number' }]);
  }

  const code = generateOtp();

  // One Otp document per phone (phone is unique): create it, or replace the old one.
  await OtpModel.findOneAndUpdate(
    { phone },
    { codeHash: hashOtp(code), expiresAt: new Date(Date.now() + OTP_TTL_MS), attempts: 0 },
    { upsert: true },
  );

  // No SMS provider yet, so print the code in the server terminal.
  console.log(`[otp] ${phone} -> ${code}`);

  res.json({ ok: true });
}
