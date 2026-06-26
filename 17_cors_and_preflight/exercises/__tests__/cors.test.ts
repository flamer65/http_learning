import { describe, it, expect } from "bun:test";
import request from "supertest";
import { app } from "../src/app";

describe("CORS Implementation", () => {
  it("Test 1: Simple GET request with Origin header gets Access-Control-Allow-Origin back", async () => {
    const res = await request(app)
      .get("/api/data")
      .set("Origin", "http://localhost:3000");
    
    expect(res.status).toBe(200);
    expect(res.headers["access-control-allow-origin"]).toBe("http://localhost:3000");
  });

  it("Test 2: OPTIONS preflight with Access-Control-Request-Method: PUT returns 204 with methods and headers allowed", async () => {
    const res = await request(app)
      .options("/api/data")
      .set("Origin", "https://myapp.com")
      .set("Access-Control-Request-Method", "PUT");
      
    expect(res.status).toBe(204);
    expect(res.headers["access-control-allow-methods"]).toContain("PUT");
  });

  it("Test 3: Request from unlisted origin gets NO Access-Control-Allow-Origin header", async () => {
    const res = await request(app)
      .get("/api/data")
      .set("Origin", "http://evil-hacker.com");
      
    expect(res.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("Test 4: Dynamic origin — allowed origins echo the matching origin", async () => {
    const res1 = await request(app).get("/api/data").set("Origin", "http://localhost:3000");
    expect(res1.headers["access-control-allow-origin"]).toBe("http://localhost:3000");
    
    const res2 = await request(app).get("/api/data").set("Origin", "https://myapp.com");
    expect(res2.headers["access-control-allow-origin"]).toBe("https://myapp.com");
  });

  it("Test 5: Preflight with Access-Control-Request-Headers → Access-Control-Allow-Headers includes both", async () => {
    const res = await request(app)
      .options("/api/data")
      .set("Origin", "http://localhost:3000")
      .set("Access-Control-Request-Headers", "Authorization, X-Custom-Header")
      .set("Access-Control-Request-Method", "GET");
      
    expect(res.status).toBe(204);
    const allowedHeaders = res.headers["access-control-allow-headers"].toLowerCase();
    expect(allowedHeaders).toContain("authorization");
    expect(allowedHeaders).toContain("x-custom-header");
  });

  it("Test 6: Response includes Access-Control-Expose-Headers", async () => {
    const res = await request(app)
      .get("/api/data")
      .set("Origin", "http://localhost:3000");
      
    const exposed = res.headers["access-control-expose-headers"].toLowerCase();
    expect(exposed).toContain("x-request-id");
    expect(exposed).toContain("x-total-count");
  });

  it("Test 7: Preflight includes Access-Control-Max-Age: 86400", async () => {
    const res = await request(app)
      .options("/api/data")
      .set("Origin", "http://localhost:3000")
      .set("Access-Control-Request-Method", "GET");
      
    expect(res.headers["access-control-max-age"]).toBe("86400");
  });

  it("Test 8: Request with credentials → Access-Control-Allow-Credentials: true + specific origin", async () => {
    const res = await request(app)
      .get("/api/data")
      .set("Origin", "http://localhost:3000");
      
    expect(res.headers["access-control-allow-credentials"]).toBe("true");
    expect(res.headers["access-control-allow-origin"]).toBe("http://localhost:3000");
  });

  it("Test 9: Response includes Vary: Origin header", async () => {
    const res = await request(app)
      .get("/api/data")
      .set("Origin", "http://localhost:3000");
      
    const vary = res.headers["vary"]?.toLowerCase() || "";
    expect(vary).toContain("origin");
  });

  it("Test 10: Actual GET/POST/PUT/DELETE requests after preflight work correctly", async () => {
    const putRes = await request(app)
      .put("/api/data")
      .set("Origin", "https://myapp.com")
      .send({ updated: true });
      
    expect(putRes.status).toBe(200);
    expect(putRes.body).toEqual({ success: true, method: "PUT" });
  });
});
