import { describe, it, expect } from "bun:test";
import request from "supertest";
import { app } from "../src/app";

describe("Cookies", () => {
  it("1. GET /cookies/set-cookie -> Set-Cookie header with name=naman", async () => {
    const res = await request(app).get("/cookies/set-cookie");
    const setCookie = res.headers["set-cookie"][0];
    expect(setCookie).toMatch(/name=naman/);
  });

  it("2. GET /cookies/set-secure-cookie -> Set-Cookie with HttpOnly, Secure, SameSite=Strict", async () => {
    const res = await request(app).get("/cookies/set-secure-cookie");
    const setCookie = res.headers["set-cookie"][0];
    expect(setCookie).toMatch(/HttpOnly/i);
    expect(setCookie).toMatch(/Secure/i);
    expect(setCookie).toMatch(/SameSite=Strict/i);
  });

  it("3. GET /cookies/read-cookies with Cookie header -> parsed object", async () => {
    const res = await request(app)
      .get("/cookies/read-cookies")
      .set("Cookie", "theme=dark; lang=en");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ theme: "dark", lang: "en" });
  });

  it("4. GET /cookies/set-session-cookie -> Set-Cookie without Max-Age", async () => {
    const res = await request(app).get("/cookies/set-session-cookie");
    const setCookie = res.headers["set-cookie"][0];
    expect(setCookie).not.toMatch(/Max-Age/i);
    expect(setCookie).not.toMatch(/Expires/i);
  });

  it("5. GET /cookies/set-persistent-cookie -> Set-Cookie with Max-Age=86400", async () => {
    const res = await request(app).get("/cookies/set-persistent-cookie");
    const setCookie = res.headers["set-cookie"][0];
    expect(setCookie).toMatch(/Max-Age=86400/i);
  });
  
  it("6. DELETE /cookies/clear-cookie -> Cookie cleared", async () => {
    const res = await request(app).delete("/cookies/clear-cookie");
    const setCookie = res.headers["set-cookie"][0];
    expect(setCookie).toMatch(/Max-Age=0|Expires=.*1970/i); 
  });
});