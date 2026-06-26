import express, { Request, Response, NextFunction } from "express";
import { logger } from "./middleware/logger";
import { requestId } from "./middleware/requestId";
import { responseTime } from "./middleware/responseTime";
import { errorHandler } from "./middleware/errorHandler";
import adminRoutes from "./routes/admin";
import publicRoutes from "./routes/public";

export const app = express();
export const middlewareOrderArray: string[] = [];

// TODO: Apply requestId middleware globally
app.use(requestId);
// TODO: Apply responseTime middleware globally
app.use(responseTime);
// TODO: Apply logger middleware globally
app.use(logger);
// TODO: Apply built-in JSON parser middleware
app.use(express.json());
// Routes
// TODO: Mount publicRoutes at /public
// TODO: Mount adminRoutes at /admin
app.use("/public", publicRoutes);
app.use("/admin", adminRoutes);
// Simple echo route for testing JSON parser
app.post("/echo", (req: Request, res: Response) => {
  res.json(req.body);
});

// Middleware Order Test
const first = (req: Request, res: Response, next: NextFunction) => {
  // TODO: push "first" to middlewareOrderArray and call next()
  middlewareOrderArray.push("first");
  next();
};
const second = (req: Request, res: Response, next: NextFunction) => {
  // TODO: push "second" to middlewareOrderArray and call next()
  middlewareOrderArray.push("second");
  next();
};
const third = (req: Request, res: Response, next: NextFunction) => {
  // TODO: push "third" to middlewareOrderArray and call next()
  middlewareOrderArray.push("third");
  next();
};

app.get("/order-test", first, second, third, (req, res) => {
  res.send("order test");
});

// Error route
app.get("/error-route", (req, res, next) => {
  // TODO: Throw a new Error("Test error") or pass it to next()
  next(new Error("Test error"));
});

// TODO: Apply errorHandler middleware globally (must be last!)
app.use(errorHandler);