import express from "express";
import { manualSecurityHeaders, hidePoweredBy } from "./middleware/security";
import { rateLimiter } from "./middleware/rateLimit";
import apiRoutes from "./routes/api";

const app = express();

app.use(express.json());

// TODO: Apply your manual security headers middleware here!
 app.use(hidePoweredBy);
 app.use(manualSecurityHeaders);

// TODO: Apply rate limiting here!
 app.use(rateLimiter);

// Routes
app.use("/api", apiRoutes);

export { app };
