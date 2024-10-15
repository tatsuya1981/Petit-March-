import express from 'express';
import apiRouters from './api/index';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const port = 4000;

app.get('/', (req, res) => {
  res.json({ message: 'ok' });
});

app.use(express.json());
app.use('/api', apiRouters);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
