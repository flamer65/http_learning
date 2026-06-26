import { describe, it, expect, beforeAll, afterAll, beforeEach } from "bun:test";
import { Database as DBType } from "better-sqlite3";
import { createDbConnection } from "../src/config/database";
import { SqliteTodoRepository } from "../src/repositories/sqlite.repository";

describe("SqliteTodoRepository", () => {
  let db: DBType;
  let repo: SqliteTodoRepository;

  beforeAll(() => {
    db = createDbConnection(":memory:");
    repo = new SqliteTodoRepository(db);
  });

  afterAll(() => {
    db.close();
  });

  beforeEach(() => {
    db.exec("DELETE FROM todos");
  });

  it("Migration runs automatically: creates todos table if not exists", () => {
    const tableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='todos'").get();
    expect(tableExists).toBeTruthy();
  });

  it("create({ title, completed }) -> inserts into SQLite, returns todo with id", async () => {
    const todo = await repo.create({ title: "Test SQLite", completed: true });
    expect(todo).toHaveProperty("id");
    expect(todo.title).toBe("Test SQLite");
    expect(todo.completed).toBe(true);

    const row = db.prepare("SELECT * FROM todos WHERE id = ?").get(todo.id) as any;
    expect(row).toBeDefined();
    expect(row.title).toBe("Test SQLite");
    expect(row.completed).toBe(1);
  });

  it("findAll() -> returns all todos from SQLite", async () => {
    await repo.create({ title: "Task 1", completed: false });
    await repo.create({ title: "Task 2", completed: true });

    const todos = await repo.findAll();
    expect(todos.length).toBe(2);
    expect(todos[0].title).toBe("Task 1");
    expect(todos[0].completed).toBe(false);
    expect(todos[1].title).toBe("Task 2");
    expect(todos[1].completed).toBe(true);
  });

  it("findById(id) -> returns todo or null from SQLite", async () => {
    const todo = await repo.create({ title: "Find me" });
    
    const found = await repo.findById(todo.id);
    expect(found).toEqual(todo);

    const missing = await repo.findById("non-existent");
    expect(missing).toBeNull();
  });

  it("update(id, data) -> updates row in SQLite", async () => {
    const todo = await repo.create({ title: "Old Title", completed: false });
    
    const updated = await repo.update(todo.id, { title: "New Title", completed: true });
    expect(updated?.title).toBe("New Title");
    expect(updated?.completed).toBe(true);

    const row = db.prepare("SELECT * FROM todos WHERE id = ?").get(todo.id) as any;
    expect(row.title).toBe("New Title");
    expect(row.completed).toBe(1);
  });

  it("delete(id) -> deletes row from SQLite, returns true/false", async () => {
    const todo = await repo.create({ title: "To delete" });
    
    const success = await repo.delete(todo.id);
    expect(success).toBe(true);

    const missing = await repo.findById(todo.id);
    expect(missing).toBeNull();

    const fail = await repo.delete("non-existent");
    expect(fail).toBe(false);
  });

  it("Data persists across repository instances (same db file)", async () => {
    const repo1 = new SqliteTodoRepository(db);
    const todo = await repo1.create({ title: "Shared Data" });

    const repo2 = new SqliteTodoRepository(db);
    const found = await repo2.findById(todo.id);
    expect(found).toEqual(todo);
  });
});
