import { Router } from "express";

const router = Router();

router.get("/set-cookie", (req, res) => {
  res.cookie("name", "naman");
  res.send("Cookie set");
});

router.get("/set-secure-cookie", (req, res) => {
  res.cookie("secureData", "secret", { httpOnly: true, secure: true, sameSite: "strict" });
  res.send("Secure cookie set");
});

router.get("/read-cookies", (req, res) => {
  res.json(req.cookies);
});

router.get("/set-session-cookie", (req, res) => {
  res.cookie("sessionLike", "data");
  res.send("Session cookie set");
});

router.get("/set-persistent-cookie", (req, res) => {
  res.cookie("persistent", "data", { maxAge: 86400000 });
  res.send("Persistent cookie set");
});

router.delete("/clear-cookie", (req, res) => {
  res.clearCookie("name");
  res.send("Cookie cleared");
});

export default router;
