import { InMemoryTodoRepository } from "../repositories/todo.repository";
import { Todo } from "../models/todo.model";

export class TodoService {
  constructor(private repository: InMemoryTodoRepository) {}

  createTodo(data: { title?: string }): Todo {
    if (!data.title && data.title !== "") {
      throw new Error("Title is required");
    }
    
    if (data.title.trim() === "") {
      throw new Error("Title cannot be empty");
    }
    
    return this.repository.create({
      title: data.title,
      completed: false
    });
  }

  getTodos(filters?: { completed?: boolean }): Todo[] {
    let todos = this.repository.findAll();
    
    if (filters && filters.completed !== undefined) {
      todos = todos.filter(todo => todo.completed === filters.completed);
    }
    
    return todos;
  }

  getTodoById(id: number): Todo | null {
    return this.repository.findById(id);
  }

  completeTodo(id: number): Todo {
    const todo = this.repository.findById(id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    
    if (todo.completed) {
      throw new Error("Todo is already completed");
    }
    
    return this.repository.update(id, { completed: true })!;
  }

  deleteTodo(id: number): boolean {
    return this.repository.delete(id);
  }
}
