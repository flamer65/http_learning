import { Router } from 'express';
import { setCacheControl, etagMiddleware } from '../middleware/cache';

const router = Router();

// TODO: Apply no-cache / private cache control
router.get('/me/dashboard',setCacheControl('private, no-cache'), (req, res) => {
  res.json({ user: 'Alice', role: 'admin' });
  
});

// TODO: Apply no-store cache control
router.get('/me/bank-balance',setCacheControl('no-store'), (req, res) => {
  res.json({ balance: 1000000 });
});

// TODO: Apply public, max-age=300, s-maxage=3600, stale-while-revalidate=60 cache control
// TODO: Apply etagMiddleware
router.get('/products', setCacheControl('public, max-age=300, s-maxage=3600, stale-while-revalidate=60'),etagMiddleware, (req, res) => {
  res.json([{ id: 1, name: 'Laptop' }, { id: 2, name: 'Mouse' }]);
});

const articles = {
  '1': { title: 'Understanding HTTP', content: '...', lastModified: new Date('2023-01-01T00:00:00Z') }
};

router.get('/articles/:id',setCacheControl("no-cache"), (req, res) => {
  const article = articles[req.params.id as keyof typeof articles];
  if (!article) return res.status(404).send('Not Found');

  // TODO: Set Last-Modified header to article.lastModified
  res.set('Last-Modified', article.lastModified.toUTCString());
  // TODO: Check If-Modified-Since header
  // If the article hasn't been modified since that date, return 304
if (req.headers['if-modified-since']) {
    const ifModifiedSince = new Date(req.headers['if-modified-since']);
    if (article.lastModified <= ifModifiedSince) {
      return res.status(304).end();
    }}
  res.json(article);
});

export default router;
