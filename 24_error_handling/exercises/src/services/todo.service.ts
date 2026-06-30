import { TodoRepository } from "../repositories/todo.repository";
import { NotFoundError, ValidationError } from "../utils/errors";

export class TodoService {
  constructor(private repo: TodoRepository) {}

  async getTodo(id: string) {
    const todo = await this.repo.getById(id);
    if (!todo) {
      throw new NotFoundError("Todo not found");
    }
    return todo;
  }

async createTodo(data: any) {
  if (data.title === undefined) {
    throw new ValidationError("Title is required");
  }
  if (typeof data.title !== "string") {
    throw new ValidationError("Title must be a string");
  }
  if (data.title.trim() === "") {
    throw new ValidationError("Title cannot be empty");
  }
  return this.repo.create(data);
}
}
