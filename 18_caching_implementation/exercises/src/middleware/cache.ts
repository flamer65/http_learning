import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

// Reusable factory for setting cache control headers
export const setCacheControl = (directive: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // TODO: Set Cache-Control header based on directive
    res.set("Cache-Control", directive)
    // TODO: Set Vary header (Accept-Encoding is a good default for compressible resources)
    res.set("Vary", "Accept-Encoding")
    next();
  };
};

export const etagMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Capture the original res.send to intercept the response body
  const originalSend = res.send;

  res.send = function (body) {
    // TODO: Generate MD5 ETag from body (wrap the hash in quotes like "hash")
    const hash = crypto.createHash('md5').update(String(body)).digest('hex');
    const etag = `"${hash}"`;
    res.set("ETag", etag);
    // TODO: Set ETag header
    if (req.headers['if-none-match'] === etag) {
      res.status(304).end();
      return this;
    }
    // TODO: Check conditional request (If-None-Match) against generated ETag
    // If it matches, send 304 and return this
    
    // Call original send
    return originalSend.call(this, body);
  };

  next();
};
