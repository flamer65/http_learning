import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export const setCacheControl = (directive: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', directive);
    res.setHeader('Vary', 'Accept-Encoding');
    next();
  };
};

export const etagMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;

  res.send = function (body) {
    const hash = crypto.createHash('md5').update(String(body)).digest('hex');
    const etag = `"${hash}"`;

    res.setHeader('ETag', etag);

    if (req.headers['if-none-match'] === etag) {
      res.status(304).end();
      return this;
    }

    return originalSend.call(this, body);
  };

  next();
};
