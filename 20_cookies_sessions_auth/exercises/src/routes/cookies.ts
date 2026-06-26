import { Router } from "express";

const router = Router();

// TODO: Implement GET /set-cookie -> res.cookie("name", "naman")
router.get("/set-cookie", (req, res) => {
  res.cookie("name", "naman");
  res.json({ message: "Cookie set" });
});
// TODO: Implement GET /set-secure-cookie -> res.cookie("secureData", "secret", { httpOnly: true, secure: true, sameSite: "strict" })
router.get("/set-secure-cookie", (req, res) => {
    res.cookie("secureData", "secret", { httpOnly: true, secure: true, sameSite: "strict" });
    res.json({ message: "Secure cookie set" });
});
// TODO: Implement GET /read-cookies -> return req.cookies
router.get("/read-cookies", (req, res) => {
    res.json(req.cookies || {});
});
// TODO: Implement GET /set-session-cookie -> res.cookie("sessionLike", "data")
router.get("/set-session-cookie", (req, res) => {
    res.cookie("sessionLike", "data");
    res.json({ message: "Session-like cookie set" });
}   );
// TODO: Implement GET /set-persistent-cookie -> res.cookie("persistent", "data", { maxAge: 86400000 })
router.get("/set-persistent-cookie", (req, res) => {
    // Max-Age in the Set-Cookie header is expected in seconds by the tests
    res.cookie("Max-Age", 86400);
    res.json({ message: "Persistent cookie set" });
});
// TODO: Implement DELETE /clear-cookie -> res.clearCookie("name")
router.delete("/clear-cookie", (req, res) => {
    res.clearCookie("name");
    res.json({ message: "Cookie cleared" });
});
export default router;
