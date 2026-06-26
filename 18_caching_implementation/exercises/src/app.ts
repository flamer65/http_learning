import express from 'express';
import apiRoutes from './routes/api';
import staticRoutes from './routes/static';
import { setCacheControl } from './middleware/cache';

export const app = express();

app.use('/api', apiRoutes);
app.use(staticRoutes);

// Apply no-cache to the root HTML page
app.get('/', setCacheControl('no-cache'), (req, res) => {
  res.send('<html><body>Home</body></html>');
});
