/**
 * Catches every request that no route matched and passes a 404 to the error handler.
 * Register it after all routes, before errorHandler.
 */
import type { RequestHandler } from 'express';
import { AppError } from '../utils/AppError.js';

export const notFound: RequestHandler = (req, _res, next) => {
  next(AppError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};
