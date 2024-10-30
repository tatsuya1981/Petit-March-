// HTTPレスポンスとリクエストの処理を記述
import { NextFunction, Request, Response } from 'express';
import prisma from '../../config/database';
import { JWT_SECRET } from '../../config/jwt';
import { AppError } from '../../middleware/errorHandler';
import { hashedPassword, verifyPassword } from './auth.middleware';
import jwt from 'jsonwebtoken';
import { AuthModel } from './auth.model';

interface SignupRequestBody {
  email: string;
  password: string;
  name: string;
  generation?: number;
  gender?: string;
}

export class AuthController {
  // サインアップ
  static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = req.body as SignupRequestBody;
      const user = await AuthModel.createUser(userData);

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
      const user = await AuthModel.findUserByEmail(email);

      if (!user.isActive) {
        throw new AppError('Account is inactive', 401);
      }

      // パスワードの検証
      const isValidPassword = await verifyPassword(password, user.passwordDigest);
      if (!isValidPassword) {
        throw new AppError('Invalid credentials', 401);
      }
      // 最終ログイン日時の更新
      await AuthModel.updateLastLogin(user.id);

      // JWTトークンの生成
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { algorithm: 'HS256', expiresIn: '24h' });
      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          generation: user.generation,
          gender: user.gender,
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
      const user = await AuthModel.findUserById(parseInt(userId));
      res.json({
        message: 'Current user information',
        user,
      });
    } catch (error) {
      next(error);
    }
  }
}
