import { describe, it, expect, spyOn } from "bun:test";
import request from "supertest";
import { app } from "../src/app";

// Suppress console.error during tests so output is clean
spyOn(console, "error").mockImplementation(() => {});

describe("Error Handling", () => {
  it('GET /api/todos/999 -> 404 { error: "Todo not found", code: "NOT_FOUND" }', async () => {
    const res = await request(app).get("/api/todos/999");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Todo not found", code: "NOT_FOUND" });
  });

  it('POST /api/todos with {} -> 400 { error: "Title is required", code: "VALIDATION_ERROR" }', async () => {
    const res = await request(app).post("/api/todos").send({});
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Title is required", code: "VALIDATION_ERROR" });
  });

  it('POST /api/todos with { title: "" } -> 400 { error: "Title cannot be empty", code: "VALIDATION_ERROR" }', async () => {
    const res = await request(app).post("/api/todos").send({ title: "" });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Title cannot be empty", code: "VALIDATION_ERROR" });
  });

  it('POST /api/todos with { title: 123 } -> 400 { error: "Title must be a string", code: "VALIDATION_ERROR" }', async () => {
    const res = await request(app).post("/api/todos").send({ title: 123 });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Title must be a string", code: "VALIDATION_ERROR" });
  });

  it('GET /api/error -> 500 { error: "Internal server error", code: "INTERNAL_ERROR" }', async () => {
    const res = await request(app).get("/api/error");
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Internal server error", code: "INTERNAL_ERROR" });
    // NO stack trace in response
    expect(res.body.stack).toBeUndefined();
  });

  it('GET /api/async-error -> properly caught by asyncHandler and errorHandler', async () => {
    const res = await request(app).get("/api/async-error");
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Internal server error", code: "INTERNAL_ERROR" });
  });

  it('All error responses have consistent shape: { error: string, code: string }', async () => {
    const res = await request(app).get("/api/todos/999");
    expect(res.body).toHaveProperty("error");
    expect(res.body).toHaveProperty("code");
    expect(Object.keys(res.body).length).toBe(2);
  });

  it('Error handler logs the full error to console', async () => {
    await request(app).get("/api/error");
    expect(console.error).toHaveBeenCalled();
  });
});
