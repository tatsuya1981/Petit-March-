// HTTPレスポンスとリクエストの処理を記述
import { NextFunction, Request, Response } from 'express';
import prisma from '../../config/database';
import { JWT_SECRET } from '../../config/jwt';
import { AppError } from 'middleware/errorHandler';
import { hashedPassword, verifyPassword } from './auth.middleware';
import jwt from 'jsonwebtoken';

interface SignupRequestBody {
  email: string;
  password: string;
  name: string;
}

export class AuthController {
  // サインアップ
  static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body as SignupRequestBody;
      // メールアドレスの重複チェック
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new AppError('Email already exists', 400);
      }

      // パスワードのハッシュ化
      const passwordHash = await hashedPassword(password);

      // ユーザー作成
      const user = await prisma.user.create({
        data: {
          email,
          name,
          passwordDigest: passwordHash,
          isActive: true,
        },
        select: {
          id: true,
          email: true,
          name: true,
          isActive: true,
          createdAt: true,
        },
      });

      // JWTトークンの生成
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { algorithm: 'HS256', expiresIn: '24h' });
      res.status(201).json({
        message: 'User created successfully',
        user,
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  // ログイン
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      // ユーザー検索
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user || !user.isActive) {
        throw new AppError('Invalid credentials', 401);
      }
      // パスワードの検証
      const isValidPassword = await verifyPassword(password, user.passwordDigest);
      if (!isValidPassword) {
        throw new AppError('Invalid credentials', 401);
      }

      // 最終ログイン日時の更新
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      // JWTトークンの生成
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { algorithm: 'HS256', expiresIn: '24h' });
      res.json({
        message: 'Login successful',
        user: {
          email: user.email,
          name: user.name,
          isActive: user.isActive,
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  }
  // ログアウト
  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }
  // 現在のユーザー情報取得
  static async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: {
          id: true,
          email: true,
          name: true,
          isActive: true,
          lastLoginAt: true,
        },
      });
      if (!user) {
        throw new AppError('User not found', 404);
      }
      res.json({
        message: 'Current user information',
        user,
      });
    } catch (error) {
      next(error);
    }
  }
}
