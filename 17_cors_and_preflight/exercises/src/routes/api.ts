import { Router } from 'express';

const router = Router();

router.all('/data', (req, res) => {
  res.json({ success: true, method: req.method });
});

export default router;
