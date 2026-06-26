import express from "express";
import { manualSecurityHeaders, hidePoweredBy } from "./middleware/security";
import { rateLimiter } from "./middleware/rateLimit";
import apiRoutes from "./routes/api";

const app = express();

app.use(express.json());

app.use(hidePoweredBy);
app.use(manualSecurityHeaders);
app.use(rateLimiter);

app.use("/api", apiRoutes);

export { app };
