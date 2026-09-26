/**
 * AppError: the one error class every controller throws.
 * The global error handler (middleware/errorHandler.ts) turns it into a JSON response.
 *
 * Usage (inside any controller or middleware):
 *   throw AppError.badRequest('phone is required');
 *   throw AppError.validation('Invalid input', [{ field: 'phone', message: 'Invalid phone number' }]);
 *   throw AppError.unauthorized();
 *   throw AppError.notFound('User not found');
 *   throw AppError.tooManyRequests('Wait 30 seconds before asking for a new code');
 *
 * Express 5 catches errors thrown in async handlers by itself, so no try/catch
 * or asyncHandler wrapper is needed: just `throw` and the handler does the rest.
 */
import type { ErrorCode, FieldError } from '../types/api.js';

export const STATUS_BY_CODE: Record<ErrorCode, number> = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  PAYLOAD_TOO_LARGE: 413,
  VALIDATION_ERROR: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
};

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly details?: unknown;

  constructor(code: ErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = STATUS_BY_CODE[code];
    this.details = details;
  }

  static badRequest(message = 'Bad request', details?: unknown): AppError {
    return new AppError('BAD_REQUEST', message, details);
  }

  static unauthorized(message = 'Unauthorized'): AppError {
    return new AppError('UNAUTHORIZED', message);
  }

  static forbidden(message = 'Forbidden'): AppError {
    return new AppError('FORBIDDEN', message);
  }

  static notFound(message = 'Not found'): AppError {
    return new AppError('NOT_FOUND', message);
  }

  static conflict(message = 'Already exists', details?: unknown): AppError {
    return new AppError('CONFLICT', message, details);
  }

  static payloadTooLarge(message = 'Request body is too large'): AppError {
    return new AppError('PAYLOAD_TOO_LARGE', message);
  }

  static validation(message = 'Validation failed', fields?: FieldError[]): AppError {
    return new AppError('VALIDATION_ERROR', message, fields);
  }

  static tooManyRequests(message = 'Too many requests'): AppError {
    return new AppError('TOO_MANY_REQUESTS', message);
  }

  static internal(message = 'Something went wrong'): AppError {
    return new AppError('INTERNAL_ERROR', message);
  }
}
