import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export const cacheControl = (maxAge: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method === "GET") {
      res.setHeader("Cache-Control", \`public, max-age=\${maxAge}\`);
    }
    next();
  };
};

export const etagMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;

  res.send = function (body: any): Response {
    if (req.method === "GET" && typeof body === "string") {
      const etag = '"' + crypto.createHash("md5").update(body).digest("hex") + '"';
      res.setHeader("ETag", etag);

      if (req.headers["if-none-match"] === etag) {
        res.status(304);
        return originalSend.call(this, "");
      }
    }
    return originalSend.call(this, body);
  };

  next();
};
