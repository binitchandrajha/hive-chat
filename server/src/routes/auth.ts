import express from 'express';
import { sendOtp, verifyOtp } from '../controllers/auth.controller.ts';

const router = express.Router();

router.get('/', (_req, res) => {
  res.json({ ok: true });
});

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

export default router;
