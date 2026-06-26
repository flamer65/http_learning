import { describe, it, expect, beforeEach } from "bun:test";
import { InMemoryTodoRepository } from "../src/repositories/todo.repository";

describe("TodoRepository (Data Layer)", () => {
  let repository: InMemoryTodoRepository;

  beforeEach(() => {
    repository = new InMemoryTodoRepository();
  });

  it("should create a todo and return it with a generated id", () => {
    const todo = repository.create({ title: "Test Repo", completed: false });
    expect(todo.id).toBeDefined();
    expect(todo.title).toBe("Test Repo");
    expect(todo.completed).toBe(false);
  });

  it("should return all todos", () => {
    repository.create({ title: "Task 1", completed: false });
    repository.create({ title: "Task 2", completed: true });
    
    const todos = repository.findAll();
    expect(todos.length).toBe(2);
  });

  it("should find a todo by id", () => {
    const created = repository.create({ title: "Find Me", completed: false });
    const found = repository.findById(created.id);
    expect(found).toEqual(created);
  });

  it("should return null if todo not found", () => {
    const found = repository.findById(999);
    expect(found).toBeNull();
  });

  it("should update a todo", () => {
    const created = repository.create({ title: "Update Me", completed: false });
    const updated = repository.update(created.id, { completed: true });
    
    expect(updated?.completed).toBe(true);
    expect(repository.findById(created.id)?.completed).toBe(true);
  });

  it("should delete a todo", () => {
    const created = repository.create({ title: "Delete Me", completed: false });
    const result = repository.delete(created.id);
    
    expect(result).toBe(true);
    expect(repository.findById(created.id)).toBeNull();
  });

  it("should return false when deleting non-existent todo", () => {
    const result = repository.delete(999);
    expect(result).toBe(false);
  });
});