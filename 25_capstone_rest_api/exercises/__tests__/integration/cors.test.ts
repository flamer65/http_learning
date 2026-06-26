import { describe, it, expect } from "bun:test";
import request from "supertest";
import { app } from "../../src/app";

describe("CORS Integration", () => {
  it("GET with Origin header -> has CORS headers", async () => {
    const res = await request(app)
      .get("/api/books")
      .set("Origin", "http://localhost:3000"); // assuming you allow this or all
    
    expect(res.headers["access-control-allow-origin"]).toBeDefined();
  });

  it("OPTIONS preflight -> 204 with all Access-Control headers", async () => {
    const res = await request(app)
      .options("/api/books")
      .set("Origin", "http://localhost:3000")
      .set("Access-Control-Request-Method", "POST");
    
    expect(res.status).toBe(204);
    expect(res.headers["access-control-allow-methods"]).toBeDefined();
    expect(res.headers["access-control-allow-headers"]).toBeDefined();
  });
});
