import express from 'express';
import apiRouters from './api/index';
import { errorHandler } from './middleware/errorHandler';
import cors from 'cors';

const app = express();
const port = 4000;

app.get('/', (req, res) => {
  res.json({ message: 'ok' });
});

// cors の設定
app.use(
  cors({
    origin: 'http://localhost:3000',
  }),
);

app.use(express.json());
app.use('/api', apiRouters);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
