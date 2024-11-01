declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT?: string;
      DATABASE_URL: string;
      // セッション関連
      SESSION_SECRET: string;

      // Google OAuth関連
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;

      // アプリケーションのURL
      FRONTEND_URL: string;
      BACKEND_URL: string;

      // その他の環境変数
      JWT_SECRET: string;
      MY_PEPPER: string;
    }
  }
}

export {};
