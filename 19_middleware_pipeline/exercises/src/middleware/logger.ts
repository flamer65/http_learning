import { Request, Response, NextFunction } from "express";

export const logger = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Log the request method and url to the console
  // TODO: Call next()
  console.log(`${req.method} ${req.url}`);
  next();
};
