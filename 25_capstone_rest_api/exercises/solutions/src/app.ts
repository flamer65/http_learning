import express from "express";
import { setupSecurity } from "./middleware/security";
import { corsMiddleware } from "./middleware/cors";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./modules/auth/auth.routes";
import authorRoutes from "./modules/authors/author.routes";
import bookRoutes from "./modules/books/book.routes";

export const app = express();

setupSecurity(app);
app.use(corsMiddleware);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/books", bookRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Global error handler
app.use(errorHandler);
