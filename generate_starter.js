const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '25_capstone_rest_api/exercises/src');
const solutionsDir = path.join(__dirname, '25_capstone_rest_api/exercises/solutions/src');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(solutionsDir, srcDir);

function replaceInFile(filePath, replacer) {
  const p = path.join(srcDir, filePath);
  if (fs.existsSync(p)) {
    const content = fs.readFileSync(p, 'utf8');
    fs.writeFileSync(p, replacer(content));
  }
}

replaceInFile('middleware/auth.ts', () => `import { Request, Response, NextFunction } from "express";\nimport jwt from "jsonwebtoken";\nimport { AppError } from "../utils/AppError";\n\nconst JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";\n\nexport const requireAuth = (req: Request, res: Response, next: NextFunction) => {\n  // TODO: Implement JWT authentication middleware\n  // 1. Check for Authorization header (Bearer token)\n  // 2. Verify token using jsonwebtoken\n  // 3. Attach payload to req.user\n  // 4. Handle errors (401 Unauthorized)\n  next(new AppError("Not implemented", 501));\n};\n`);

replaceInFile('middleware/cache.ts', () => `import { Request, Response, NextFunction } from "express";\nimport crypto from "crypto";\n\nexport const cacheControl = (maxAge: number) => {\n  return (req: Request, res: Response, next: NextFunction) => {\n    // TODO: Implement Cache-Control header for GET requests\n    next();\n  };\n};\n\nexport const etagMiddleware = (req: Request, res: Response, next: NextFunction) => {\n  // TODO: Implement ETag generation and 304 Not Modified logic\n  next();\n};\n`);

replaceInFile('middleware/cors.ts', () => `import cors from "cors";\n\n// TODO: Export configured cors middleware\nexport const corsMiddleware = (req: any, res: any, next: any) => next();\n`);

replaceInFile('middleware/errorHandler.ts', () => `import { Request, Response, NextFunction } from "express";\nimport { AppError } from "../utils/AppError";\n\nexport const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {\n  // TODO: Implement centralized error handling\n  // If err is instance of AppError, use its statusCode\n  // Otherwise return 500\n  res.status(500).json({ error: "Not implemented" });\n};\n`);

replaceInFile('middleware/security.ts', () => `import helmet from "helmet";\nimport { Application } from "express";\n\nexport const setupSecurity = (app: Application) => {\n  // TODO: Use helmet and disable x-powered-by\n};\n`);

replaceInFile('middleware/validate.ts', () => `import { Request, Response, NextFunction } from "express";\nimport { AppError } from "../utils/AppError";\n\nexport const validateBody = (requiredFields: string[]) => {\n  return (req: Request, res: Response, next: NextFunction) => {\n    // TODO: Validate that all required fields exist in req.body\n    next();\n  };\n};\n`);

['auth', 'author', 'book'].forEach(mod => {
  const folder = mod === 'author' ? 'authors' : mod === 'book' ? 'books' : 'auth';
  
  replaceInFile(`modules/${folder}/${mod}.repository.ts`, () => `import { db } from "../../config/database";\n\nexport class ${mod.charAt(0).toUpperCase() + mod.slice(1)}Repository {\n  // TODO: Implement database operations using better-sqlite3\n}\n`);
  
  replaceInFile(`modules/${folder}/${mod}.service.ts`, () => `import { AppError } from "../../utils/AppError";\n\nexport class ${mod.charAt(0).toUpperCase() + mod.slice(1)}Service {\n  constructor(private repo: any) {}\n  // TODO: Implement business logic and validation\n}\n`);
  
  replaceInFile(`modules/${folder}/${mod}.controller.ts`, () => `import { Request, Response } from "express";\n\nexport class ${mod.charAt(0).toUpperCase() + mod.slice(1)}Controller {\n  constructor(private service: any) {}\n  // TODO: Implement route handlers\n}\n`);

  replaceInFile(`modules/${folder}/${mod}.routes.ts`, () => `import { Router } from "express";\n\nconst router = Router();\n// TODO: Setup routes and wire up controller, middleware, etc.\n\nexport default router;\n`);
});

replaceInFile('app.ts', () => `import express from "express";\n// TODO: Import middleware and routes\n\nexport const app = express();\n\n// TODO: Apply global middleware (security, cors, json parsing)\n\n// TODO: Register routes (/api/auth, /api/authors, /api/books)\n\n// TODO: 404 handler\n\n// TODO: Global error handler\n`);

