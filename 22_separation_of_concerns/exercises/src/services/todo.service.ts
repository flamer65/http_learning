import { InMemoryTodoRepository } from "../repositories/todo.repository";
import { Todo } from "../models/todo.model";

export class TodoService {
  constructor(private repository: InMemoryTodoRepository) {}

  createTodo(data: { title?: string }): Todo {
    // TODO: Validate input
    // If no title, throw new Error("Title is required")
    // If title is empty/whitespace, throw new Error("Title cannot be empty")
    if (!data.title && data.title !== ""){
      throw new Error("Title is required")
    }
    if (data.title.trim() === ""){
      throw new Error("Title cannot be empty")
    }
    // TODO: Create and return todo with completed=false via repository
    return this.repository.create({
      title: data.title,
      completed: false
    });
  }

  getTodos(filters?: { completed?: boolean }): Todo[] {
    // TODO: Get all todos from repository
    let todos =  this.repository.findAll();
    if (filters && filters.completed !== undefined) {
      todos = todos.filter(todo => todo.completed === filters.completed);
    }
    return todos;
    // If filters.completed is specified, filter the results before returning
  }

  getTodoById(id: number): Todo | null {
    // TODO: Return todo by id from repository
    return this.repository.findById(id);
  }

  completeTodo(id: number): Todo {
    // TODO: Find todo. If not found, throw new Error("Todo not found")
    // TODO: If already completed, throw new Error("Todo is already completed")
    // TODO: Update via repository to completed=true and return it
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
    // TODO: Delete via repository and return boolean
    const todo = this.repository.findById(id);
    if (todo) {
      return this.repository.delete(id);
    }
    
    return false;
  }
}
