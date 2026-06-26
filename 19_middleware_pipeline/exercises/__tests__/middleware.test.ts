import { describe, it, expect, spyOn } from "bun:test";
import request from "supertest";
import { app, middlewareOrderArray } from "../src/app";

describe("Middleware Pipeline", () => {
  it("1. Logger middleware: should capture log", async () => {
    const logSpy = spyOn(console, "log").mockImplementation(() => {});
    await request(app).get("/public/info");
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it("2. JSON parser: should parse JSON body", async () => {
    const res = await request(app)
      .post("/echo")
      .send({ hello: "world" })
      .set("Content-Type", "application/json");
    
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ hello: "world" });
  });

  it("3. Auth middleware: No header -> 401", async () => {
    const res = await request(app).get("/admin/dashboard");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "No authorization header" });
  });

  it("4. Auth middleware: Valid token -> 200", async () => {
    const res = await request(app)
      .get("/admin/dashboard")
      .set("Authorization", "Bearer valid-token");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Admin dashboard data" });
  });

  it("5. Auth middleware: Invalid token -> 401", async () => {
    const res = await request(app)
      .get("/admin/dashboard")
      .set("Authorization", "Bearer invalid-token");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Invalid token" });
  });

  it("6. Request ID middleware: Response has X-Request-Id header", async () => {
    const res = await request(app).get("/public/info");
    expect(res.headers["x-request-id"]).toBeDefined();
    expect(typeof res.headers["x-request-id"]).toBe("string");
  });

  it("7. Response time middleware: Response has X-Response-Time header", async () => {
    const res = await request(app).get("/public/info");
    expect(res.headers["x-response-time"]).toBeDefined();
    expect(res.headers["x-response-time"]).toMatch(/^[0-9.]+ms$/);
  });

  it("8. Middleware order: execution array should be ['first', 'second', 'third']", async () => {
    middlewareOrderArray.length = 0;
    await request(app).get("/order-test");
    expect(middlewareOrderArray).toEqual(["first", "second", "third"]);
  });

  it("9. Route-level middleware: public route needs no auth", async () => {
    const res = await request(app).get("/public/info");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ info: "Public information" });
  });

  it("10. Error middleware: catches thrown errors and returns 500", async () => {
    const errSpy = spyOn(console, "error").mockImplementation(() => {});
    const res = await request(app).get("/error-route");
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Something went wrong" });
    errSpy.mockRestore();
  });
});