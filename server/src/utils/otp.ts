/**
 * OTP helpers.
 *
 * Usage:
 *   const code = generateOtp();        // "004821"
 *   const codeHash = hashOtp(code);    // store this, never the code
 *   safeEqual(hashOtp(input), codeHash) // check a code the user typed
 */
import { createHmac, randomInt, timingSafeEqual } from 'node:crypto';
import { env } from '../config/env.js';

export const OTP_LENGTH = 6;

/** Random 6-digit code as a string, so leading zeros survive. */
export function generateOtp(): string {
  return randomInt(0, 10 ** OTP_LENGTH).toString().padStart(OTP_LENGTH, '0');
}

/**
 * HMAC-SHA256 of the code with a server secret, as hex.
 * A plain hash of a 6-digit code could be brute-forced in an instant from a
 * leaked database; the secret makes that impossible without the server's key.
 */
export function hashOtp(code: string): string {
  return createHmac('sha256', env.JWT_SECRET).update(code).digest('hex');
}

/** Compare two hex hashes in constant time (avoids timing attacks on `===`). */
export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}
