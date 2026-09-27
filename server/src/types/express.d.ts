/**
 * Adds our own fields to Express's Request type (declaration merging).
 * `userId` is set by the requireAuth middleware, so it exists on every
 * route mounted behind it.
 */
export {};

declare global {
  namespace Express {
    interface Request {
      /** Id of the logged-in user. Set by requireAuth. */
      userId?: string;
    }
  }
}
