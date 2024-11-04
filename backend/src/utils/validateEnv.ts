import dotenv from 'dotenv';

dotenv.config();

export interface ValidatedEnv {
  PORT: string;
  NODE_ENV: 'development' | 'production' | 'test';
  POSTGRES_DB: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  DATABASE_URL: string;
  MY_PEPPER: string;
  JWT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  BACKEND_URL: string;
  FRONTEND_URL: string;
  SESSION_SECRET: string;
}
// バリデーション関数
const validateEnv = () => {
  const requiredEnvVars = [
    'PORT',
    'NODE_ENV',
    'POSTGRES_DB',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'DATABASE_URL',
    'MY_PEPPER',
    'JWT_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'BACKEND_URL',
    'FRONTEND_URL',
    'SESSION_SECRET',
  ] as const; //読み取り専用

  // 必須環境変数のチェック
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  // NODE_ENVの値を検証
  const nodeEnv = process.env.NODE_ENV;
  if (!nodeEnv || !['development', 'production', 'test'].includes(nodeEnv)) {
    throw new Error('NODE_ENV must be either development, production, or test');
  }

  // 型ガード: このチェックを通過した後は、必須の環境変数が全て存在することが保証される
  const validatedEnv: ValidatedEnv = {
    PORT: process.env.PORT!,
    NODE_ENV: nodeEnv as 'development' | 'production' | 'test',
    POSTGRES_DB: process.env.POSTGRES_DB!,
    POSTGRES_USER: process.env.POSTGRES_USER!,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD!,
    DATABASE_URL: process.env.DATABASE_URL!,
    MY_PEPPER: process.env.MY_PEPPER!,
    JWT_SECRET: process.env.JWT_SECRET!,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
    BACKEND_URL: process.env.BACKEND_URL!,
    FRONTEND_URL: process.env.FRONTEND_URL!,
    SESSION_SECRET: process.env.SESSION_SECRET!,
  };

  return validatedEnv;
};

export const env = validateEnv();
