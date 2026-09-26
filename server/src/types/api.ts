/**
 * Shapes of what the API sends back. The mobile app can mirror these types.
 *
 * Every error response looks like:
 *   { "ok": false, "error": { "code": "NOT_FOUND", "message": "User not found" } }
 */

/** One code per kind of failure. The app switches on `code`, never on `message`. */
export type ErrorCode =
  | 'BAD_REQUEST' //          400 malformed request (bad JSON, bad id)
  | 'UNAUTHORIZED' //         401 not logged in / bad or expired token
  | 'FORBIDDEN' //            403 logged in, but not allowed
  | 'NOT_FOUND' //            404 route or record does not exist
  | 'CONFLICT' //             409 duplicate (phone already used, …)
  | 'PAYLOAD_TOO_LARGE' //    413 body bigger than the limit
  | 'VALIDATION_ERROR' //     422 well-formed, but a field is wrong
  | 'TOO_MANY_REQUESTS' //    429 rate limited
  | 'INTERNAL_ERROR'; //      500 our bug / DB down

export interface ApiError {
  code: ErrorCode;
  message: string;
  /** Extra info, e.g. which fields failed: [{ field: 'phone', message: '…' }] */
  details?: unknown;
}

export interface ApiErrorBody {
  ok: false;
  error: ApiError;
}

export interface FieldError {
  field: string;
  message: string;
}

/** What the app is allowed to see about a user. */
export interface PublicUser {
  id: string;
  phone: string;
  name: string | null;
  about: string | null;
  avatar: string | null;
}

/** POST /auth/verify-otp → 200 */
export interface VerifyOtpResponse {
  ok: true;
  token: string;
  /** true until the user has saved a name: the app shows ProfileSetup. */
  isNewUser: boolean;
  user: PublicUser;
}
