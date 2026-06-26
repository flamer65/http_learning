import { describe, it, expect, beforeEach } from "bun:test";
import request from "supertest";
import { app } from "../src/app";
import { resetUsers } from "../src/data/users";

describe("Routing & Params", () => {
  beforeEach(() => {
    resetUsers(); // Ensure clean state before each test
  });

  it("1. GET /api/users → 200 + array of users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("2. GET /api/users/1 → 200 + user with id 1", async () => {
    const res = await request(app).get("/api/users/1");
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.name).toBe("Alice");
  });

  it("3. GET /api/users/999 → 404 + { error: 'User not found' }", async () => {
    const res = await request(app).get("/api/users/999");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "User not found" });
  });

  it("4. GET /api/users?role=admin → 200 + only users with role admin", async () => {
    const res = await request(app).get("/api/users?role=admin");
    expect(res.status).toBe(200);
    expect(res.body.every((u: any) => u.role === "admin")).toBe(true);
  });

  it("5. GET /api/users?sort=name → 200 + users sorted by name", async () => {
    const res = await request(app).get("/api/users?sort=name");
    expect(res.status).toBe(200);
    const names = res.body.map((u: any) => u.name);
    const sortedNames = [...names].sort();
    expect(names).toEqual(sortedNames);
  });

  it("6. POST /api/users with body → 201 + created user with id", async () => {
    const res = await request(app).post("/api/users").send({ name: "New User", email: "new@test.com", role: "user" });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe("New User");
  });

  it("7. PUT /api/users/1 with full body → 200 + completely replaced user", async () => {
    const res = await request(app).put("/api/users/1").send({ name: "Alice Replaced", email: "alice-rep@test.com", role: "user" });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Alice Replaced");
    expect(res.body.role).toBe("user");
  });

  it("8. PATCH /api/users/1 with { role: 'admin' } → 200 + user with only role updated", async () => {
    const res = await request(app).patch("/api/users/1").send({ role: "superadmin" });
    expect(res.status).toBe(200);
    expect(res.body.role).toBe("superadmin");
    expect(res.body.name).toBe("Alice"); // Preserved
  });

  it("9. DELETE /api/users/1 → 204 no content", async () => {
    const res = await request(app).delete("/api/users/1");
    expect(res.status).toBe(204);
    
    // verify
    const verify = await request(app).get("/api/users/1");
    expect(verify.status).toBe(404);
  });

  it("10. DELETE /api/users/999 → 404", async () => {
    const res = await request(app).delete("/api/users/999");
    expect(res.status).toBe(404);
  });

  it("11. POST /api/users called twice with same data → creates two different users (NOT idempotent)", async () => {
    const data = { name: "Clone", email: "clone@test.com", role: "user" };
    const res1 = await request(app).post("/api/users").send(data);
    const res2 = await request(app).post("/api/users").send(data);
    expect(res1.status).toBe(201);
    expect(res2.status).toBe(201);
    expect(res1.body.id).not.toBe(res2.body.id);
  });

  it("12. HEAD /api/users/1 → 200 with Content-Type and Content-Length headers but no body", async () => {
    const res = await request(app).head("/api/users/1");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.headers["content-length"]).toBeDefined();
    if (res.text) {
      expect(res.text).toBe("");
    }
  });
});
