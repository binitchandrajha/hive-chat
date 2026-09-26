/**
 * Auth controller: handlers for the /auth routes.
 * A controller reads the request, calls the service, and sends the response.
 * The route file only says "this URL -> this function".
 * On failure, throw an AppError: the global errorHandler sends the response.
 */
import type { Request, Response } from 'express';
import { requestOtp, verifyOtpAndLogin } from '../services/auth.service.js';
import type { VerifyOtpResponse } from '../types/api.js';
import { AppError } from '../utils/AppError.js';
import { OTP_LENGTH } from '../utils/otp.js';
import { normalizePhone } from '../utils/phone.js';

const OTP_PATTERN = new RegExp(`^\\d{${OTP_LENGTH}}$`);

interface SendOtpBody {
  phone?: unknown;
}

interface VerifyOtpBody {
  phone?: unknown;
  code?: unknown;
}

/** Body values are `unknown` until checked: return a normalised phone or throw 422. */
function parsePhone(value: unknown): string {
  if (typeof value !== 'string') {
    throw AppError.validation('phone is required', [{ field: 'phone', message: 'phone is required' }]);
  }
  const phone = normalizePhone(value);
  if (!phone) {
    throw AppError.validation('Invalid phone number', [{ field: 'phone', message: 'Invalid phone number' }]);
  }
  return phone;
}

function parseCode(value: unknown): string {
  if (typeof value !== 'string' || !OTP_PATTERN.test(value)) {
    const message = `code must be ${OTP_LENGTH} digits`;
    throw AppError.validation(message, [{ field: 'code', message }]);
  }
  return value;
}

export async function sendOtp(req: Request<unknown, unknown, SendOtpBody>, res: Response): Promise<void> {
  const phone = parsePhone(req.body?.phone);
  await requestOtp(phone);
  res.json({ ok: true });
}

export async function verifyOtp(
  req: Request<unknown, VerifyOtpResponse, VerifyOtpBody>,
  res: Response<VerifyOtpResponse>,
): Promise<void> {
  const phone = parsePhone(req.body?.phone);
  const code = parseCode(req.body?.code);

  const { token, isNewUser, user } = await verifyOtpAndLogin(phone, code);
  res.json({ ok: true, token, isNewUser, user });
}
