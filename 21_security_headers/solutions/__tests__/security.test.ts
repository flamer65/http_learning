import { describe, it, expect } from "bun:test";
import request from "supertest";
import { app } from "../src/app";
import { requestCounts } from "../src/middleware/rateLimit";
import { beforeEach } from "bun:test";

describe("Security Headers & Protections", () => {
  beforeEach(() => {
    requestCounts.clear();
  });
  it("should have Strict-Transport-Security header", async () => {
    const res = await request(app).get("/api/ping");
    expect(res.headers["strict-transport-security"]).toBe("max-age=31536000; includeSubDomains");
  });

  it("should have X-Content-Type-Options header", async () => {
    const res = await request(app).get("/api/ping");
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
  });

  it("should have X-Frame-Options header", async () => {
    const res = await request(app).get("/api/ping");
    expect(res.headers["x-frame-options"]).toBe("DENY");
  });

  it("should have Content-Security-Policy header", async () => {
    const res = await request(app).get("/api/ping");
    expect(res.headers["content-security-policy"]).toBe("default-src 'self'");
  });

  it("should have Referrer-Policy header", async () => {
    const res = await request(app).get("/api/ping");
    expect(res.headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  });

  it("should have Permissions-Policy header", async () => {
    const res = await request(app).get("/api/ping");
    expect(res.headers["permissions-policy"]).toBe("camera=(), microphone=(), geolocation=(self)");
  });

  it("should NOT have X-Powered-By header", async () => {
    const res = await request(app).get("/api/ping");
    expect(res.headers["x-powered-by"]).toBeUndefined();
  });

  it("should enforce rate limiting", async () => {
    // Send 3 allowed requests
    for (let i = 0; i < 3; i++) {
      const res = await request(app).get("/api/ping");
      expect(res.status).toBe(200);
    }
    // The 4th and 5th should fail
    for (let i = 0; i < 2; i++) {
      const res = await request(app).get("/api/ping");
      expect(res.status).toBe(429);
      expect(res.body).toEqual({ error: "Too many requests" });
    }
  });

  it("should validate and reject XSS input", async () => {
    const res = await request(app)
      .post("/api/data")
      .send({ name: "<script>alert('xss')</script>" });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid input" });
  });

  it("should validate and reject SQL injection input", async () => {
    const res = await request(app)
      .post("/api/search")
      .send({ query: "'; DROP TABLE users; --" });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid input" });
  });
});