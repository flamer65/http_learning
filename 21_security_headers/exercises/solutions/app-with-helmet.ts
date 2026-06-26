import express from "express";
import helmet from "helmet";
import { apiRouter } from "./routes/api";

/**
 * 🪖 Helmet.js Version — SOLUTION
 *
 * This replaces ALL manual security headers with Helmet.
 * Helmet is a collection of 15+ middleware functions that set
 * security headers with sensible defaults.
 *
 * Notice how much simpler this is compared to the manual version!
 * But now you understand what each header does and WHY it matters.
 */

const app = express();

// Remove X-Powered-By — Helmet also does this, but being explicit is fine
app.disable("x-powered-by");

// Parse JSON bodies
app.use(express.json());

// Helmet replaces our manual securityHeaders middleware
// We customize it to match the exact values our tests expect
app.use(
  helmet({
    // HSTS: max-age=31536000 (1 year) with includeSubDomains
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
    },

    // X-Frame-Options: DENY
    frameguard: {
      action: "deny",
    },

    // Content-Security-Policy: default-src 'self'
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
      },
    },

    // Referrer-Policy: strict-origin-when-cross-origin
    referrerPolicy: {
      policy: "strict-origin-when-cross-origin",
    },

    // X-Content-Type-Options: nosniff — Helmet does this by default!

    // Note: Helmet doesn't have built-in Permissions-Policy support,
    // so we'll set that header manually below.
  })
);

// Permissions-Policy — Helmet doesn't set this, so we add it manually
app.use((_req, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self)"
  );
  next();
});

// Mount API routes
app.use("/api", apiRouter);

export { app };
