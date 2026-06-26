import { describe, it, expect } from "bun:test";
import request from "supertest";
import { app } from "../src/app";

describe("Request & Response Deep Dive", () => {
  it("1. Content negotiation: GET /api/data with Accept headers", async () => {
    const jsonRes = await request(app).get("/api/data").set("Accept", "application/json");
    expect(jsonRes.status).toBe(200);
    expect(jsonRes.type).toMatch(/json/);
    expect(jsonRes.body).toEqual({ message: "Hello World" });

    const textRes = await request(app).get("/api/data").set("Accept", "text/plain");
    expect(textRes.status).toBe(200);
    expect(textRes.type).toMatch(/plain/);
    expect(textRes.text).toBe("Hello World");
  });

  it("2. POST /api/data with JSON body → correctly parsed in req.body", async () => {
    const res = await request(app)
      .post("/api/data")
      .set("Content-Type", "application/json")
      .send({ test: "json" });
    expect(res.status).toBe(200);
    expect(res.body.received).toEqual({ test: "json" });
  });

  it("3. POST /api/form with application/x-www-form-urlencoded body", async () => {
    const res = await request(app)
      .post("/api/form")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send("field1=value1&field2=value2");
    expect(res.status).toBe(200);
    expect(res.body.received).toEqual({ field1: "value1", field2: "value2" });
  });

  it("4. Response has custom headers: GET /api/info", async () => {
    const res = await request(app).get("/api/info");
    expect(res.status).toBe(200);
    expect(res.headers["x-request-id"]).toBeDefined();
    expect(res.headers["x-powered-by"]).toBe("Express Learning");
  });

  it("5. GET /api/status/:code → parametric status codes", async () => {
    expect((await request(app).get("/api/status/201")).status).toBe(201);
    expect((await request(app).get("/api/status/400")).status).toBe(400);
    expect((await request(app).get("/api/status/404")).status).toBe(404);
    expect((await request(app).get("/api/status/500")).status).toBe(500);
  });

  it("6. GET /old-page → 301 redirect to /new-page", async () => {
    const res = await request(app).get("/old-page");
    expect(res.status).toBe(301);
    expect(res.headers.location).toBe("/new-page");
  });

  it("7. GET /api/echo-headers → returns User-Agent and Accept-Language", async () => {
    const res = await request(app)
      .get("/api/echo-headers")
      .set("User-Agent", "Bun-Test")
      .set("Accept-Language", "en-US");
    expect(res.status).toBe(200);
    expect(res.body["user-agent"]).toBe("Bun-Test");
    expect(res.body["accept-language"]).toBe("en-US");
  });

  it("8. Response includes correct Content-Type and Content-Length automatically", async () => {
    const res = await request(app).get("/api/data").set("Accept", "application/json");
    expect(res.headers["content-type"]).toBeDefined();
    expect(res.headers["content-length"]).toBeDefined();
  });

  it("9. POST /api/data without Content-Type header → 400", async () => {
    const req = request(app).post("/api/data");
    req.unset("Content-Type");
    const res = await req.send("some raw data");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Content-Type header is required" });
  });
});
