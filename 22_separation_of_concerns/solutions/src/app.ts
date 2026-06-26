import express from "express";
import todoRoutes from "./routes/todo.routes";

const app = express();

app.use(express.json());

// Mount the router
app.use("/api/todos", todoRoutes);

export { app };
