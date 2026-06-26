import { describe, it, expect } from "bun:test";
import request from "supertest";
import { app } from "../src/app-with-helmet";

describe("Helmet Security", () => {
  it("should still have core security headers via helmet", async () => {
    const res = await request(app).get("/api/ping");
    expect(res.headers["strict-transport-security"]).toBeDefined();
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
    expect(res.headers["x-frame-options"]).toBeDefined(); // Helmet sets this
    expect(res.headers["content-security-policy"]).toBeDefined();
    expect(res.headers["x-powered-by"]).toBeUndefined();
  });

  it("Helmet sets additional headers like X-Download-Options", async () => {
    const res = await request(app).get("/api/ping");
    expect(res.headers["x-download-options"]).toBe("noopen");
    expect(res.headers["x-dns-prefetch-control"]).toBe("off");
  });
});