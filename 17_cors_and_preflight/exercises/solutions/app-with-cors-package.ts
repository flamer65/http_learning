import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api';

export const app = express();

app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:3000", "https://myapp.com"],
  credentials: true,
  exposedHeaders: ["X-Request-Id", "X-Total-Count"],
  maxAge: 86400
};

app.use(cors(corsOptions));
app.use('/api', apiRoutes);
