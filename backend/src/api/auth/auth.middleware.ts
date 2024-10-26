import bcryptjs from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AppError } from 'middleware/errorHandler';
import { z } from 'zod';

// 環境変数を取得
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined. Please set it in your environment variables.');
}
const PEPPER = process.env.MY_PEPPER;

// パスワードをハッシュ＋ソルト＋ペッパー化するユーティリティ関数
export const hashedPassword = async (password: string): Promise<string> => {
  // パスワードにペッパーを追加
  const pepperPassword = password + PEPPER;
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(pepperPassword, salt);
};

// パスワードを検証するユーティリティ関数
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const pepperPassword = password + PEPPER;
  return bcryptjs.compare(pepperPassword, hashedPassword);
};

// バリデーションのスキーマ
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const signupSchema = loginSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

// ZodErrorのエラーメッセージを整形するヘルパー関数
const formatZodError = (error: z.ZodError): string => {
  return error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(',');
};

// 入力バリデーション用ミドルウェア
export const validateLoginInput = (req: Request, res: Response, next: NextFunction) => {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(formatZodError(error), 400));
    } else {
      next(new AppError('Invalid input', 400));
    }
  }
};

export const validateSignupInput = (req: Request, res: Response, next: NextFunction) => {
  try {
    signupSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(formatZodError(error), 400));
    } else {
      next(new AppError('Invalid input', 400));
    }
  }
};

// JWT認証用ミドルウェア
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError('Authentication token is missing', 401);
    }
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });

      // 型チェックを行い、必要な情報だけを抽出する
      if (typeof decoded === 'string' || !(decoded as JwtPayload).id) {
        throw new AppError('Invalid token format', 401);
      }

      // ユーザー情報を UserPayload 型にマッピング
      const userPayload: UserPayload = {
        id: decoded.id,
        email: decoded.email,
      };

      req.user = userPayload;
      next();
    } catch (error) {
      throw new AppError('Invalid or expired token', 401);
    }
  } catch (error) {
    next(error);
  }
};

// カスタムリクエスト型定義
interface UserPayload {
  id: string;
  email: string;
}
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
