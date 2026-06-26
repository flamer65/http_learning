import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import request from "supertest";
import { app } from "../src/app";

describe("Express Basics", () => {
  // ─── Test 1: GET / → 200 + greeting message ──────────────────
  describe("GET /", () => {
    it('should return 200 with { message: "Hello from Express" }', async () => {
      const res = await request(app).get("/");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "Hello from Express" });
    });

    it("should return Content-Type application/json", async () => {
      const res = await request(app).get("/");

      expect(res.headers["content-type"]).toContain("application/json");
    });
  });

  // ─── Test 2: GET /health → 200 + status and uptime ───────────
  describe("GET /health", () => {
    it('should return 200 with status "ok"', async () => {
      const res = await request(app).get("/health");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
    });

    it("should include an uptime field that is a number", async () => {
      const res = await request(app).get("/health");

      expect(res.body).toHaveProperty("uptime");
      expect(typeof res.body.uptime).toBe("number");
      expect(res.body.uptime).toBeGreaterThanOrEqual(0);
    });

    it("should return Content-Type application/json", async () => {
      const res = await request(app).get("/health");

      expect(res.headers["content-type"]).toContain("application/json");
    });
  });

  // ─── Test 3: GET /nonexistent-route → 404 ────────────────────
  describe("GET /nonexistent-route", () => {
    it("should return 404 for unknown routes", async () => {
      const res = await request(app).get("/nonexistent-route");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Not Found" });
    });

    it("should return 404 for any random path", async () => {
      const res = await request(app).get("/foo/bar/baz");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Not Found" });
    });

    it("should return Content-Type application/json for 404s", async () => {
      const res = await request(app).get("/does-not-exist");

      expect(res.headers["content-type"]).toContain("application/json");
    });
  });

  // ─── Test 4: Content-Type is application/json for ALL routes ──
  describe("Content-Type consistency", () => {
    it("should return application/json for GET /", async () => {
      const res = await request(app).get("/");
      expect(res.headers["content-type"]).toContain("application/json");
    });

    it("should return application/json for GET /health", async () => {
      const res = await request(app).get("/health");
      expect(res.headers["content-type"]).toContain("application/json");
    });

    it("should return application/json for 404 responses", async () => {
      const res = await request(app).get("/nope");
      expect(res.headers["content-type"]).toContain("application/json");
    });
  });
});
