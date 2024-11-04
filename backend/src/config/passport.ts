import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from './database';
import { hashedPassword } from '../api/auth/auth.middleware';
import { env } from '../utils/validateEnv';
import jwt from 'jsonwebtoken';
import { AppError } from '../middleware/errorHandler';

const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;
const BACKEND_URL = env.BACKEND_URL;
const JWT_SECRET = env.JWT_SECRET;

// JWTペイロードの型定義
interface JWTPayload {
  id: number;
  email: string;
  name: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  isActive: boolean;
  generation?: number | null;
  gender?: string | null;
  token: string;
}

// トークン生成
const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    // 有効期限
    expiresIn: '24h',
    // アルゴリズムの指定
    algorithm: 'HS256',
  });
};

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      // 認証成功時ユーザーをこのURLへリダイレクトさせる
      callbackURL: `${BACKEND_URL}/api/auth/google/callback`,
      // trueでコールバック関数にリクエストオブジェクトが渡される
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // プロフィールからメールアドレスを取得
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new AppError('No email found in Google profile', 400));
        }

        // ユーザー取得または作成
        const user = await prisma.user.upsert({
          where: {
            email,
          },
          update: {
            googleId: profile.id,
            lastLoginAt: new Date(),
          },
          create: {
            email,
            name: profile.displayName || email.split('@')[0],
            passwordDigest: await hashedPassword(Math.random().toString(36).slice(-8)),
            googleId: profile.id,
            isActive: true,
            lastLoginAt: new Date(),
          },
        });

        // JWTペイロードの作成
        const payload: JWTPayload = {
          id: user.id,
          email: user.email,
          name: user.name,
        };
        // JWTトークンを生成
        const token = generateToken(payload);

        // Passportが期待する形式のUserオブジェクトを作成
        const userResponse: User = {
          id: user.id,
          email: user.email,
          name: user.name,
          isActive: user.isActive,
          generation: user.generation,
          gender: user.gender,
          token: token,
        };

        return done(null, userResponse);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

export default passport;
