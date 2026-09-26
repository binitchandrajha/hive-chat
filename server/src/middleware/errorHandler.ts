/**
 * Global error handler: the last middleware in app.ts.
 * Every error thrown in a route, controller or middleware ends up here and is sent as
 *   { ok: false, error: { code, message, details? } }
 *
 * Express knows this is an error handler because it takes 4 arguments (err, req, res, next).
 */
import type { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import type { ApiErrorBody, FieldError } from '../types/api.js';

/** Errors from express.json(): bad JSON or a body over the size limit. */
function isBodyParserError(err: unknown): err is { type: string } {
  return typeof err === 'object' && err !== null && 'type' in err && typeof err.type === 'string';
}

/** MongoDB unique-index violation, e.g. two users with the same phone. */
function isDuplicateKeyError(err: unknown): err is { code: 11000; keyValue?: Record<string, unknown> } {
  return typeof err === 'object' && err !== null && 'code' in err && err.code === 11000;
}

/** Turn any thrown value into an AppError, so the response always has the same shape. */
function toAppError(err: unknown): AppError {
  if (err instanceof AppError) return err;

  if (isBodyParserError(err)) {
    if (err.type === 'entity.parse.failed') return AppError.badRequest('Invalid JSON body');
    if (err.type === 'entity.too.large') return AppError.payloadTooLarge();
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const fields: FieldError[] = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    return AppError.validation('Validation failed', fields);
  }

  if (err instanceof mongoose.Error.CastError) {
    return AppError.badRequest(`Invalid ${err.path}`);
  }

  if (isDuplicateKeyError(err)) {
    return AppError.conflict('Already exists', { fields: Object.keys(err.keyValue ?? {}) });
  }

  // TokenExpiredError extends JsonWebTokenError, so check it first.
  if (err instanceof jwt.TokenExpiredError) return AppError.unauthorized('Token expired');
  if (err instanceof jwt.JsonWebTokenError) return AppError.unauthorized('Invalid token');

  return AppError.internal();
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Response already started streaming: let Express close the connection.
  if (res.headersSent) {
    next(err);
    return;
  }

  const appError = toAppError(err);

  // 5xx means a bug or an outage: log the original error with its stack.
  if (appError.status >= 500) {
    console.error(`[error] ${req.method} ${req.originalUrl}`, err);
  }

  const body: ApiErrorBody = {
    ok: false,
    error: { code: appError.code, message: appError.message },
  };
  if (appError.details !== undefined) body.error.details = appError.details;

  // In development, show the real message of unexpected errors to help debugging.
  if (appError.code === 'INTERNAL_ERROR' && !env.IS_PRODUCTION && err instanceof Error) {
    body.error.message = err.message;
  }

  res.status(appError.status).json(body);
};
