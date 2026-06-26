import { Router } from 'express';
import { setCacheControl } from '../middleware/cache';

const router = Router();

// TODO: Apply public, max-age=31536000, immutable cache control
router.get('/static/app.js',setCacheControl("public, max-age=31536000, immutable"), (req, res) => {
  res.type('application/javascript');
  
  res.send('console.log("App Loaded");');
});

export default router;

