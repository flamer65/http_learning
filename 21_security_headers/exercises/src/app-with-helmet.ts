import express from "express";
// import helmet from "helmet";
import apiRoutes from "./routes/api";
import helmet from "helmet";
const app = express();

app.use(express.json());

// TODO: Use Helmet here instead of the manual middleware!
 app.use(helmet());

app.use("/api", apiRoutes);

export { app };
