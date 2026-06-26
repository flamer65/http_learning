import { Request, Response } from "express";
import { TodoService } from "../services/todo.service";

export class TodoController {
  constructor(private todoService: TodoService) {}

  // We use arrow functions so `this` is bound correctly when used in routes
  getAll = (req: Request, res: Response) => {
    // TODO: Extract query params (if any), call service, send 200 JSON
    const filters: { completed?: boolean } = {};
    if (req.query.completed !== undefined) {
      filters.completed = req.query.completed === "true";
    }
    
    const todos = this.todoService.getTodos(filters);
    res.status(200).json(todos);
    // res.status(200).json([]); --- IGNORE ---
    //
  };

  create = (req: Request, res: Response) => {
    try {
      // TODO: Extract req.body, call service createTodo, send 201 JSON
      const todo = this.todoService.createTodo(req.body);
      res.status(201).json(todo);
    } catch (error: any) {
      // TODO: Handle validation errors with 400
      res.status(400).json({ error: error.message });
    }
  };

  getById = (req: Request, res: Response) => {
    // TODO: Extract req.params.id, call service
    // If found, 200. If not, 404.
    const id = parseInt(req.params.id as string, 10);
    const todo = this.todoService.getTodoById(id);

    if (!todo) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }
    
    res.status(200).json(todo);
  };

  complete = (req: Request, res: Response) => {
    try {
      // TODO: call service completeTodo, send 200
      const id = parseInt(req.params.id as string, 10);
      const todo = this.todoService.completeTodo(id);
      res.status(200).json(todo);
    } catch (error: any) {
      // Handle error
      if (error.message === "Todo not found") {
        res.status(404).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  delete = (req: Request, res: Response) => {
    // TODO: call service deleteTodo. If true send 204. If false send 404.
    const id = parseInt(req.params.id as string, 10);
    const success = this.todoService.deleteTodo(id);
    if (!success) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }

    res.status(204).send();
  };
}
