import express from 'express';
import apiRouters from './api/index';
import { errorHandler } from './middleware/errorHandler';
import cors from 'cors';
import { env } from './utils/validateEnv';
import passport from './config/passport';

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

app.use(passport.initialize());
app.use(express.json());
app.use('/api', apiRouters);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
