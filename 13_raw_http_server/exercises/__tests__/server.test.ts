import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { server } from "../src/server";

let baseUrl: string;

beforeAll((done) => {
  server.listen(0, () => {
    const addr = server.address();
    baseUrl = `http://localhost:${(addr as any).port}`;
    done();
  });
});

afterAll(() => {
  server.close();
});

describe("Raw HTTP Server", () => {
  // ─── Test 1: GET / → 200 + JSON greeting ─────────────────────
  describe("GET /", () => {
    it('should return 200 with { message: "hello" }', async () => {
      const res = await fetch(`${baseUrl}/`);

      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body).toEqual({ message: "hello" });
    });

    it("should have Content-Type: application/json", async () => {
      const res = await fetch(`${baseUrl}/`);

      const contentType = res.headers.get("content-type");
      expect(contentType).toContain("application/json");
    });
  });

  // ─── Test 2: POST /echo → mirrors the request body ───────────
  describe("POST /echo", () => {
    it("should echo back the request body as JSON", async () => {
      const payload = { name: "Alice", age: 30 };

      const res = await fetch(`${baseUrl}/echo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body).toEqual(payload);
    });

    it("should handle a different payload correctly", async () => {
      const payload = { items: [1, 2, 3], active: true };

      const res = await fetch(`${baseUrl}/echo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body).toEqual(payload);
    });
  });

  // ─── Test 3: GET /users?role=admin → query string parsing ────
  describe("GET /users?role=admin", () => {
    it('should return { role: "admin" } from the query string', async () => {
      const res = await fetch(`${baseUrl}/users?role=admin`);

      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body).toEqual({ role: "admin" });
    });

    it("should handle a different role query parameter", async () => {
      const res = await fetch(`${baseUrl}/users?role=editor`);

      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body).toEqual({ role: "editor" });
    });
  });

  // ─── Test 4: GET /unknown-path → 404 ─────────────────────────
  describe("GET /unknown-path", () => {
    it("should return 404 with an error message", async () => {
      const res = await fetch(`${baseUrl}/unknown-path`);

      expect(res.status).toBe(404);

      const body = await res.json();
      expect(body).toEqual({ error: "Not Found" });
    });

    it("should return 404 for any undefined route", async () => {
      const res = await fetch(`${baseUrl}/this/does/not/exist`);

      expect(res.status).toBe(404);

      const body = await res.json();
      expect(body).toEqual({ error: "Not Found" });
    });
  });

  // ─── Test 5: HEAD / → 200 with headers but empty body ────────
  describe("HEAD /", () => {
    it("should return 200 with no response body", async () => {
      const res = await fetch(`${baseUrl}/`, {
        method: "HEAD",
      });

      expect(res.status).toBe(200);

      // HEAD responses must have an empty body
      const text = await res.text();
      expect(text).toBe("");
    });

    it("should still include Content-Type header", async () => {
      const res = await fetch(`${baseUrl}/`, {
        method: "HEAD",
      });

      const contentType = res.headers.get("content-type");
      expect(contentType).toContain("application/json");
    });
  });

  // ─── Test 6: Custom header X-Powered-By ───────────────────────
  describe("Custom Headers", () => {
    it('should include X-Powered-By: raw-node on GET /', async () => {
      const res = await fetch(`${baseUrl}/`);

      const poweredBy = res.headers.get("x-powered-by");
      expect(poweredBy).toBe("raw-node");
    });

    it("should include X-Powered-By on 404 responses too", async () => {
      const res = await fetch(`${baseUrl}/nope`);

      const poweredBy = res.headers.get("x-powered-by");
      expect(poweredBy).toBe("raw-node");
    });

    it("should include X-Powered-By on POST /echo", async () => {
      const res = await fetch(`${baseUrl}/echo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: true }),
      });

      const poweredBy = res.headers.get("x-powered-by");
      expect(poweredBy).toBe("raw-node");
    });
  });
});
