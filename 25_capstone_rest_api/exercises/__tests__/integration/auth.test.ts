import { describe, it, expect, beforeAll, afterAll, beforeEach } from "bun:test";
import request from "supertest";
import { app } from "../../src/app";
import { db } from "../../src/config/database";

describe("Auth Integration", () => {
  beforeAll(() => {
    // initialize schema
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        passwordHash TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });

  beforeEach(() => {
    db.exec("DELETE FROM users");
  });

  afterAll(() => {
    db.exec("DROP TABLE IF EXISTS users");
  });

  it("Register -> returns 201", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      password: "password123",
    });
    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user.username).toBe("testuser");
    expect(res.body.user).not.toHaveProperty("password");
  });

  it("Register with existing username -> 409 Conflict", async () => {
    await request(app).post("/api/auth/register").send({
      username: "testuser",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      password: "password123",
    });
    expect(res.status).toBe(409);
  });

  it("Login -> returns JWT", async () => {
    await request(app).post("/api/auth/register").send({
      username: "testuser",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/login").send({
      username: "testuser",
      password: "password123",
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("Login with wrong password -> 401", async () => {
    await request(app).post("/api/auth/register").send({
      username: "testuser",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/login").send({
      username: "testuser",
      password: "wrongpassword",
    });
    expect(res.status).toBe(401);
  });

  it("Access protected route without token -> 401", async () => {
    const res = await request(app).post("/api/books").send({
      title: "Test Book",
    });
    expect(res.status).toBe(401);
  });

  it("Access protected route with valid token -> works (or hits validation error)", async () => {
    const registerRes = await request(app).post("/api/auth/register").send({
      username: "testuser",
      password: "password123",
    });
    
    const loginRes = await request(app).post("/api/auth/login").send({
      username: "testuser",
      password: "password123",
    });
    const token = loginRes.body.token;

    // Just testing auth middleware, so it might fail validation but shouldn't be 401
    const res = await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .send({});
    expect(res.status).not.toBe(401);
  });
});
