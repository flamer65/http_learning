import { Request, Response, NextFunction, RequestHandler } from "express";

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler => {
  return (req, res, next) => {
    // TODO: Call fn(req, res, next).
    // Ensure it's wrapped in Promise.resolve() to handle both sync and async functions.
    // Use .catch(next) to pass any errors to Express's error handler.
    fn(req, res, next) as any;
  };
};
