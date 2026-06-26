import { describe, it, expect } from "bun:test";
import request from "supertest";
import { app } from "../../src/app";

describe("Security Integration", () => {
  it("All responses have security headers", async () => {
    const res = await request(app).get("/api/books");
    
    // Check helmet headers
    expect(res.headers["x-frame-options"]).toBeDefined();
    expect(res.headers["strict-transport-security"]).toBeDefined();
  });

  it("No X-Powered-By header", async () => {
    const res = await request(app).get("/api/books");
    
    expect(res.headers["x-powered-by"]).toBeUndefined();
  });
});
