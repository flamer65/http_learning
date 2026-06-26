import { Router } from "express";

export const demoRouter = Router();

demoRouter.get("/data", (req, res) => {
  res.format({
    "application/json": () => {
      res.json({ message: "Hello World" });
    },
    "text/plain": () => {
      res.send("Hello World");
    },
    default: () => {
      res.status(406).send("Not Acceptable");
    },
  });
});

demoRouter.post("/data", (req, res) => {
  if (!req.get("Content-Type")) {
    return res.status(400).json({ error: "Content-Type header is required" });
  }
  res.json({ received: req.body });
});

demoRouter.post("/form", (req, res) => {
  res.json({ received: req.body });
});

demoRouter.get("/info", (req, res) => {
  res.set("X-Request-Id", "12345");
  res.set("X-Powered-By", "Express Learning");
  res.status(200).send();
});

demoRouter.get("/status/:code", (req, res) => {
  const code = parseInt(req.params.code);
  res.status(code).send();
});

demoRouter.get("/echo-headers", (req, res) => {
  res.json({
    "user-agent": req.get("User-Agent"),
    "accept-language": req.get("Accept-Language"),
  });
});
