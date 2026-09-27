import express from 'express';
import { getMe, updateMe } from '../controllers/profile.controller.js';

const router = express.Router();

router.get('/me', getMe);
router.patch('/me', updateMe);

export default router;
