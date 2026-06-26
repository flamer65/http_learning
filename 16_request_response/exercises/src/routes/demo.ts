import { Router } from "express";

export const demoRouter = Router();

// TODO 1: GET /data - Content negotiation
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

// TODO 2: POST /data
demoRouter.post("/data", (req, res) => {
  const contentType = req.get("Content-Type");
  if (!contentType || contentType.includes("x-www-form-urlencoded")) {
    return res.status(400).json({ error: "Content-Type header is required" });
  }
  res.json({ received: req.body });
});

// TODO 3: POST /form
demoRouter.post("/form", (req, res) => {
  res.json({ received: req.body });
});

// TODO 4: GET /info
demoRouter.get("/info", (req, res) => {
  res.set("X-Request-Id", "12345");
  res.set("X-Powered-By", "Express Learning");
  res.status(200).send();
});

// TODO 5: GET /status/:code
demoRouter.get("/status/:code", (req, res) => {
  const code = parseInt(req.params.code);
  res.status(code).send();
});

// TODO 6: GET /echo-headers
demoRouter.get("/echo-headers", (req, res) => {
  res.json({
    "user-agent": req.get("User-Agent"),
    "accept-language": req.get("Accept-Language"),
  });
});
