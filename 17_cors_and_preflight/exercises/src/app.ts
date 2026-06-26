import express from 'express';
import { customCors } from './middleware/cors';
import apiRoutes from './routes/api';

export const app = express();

app.use(express.json());
app.use(customCors);

app.use('/api', apiRoutes);
