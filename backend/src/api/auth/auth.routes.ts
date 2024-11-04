// APIエンドポイントの定義とルーティングを記述

import express from 'express';
import { authenticateJWT, validateLoginInput, validateSignupInput } from './auth.middleware';
import { AuthController } from './auth.controller';
import passport from 'passport';
import { env } from '../../utils/validateEnv';
import { User } from '../../config/passport';

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
    // セッションを使用しない
    session: false,
  }),
);

// Googleコールバックルート
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  (req, res) => {
    const user = req.user as User;

    // フロントエンドにリダイレクトする際、トークンをクエリパラメータとして付与
    res.redirect(
      `${env.FRONTEND_URL}/auth/callback?` +
        `token=${user.token}&` +
        `userId=${user.id}&` +
        // encodeURIComponent関数でURLエンコードにして送信
        `email=${encodeURIComponent(user.email)}&` +
        `name=${encodeURIComponent(user.name)}`,
    );
  },
);

export default router;
