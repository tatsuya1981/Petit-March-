import express from 'express';
import apiRouters from './api/index';
import { errorHandler } from './middleware/errorHandler';
import cors from 'cors';
import session from 'express-session';
import { validateEnv } from '../src/utils/validateEnv';
import passport from './config/passport';

// 環境変数のバリデーション
const env = validateEnv();

const app = express();
// 検証済みの環境変数envを使用
const port = env.PORT;

// cors の設定
const corsOptions = {
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie'],
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.json({ message: 'ok' });
});

// セッション管理
app.use(
  session({
    secret: env.SESSION_SECRET,
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
