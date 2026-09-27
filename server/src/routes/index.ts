import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import authRouter from './auth.js';
import profileRouter from './profile.js';

const router = express.Router();

// Public: no token needed (this is how you get one).
router.use('/auth', authRouter);

// Protected: requireAuth runs first for every /profile route.
router.use('/profile', requireAuth, profileRouter);

export default router;
