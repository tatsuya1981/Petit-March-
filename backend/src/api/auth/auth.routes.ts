// APIエンドポイントの定義とルーティングを記述

import express from 'express';
import { authenticateJWT, validateLoginInput, validateSignupInput } from './auth.middleware';
import { AuthController } from './auth.controller';
import passport from 'passport';

const router = express.Router();

// 認証が不要なパブリックルート
router.post('/sign-up', validateSignupInput, AuthController.signUp);
router.post('/log-in', validateLoginInput, AuthController.logIn);
router.post('/log-out', AuthController.logOut);

// プライベートルート
router.get('/me', authenticateJWT, AuthController.getCurrentUser);

// Google認証用ルート
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: true,
  }),
);

// Googleコールバックルート
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: true,
  }),
  AuthController.googleAuthCallback,
);

// セッション確認用ルート
router.get('/session', (req, res) => {
  res.json({ user: req.user || null });
});

export default router;
