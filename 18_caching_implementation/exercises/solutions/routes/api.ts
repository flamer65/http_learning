import { Router } from 'express';
import { setCacheControl, etagMiddleware } from '../middleware/cache';

const router = Router();

router.get('/me/dashboard', setCacheControl('private, no-cache'), (req, res) => {
  res.json({ user: 'Alice', role: 'admin' });
});

router.get('/me/bank-balance', setCacheControl('no-store'), (req, res) => {
  res.json({ balance: 1000000 });
});

router.get('/products', 
  setCacheControl('public, max-age=300, s-maxage=3600, stale-while-revalidate=60'),
  etagMiddleware,
  (req, res) => {
    res.json([{ id: 1, name: 'Laptop' }, { id: 2, name: 'Mouse' }]);
  }
);

const articles = {
  '1': { title: 'Understanding HTTP', content: '...', lastModified: new Date('2023-01-01T00:00:00Z') }
};

router.get('/articles/:id', (req, res) => {
  const article = articles[req.params.id as keyof typeof articles];
  if (!article) return res.status(404).send('Not Found');

  res.setHeader('Last-Modified', article.lastModified.toUTCString());

  const ifModifiedSince = req.headers['if-modified-since'];
  if (ifModifiedSince) {
    const sinceDate = new Date(ifModifiedSince);
    if (article.lastModified <= sinceDate) {
      return res.status(304).end();
    }
  }

  res.json(article);
});

export default router;
