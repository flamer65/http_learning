import { describe, it, expect } from "bun:test";
import request from "supertest";
import { app } from "../src/app";

describe("JWT Authentication", () => {
  let token: string;

  it("1. POST /jwt/register -> 201", async () => {
    const res = await request(app)
      .post("/jwt/register")
      .send({ username: "john", password: "password" });
    expect(res.status).toBe(201);
  });

  it("2. POST /jwt/login -> 200 + token", async () => {
    const res = await request(app)
      .post("/jwt/login")
      .send({ username: "john", password: "password" });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
    console.log(token);
  });

  it("3. GET /jwt/profile without token -> 401", async () => {
    const res = await request(app).get("/jwt/profile");
    expect(res.status).toBe(401);
  });

  it("4. GET /jwt/profile with valid JWT -> 200", async () => {
    const res = await request(app)
      .get("/jwt/profile")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.username).toBe("john");
  });

  it("5. GET /jwt/profile with invalid JWT -> 401", async () => {
    const res = await request(app)
      .get("/jwt/profile")
      .set("Authorization", "Bearer invalid.token.here");
    expect(res.status).toBe(401);
  });

  it("6. Verify separation of methods", async () => {
    const res = await request(app)
      .post("/jwt/login")
      .send({ username: "john", password: "password" });
    expect(res.headers["set-cookie"]).toBeUndefined(); 
    expect(res.body.token).toBeDefined();
  });
});