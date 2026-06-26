import express from "express";
import { createTodoRouter } from "./routes/todo.routes";
import { ITodoRepository } from "./repositories/todo.repository";

export function createApp(repository: ITodoRepository) {
  const app = express();
  app.use(express.json());

  app.use("/api/todos", createTodoRouter(repository));

  return app;
}
