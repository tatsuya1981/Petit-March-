// APIエンドポイントの定義とルーティングを記述

import express from 'express';
import { authenticateJWT, validateLoginInput, validateSignupInput } from './auth.middleware';
import { AuthController } from './auth.controller';

const router = express.Router();

// 認証が不要なパブリックルート
router.post('/signup', validateSignupInput, AuthController.signup);
router.post('/login', validateLoginInput, AuthController.login);
router.post('/logout', AuthController.logout);

// プライベートルート
router.get('/me', authenticateJWT, AuthController.getCurrentUser);

export default router;
