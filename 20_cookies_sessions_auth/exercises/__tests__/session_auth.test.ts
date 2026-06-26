import { describe, it, expect } from "bun:test";
import request from "supertest";
import { app } from "../src/app";

describe("Session Authentication", () => {
  let cookie: string;

  it("1. POST /auth/register -> 201 + user created", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ username: "naman", password: "secret123" });
    expect(res.status).toBe(201);
    expect(res.body.username).toBe("naman");
    expect(res.body.password).toBeUndefined();
  });

  it("2. POST /auth/login with correct credentials -> 200 + session cookie", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "naman", password: "secret123" });
    expect(res.status).toBe(200);
    const setCookie = res.headers["set-cookie"];
    expect(setCookie).toBeDefined();
    cookie = setCookie[0];
  });

  it("3. GET /auth/profile without session cookie -> 401", async () => {
    const res = await request(app).get("/auth/profile");
    expect(res.status).toBe(401);
  });

  it("4. GET /auth/profile with valid session cookie -> 200 + profile", async () => {
    const res = await request(app)
      .get("/auth/profile")
      .set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(res.body.username).toBe("naman");
  });

  it("5. POST /auth/logout -> session destroyed, cookie cleared", async () => {
    const res = await request(app)
      .post("/auth/logout")
      .set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("6. POST /auth/login with wrong password -> 401", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "naman", password: "wrong" });
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Invalid credentials" });
  });
});