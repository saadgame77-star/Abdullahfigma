import express, { type Express } from "express";
import path from "node:path";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ??
  [
    "https://alghilfees.com",
    "https://www.alghilfees.com",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ].join(",")
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin is not allowed by CORS"));
    },
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

app.use("/api", router);

// In production (single-process deploy) the same server serves the built
// frontend and falls back to index.html for client-side routes. Enabled via
// SERVE_CLIENT so the dev workflow (Vite) is unaffected.
if (process.env.SERVE_CLIENT === "true") {
  const clientDir =
    process.env.SITE_DIST ??
    path.resolve(process.cwd(), "artifacts/sheikh-site/dist/public");

  app.use(express.static(clientDir));

  // SPA fallback: any non-API GET returns the app shell.
  app.use((request, response, next) => {
    if (request.method !== "GET" || request.path.startsWith("/api")) {
      next();
      return;
    }
    response.sendFile(path.join(clientDir, "index.html"));
  });
}

export default app;