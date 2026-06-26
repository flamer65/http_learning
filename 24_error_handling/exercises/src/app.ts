import express from "express";
import { todoRoutes } from "./routes/todos";
import { errorHandler } from "./middleware/errorHandler";
import { asyncHandler } from "./utils/asyncHandler";

export const app = express();
app.use(express.json());

app.use("/api/todos", todoRoutes);

app.get("/api/error", () => {
  throw new Error("This is an unexpected error!");
});

app.get("/api/async-error", asyncHandler(async () => {
  await new Promise(resolve => setTimeout(resolve, 10));
  throw new Error("This is an async error!");
}));

// Apply error handling middleware last!
app.use(errorHandler);
