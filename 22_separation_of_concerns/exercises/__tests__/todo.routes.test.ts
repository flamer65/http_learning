import { describe, it, expect } from "bun:test";
import request from "supertest";
import { app } from "../src/app";

describe("Todo API Routes (Integration)", () => {
  let createdTodoId: number;

  it("GET /api/todos -> 200 + array", async () => {
    const res = await request(app).get("/api/todos");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/todos with valid data -> 201 + created todo", async () => {
    const res = await request(app)
      .post("/api/todos")
      .send({ title: "Learn TDD" });
      
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Learn TDD");
    expect(res.body.completed).toBe(false);
    expect(res.body.id).toBeDefined();
    createdTodoId = res.body.id;
  });

  it("POST /api/todos with empty data -> 400 + error message", async () => {
    const res = await request(app).post("/api/todos").send({});
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Title is required" });
  });

  it("GET /api/todos/:id -> 200 + todo", async () => {
    const res = await request(app).get(`/api/todos/${createdTodoId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdTodoId);
  });

  it("GET /api/todos/999 -> 404", async () => {
    const res = await request(app).get("/api/todos/999");
    expect(res.status).toBe(404);
  });

  it("PATCH /api/todos/:id/complete -> 200 + completed todo", async () => {
    const res = await request(app).patch(`/api/todos/${createdTodoId}/complete`);
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  it("DELETE /api/todos/:id -> 204", async () => {
    const res = await request(app).delete(`/api/todos/${createdTodoId}`);
    expect(res.status).toBe(204);
    
    // Verify it's gone
    const getRes = await request(app).get(`/api/todos/${createdTodoId}`);
    expect(getRes.status).toBe(404);
  });
});