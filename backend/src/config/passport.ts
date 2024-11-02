import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from './database';
import { hashedPassword } from '../api/auth/auth.middleware';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

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
          return done(new Error('No email found in Google profile'));
        }
        // 既存ユーザーの検索
        let user = await prisma.user.findUnique({
          where: { email },
        });

        // 新規ユーザーを作成
        if (!user) {
          // google認証のためにパスワードを生成
          const randomPassword = Math.random().toString(36).slice(-8);
          const passwordHash = await hashedPassword(randomPassword);

          user = await prisma.user.create({
            data: {
              email,
              name: profile.displayName || email.split('@')[0],
              passwordDigest: passwordHash,
              googleId: profile.id,
              isActive: true,
            },
          });
        } else if (!user.googleId) {
          // 既存ユーザーにgoogleIDを紐づける
          user = await prisma.user.update({
            where: { id: user.id },
            data: { googleId: profile.id },
          });
        }
        // データを整えpassport.jsへ渡す
        const userForPassport: Express.User = {
          id: user.id,
          email: user.email,
          name: user.name,
          googleId: user.googleId,
          isActive: user.isActive,
          generation: user.generation,
          gender: user.gender,
        };
        // passportへ処理完了を通知しuserForPassportをセッションへ保存
        return done(null, userForPassport);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

// 認証されたユーザーデータをセッションに保存
passport.serializeUser((user: Express.User, done) => {
  done(null, user.id);
});

// セッションに保存されたidからユーザーオブジェクトを再生成
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      return done(new Error('User not found'));
    }
    // データを整えpassport.jsへ渡す
    const userForPassport: Express.User = {
      id: user.id,
      email: user.email,
      name: user.name,
      googleId: user.googleId,
      isActive: user.isActive,
      generation: user.generation,
      gender: user.gender,
    };
    done(null, userForPassport);
  } catch (error) {
    done(error);
  }
});

export default passport;
