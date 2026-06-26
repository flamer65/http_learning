import { describe, it, expect, beforeEach } from "bun:test";
import { TodoService } from "../src/services/todo.service";
import { InMemoryTodoRepository } from "../src/repositories/todo.repository";

describe("TodoService (Business Logic Layer)", () => {
  let service: TodoService;

  beforeEach(() => {
    const repository = new InMemoryTodoRepository();
    service = new TodoService(repository);
  });

  it("should create a todo with completed=false by default", () => {
    const todo = service.createTodo({ title: "Buy Milk" });
    expect(todo.title).toBe("Buy Milk");
    expect(todo.completed).toBe(false);
  });

  it("should throw error 'Title is required' if missing title", () => {
    expect(() => service.createTodo({} as any)).toThrow("Title is required");
  });

  it("should throw error 'Title cannot be empty' if empty title", () => {
    expect(() => service.createTodo({ title: "   " })).toThrow("Title cannot be empty");
  });

  it("should mark an uncompleted todo as completed", () => {
    const created = service.createTodo({ title: "Task to complete" });
    const completed = service.completeTodo(created.id);
    expect(completed.completed).toBe(true);
  });

  it("should throw error 'Todo is already completed' if already complete", () => {
    const created = service.createTodo({ title: "Task" });
    service.completeTodo(created.id);
    
    expect(() => service.completeTodo(created.id)).toThrow("Todo is already completed");
  });

  it("should return only completed todos if requested", () => {
    service.createTodo({ title: "Task 1" });
    const task2 = service.createTodo({ title: "Task 2" });
    service.completeTodo(task2.id);

    const completedTodos = service.getTodos({ completed: true });
    expect(completedTodos.length).toBe(1);
    expect(completedTodos[0].id).toBe(task2.id);
  });
});