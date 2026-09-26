/**
 * Phone helpers. Mirrors the app's default country (mobile/src/utils/phone.ts).
 *
 * Usage:
 *   normalizePhone('981 234 5678')      // "+9779812345678"
 *   normalizePhone('+977-981-234-5678') // "+9779812345678"
 *   normalizePhone('12345')             // null (invalid)
 * Always normalise before saving or looking up a phone, so one person is one record.
 */
export const DEFAULT_DIAL_CODE = '+977';
export const NATIONAL_LENGTH = 10;

/** E.164 allows at most 15 digits, and at least a few. */
const E164 = /^\+[1-9]\d{7,14}$/;

/** Returns the phone in E.164 form ("+9779812345678"), or null if it is invalid. */
export function normalizePhone(input: string): string | null {
  const trimmed = input.trim();
  const digits = trimmed.replace(/\D/g, '');

  let phone: string;
  if (trimmed.startsWith('+')) {
    phone = `+${digits}`;
  } else if (digits.length === NATIONAL_LENGTH) {
    phone = `${DEFAULT_DIAL_CODE}${digits}`;
  } else {
    return null;
  }

  return E164.test(phone) ? phone : null;
}
