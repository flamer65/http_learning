import { describe, it, expect, beforeEach } from "bun:test";
import { TodoService } from "../src/services/todo.service";
import { InMemoryTodoRepository } from "../src/repositories/todo.repository";
import { SqliteTodoRepository } from "../src/repositories/sqlite.repository";
import { createDbConnection } from "../src/config/database";
import request from "supertest";
import { createApp } from "../src/app";

function runServiceTests(setupService: () => TodoService) {
  let service: TodoService;

  beforeEach(() => {
    service = setupService();
  });

  it("creates and retrieves a todo", async () => {
    const created = await service.createTodo({ title: "Test Swap" });
    const fetched = await service.getTodoById(created.id);
    expect(fetched).toEqual(created);
  });

  it("fails to create todo without a title", async () => {
    expect(service.createTodo({ title: "" })).rejects.toThrow("Title is required");
  });
}

describe("Service layer agnostic to database", () => {
  describe("With InMemoryTodoRepository", () => {
    runServiceTests(() => new TodoService(new InMemoryTodoRepository()));
  });

  describe("With SqliteTodoRepository", () => {
    let db: any;
    
    beforeEach(() => {
      db = createDbConnection(":memory:");
    });

    runServiceTests(() => new TodoService(new SqliteTodoRepository(db)));
  });
});

describe("Integration layer agnostic to database", () => {
  it("Run the SAME integration tests with SQLite backend -> all pass", async () => {
    const db = createDbConnection(":memory:");
    const repo = new SqliteTodoRepository(db);
    const app = createApp(repo);

    const res = await request(app).post("/api/todos").send({ title: "Integration Test" });
    expect(res.status).toBe(201);
    
    const id = res.body.id;

    const getRes = await request(app).get(`/api/todos/${id}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.title).toBe("Integration Test");
  });
});
