import express from "express";
import helmet from "helmet";
import apiRoutes from "./routes/api";

const app = express();

app.use(express.json());

// Helmet automatically sets various security headers, including hiding X-Powered-By
app.use(helmet());

// We can still use our rate limiter
import { rateLimiter } from "./middleware/rateLimit";
app.use(rateLimiter);

app.use("/api", apiRoutes);

export { app };
