import helmet from "helmet";
import { Application } from "express";

export const setupSecurity = (app: Application) => {
  app.use(helmet());
  app.disable("x-powered-by");
};
