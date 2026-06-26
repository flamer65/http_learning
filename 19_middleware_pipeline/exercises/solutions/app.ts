import express, { Request, Response, NextFunction } from "express";
import { logger } from "./middleware/logger";
import { requestId } from "./middleware/requestId";
import { responseTime } from "./middleware/responseTime";
import { errorHandler } from "./middleware/errorHandler";
import adminRoutes from "./routes/admin";
import publicRoutes from "./routes/public";

export const app = express();
export const middlewareOrderArray: string[] = [];

app.use(requestId);
app.use(responseTime);
app.use(logger);

app.use(express.json());

app.use("/public", publicRoutes);
app.use("/admin", adminRoutes);

app.post("/echo", (req: Request, res: Response) => {
  res.json(req.body);
});

const first = (req: Request, res: Response, next: NextFunction) => {
  middlewareOrderArray.push("first");
  next();
};
const second = (req: Request, res: Response, next: NextFunction) => {
  middlewareOrderArray.push("second");
  next();
};
const third = (req: Request, res: Response, next: NextFunction) => {
  middlewareOrderArray.push("third");
  next();
};

app.get("/order-test", first, second, third, (req, res) => {
  res.send("order test");
});

app.get("/error-route", (req, res, next) => {
  next(new Error("Test error"));
});

app.use(errorHandler);
