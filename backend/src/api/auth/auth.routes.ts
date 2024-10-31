// APIエンドポイントの定義とルーティングを記述

import express from 'express';
import { authenticateJWT, validateLoginInput, validateSignupInput } from './auth.middleware';
import { AuthController } from './auth.controller';
import passport from 'passport';

const router = express.Router();

// 認証が不要なパブリックルート
router.post('/signup', validateSignupInput, AuthController.signup);
router.post('/login', validateLoginInput, AuthController.login);
router.post('/logout', AuthController.logout);

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
