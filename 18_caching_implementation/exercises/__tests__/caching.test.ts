import { describe, it, expect } from "bun:test";
import request from "supertest";
import { app } from "../src/app";

describe("Caching Implementation", () => {
  it("Test 1: GET /static/app.js → Cache-Control: public, max-age=31536000, immutable", async () => {
    const res = await request(app).get("/static/app.js");
    expect(res.status).toBe(200);
    expect(res.headers["cache-control"]).toContain("public");
    expect(res.headers["cache-control"]).toContain("max-age=31536000");
    expect(res.headers["cache-control"]).toContain("immutable");
  });

  it("Test 2: GET / (HTML page) → Cache-Control: no-cache", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.headers["cache-control"]).toBe("no-cache");
  });

  it("Test 3: GET /api/me/dashboard → Cache-Control: private, no-cache", async () => {
    const res = await request(app).get("/api/me/dashboard");
    expect(res.status).toBe(200);
    expect(res.headers["cache-control"]).toContain("private");
    expect(res.headers["cache-control"]).toContain("no-cache");
  });

  it("Test 4: GET /api/me/bank-balance → Cache-Control: no-store", async () => {
    const res = await request(app).get("/api/me/bank-balance");
    expect(res.status).toBe(200);
    expect(res.headers["cache-control"]).toBe("no-store");
  });

  it("Test 5: GET /api/products → Cache-Control: public, max-age=300, stale-while-revalidate=60", async () => {
    const res = await request(app).get("/api/products");
    expect(res.status).toBe(200);
    expect(res.headers["cache-control"]).toContain("public");
    expect(res.headers["cache-control"]).toContain("max-age=300");
    expect(res.headers["cache-control"]).toContain("stale-while-revalidate=60");
  });

  it("Test 6: GET /api/products → response includes ETag header", async () => {
    const res = await request(app).get("/api/products");
    expect(res.headers["etag"]).toBeDefined();
  });

  it("Test 7: GET /api/products with If-None-Match matching ETag → 304 Not Modified, no body", async () => {
    const res1 = await request(app).get("/api/products");
    const etag = res1.headers["etag"];
    
    const res2 = await request(app).get("/api/products").set("If-None-Match", etag);
    expect(res2.status).toBe(304);
    expect(res2.text).toBeFalsy();
  });

  it("Test 8: GET /api/products with If-None-Match NOT matching → 200 + full body + new ETag", async () => {
    const res = await request(app).get("/api/products").set("If-None-Match", '"invalid-etag"');
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.headers["etag"]).toBeDefined();
  });

  it("Test 9: GET /api/articles/1 → response includes Last-Modified header", async () => {
    const res = await request(app).get("/api/articles/1");
    expect(res.headers["last-modified"]).toBeDefined();
  });

  it("Test 10: GET /api/articles/1 with If-Modified-Since (future date) → 304", async () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    
    const res = await request(app)
      .get("/api/articles/1")
      .set("If-Modified-Since", futureDate.toUTCString());
      
    expect(res.status).toBe(304);
  });

  it("Test 11: GET /api/articles/1 with If-Modified-Since (old date) → 200 + full body", async () => {
    const oldDate = new Date("2000-01-01").toUTCString();
    
    const res = await request(app)
      .get("/api/articles/1")
      .set("If-Modified-Since", oldDate);
      
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
  });

  it("Test 12: GET /api/products → Vary: Accept-Encoding header present", async () => {
    const res = await request(app).get("/api/products");
    expect(res.headers["vary"]).toBe("Accept-Encoding");
  });

  it("Test 13: GET /api/products → includes both s-maxage=3600 and max-age=300", async () => {
    const res = await request(app).get("/api/products");
    expect(res.headers["cache-control"]).toContain("s-maxage=3600");
  });
});
