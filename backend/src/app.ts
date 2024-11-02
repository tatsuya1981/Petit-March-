import express from 'express';
import apiRouters from './api/index';
import { errorHandler } from './middleware/errorHandler';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { validateEnv } from '../src/utils/validateEnv';

// 環境変数のバリデーション
const env = validateEnv();

const app = express();
const port = env.PORT;

app.get('/', (req, res) => {
  res.json({ message: 'ok' });
});

// cors の設定
app.use(
  cors({
    origin: 'http://localhost:3000',
  }),
);

// セッション管理
app.use(
  session({
    secret: env.SESSION_SECRET || 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      // 24時間
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use('/api', apiRouters);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
