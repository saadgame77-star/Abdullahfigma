import { spawn } from "node:child_process";
import http from "node:http";

const API_PORT = 8080;
const SITE_PORT = 24740;
const API_URL = `http://127.0.0.1:${API_PORT}`;
const SITE_URL = `http://127.0.0.1:${SITE_PORT}`;

const children = new Set();

function log(label, message) {
  process.stdout.write(`[${label}] ${message}`);
}

function runShell(command) {
  return new Promise((resolve) => {
    const child = spawn("bash", ["-lc", command], {
      stdio: "ignore",
      env: process.env,
    });

    child.on("close", () => resolve());
    child.on("error", () => resolve());
  });
}

async function stopOldProcesses() {
  console.log("إيقاف العمليات القديمة المرتبطة بموقع الشيخ والموك أب...");

  const patterns = [
    "[p]npm -C artifacts/api-server run dev",
    "[n]ode --enable-source-maps ./dist/index.mjs",
    "[p]npm -C artifacts/sheikh-site run dev",
    "[v]ite --config vite.config.ts",
    "artifacts/mockup-sandbox",
  ];

  for (const pattern of patterns) {
    await runShell(`pkill -f "${pattern}" || true`);
  }

  await new Promise((resolve) => setTimeout(resolve, 2500));
}

function spawnProcess(label, command, args, env) {
  const child = spawn(command, args, {
    cwd: process.cwd(),
    env: {
      ...process.env,
      ...env,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  children.add(child);

  child.stdout.on("data", (chunk) => {
    log(label, chunk.toString());
  });

  child.stderr.on("data", (chunk) => {
    log(label, chunk.toString());
  });

  child.on("exit", (code, signal) => {
    children.delete(child);

    if (signal) {
      console.log(`[${label}] توقف بالإشارة: ${signal}`);
      return;
    }

    if (code !== 0) {
      console.error(`[${label}] توقف بخطأ. Exit code: ${code}`);
      shutdown(1);
    }
  });

  return child;
}

function waitForUrl(url, expectedStatuses, label, timeoutMs = 30000) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    function attempt() {
      const request = http.get(url, (response) => {
        response.resume();

        if (expectedStatuses.includes(response.statusCode ?? 0)) {
          resolve();
          return;
        }

        retry();
      });

      request.on("error", retry);
      request.setTimeout(3000, () => {
        request.destroy();
        retry();
      });
    }

    function retry() {
      if (Date.now() - startedAt > timeoutMs) {
        reject(new Error(`تعذر تشغيل ${label} خلال المهلة المحددة: ${url}`));
        return;
      }

      setTimeout(attempt, 1000);
    }

    attempt();
  });
}

function shutdown(code = 0) {
  for (const child of children) {
    child.kill("SIGTERM");
  }

  setTimeout(() => {
    for (const child of children) {
      child.kill("SIGKILL");
    }

    process.exit(code);
  }, 1500);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

await stopOldProcesses();

console.log("تشغيل API على المنفذ 8080...");

spawnProcess(
  "api",
  "pnpm",
  ["-C", "artifacts/api-server", "run", "dev"],
  {
    PORT: String(API_PORT),
    ALLOWED_ORIGINS: [
      process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "",
      `http://localhost:${SITE_PORT}`,
      `http://127.0.0.1:${SITE_PORT}`,
    ]
      .filter(Boolean)
      .join(","),
  },
);

await waitForUrl(`${API_URL}/api/admin/auth/me`, [401], "API");

console.log("API يعمل بنجاح.");

console.log("تشغيل موقع الشيخ على المنفذ 24740...");

spawnProcess(
  "site",
  "pnpm",
  ["-C", "artifacts/sheikh-site", "run", "dev"],
  {
    PORT: String(SITE_PORT),
    BASE_PATH: "/",
    VITE_API_PROXY_TARGET: API_URL,
  },
);

await waitForUrl(`${SITE_URL}/api/admin/auth/me`, [401], "موقع الشيخ مع proxy");

console.log("");
console.log("تم تشغيل موقع الشيخ والـ API بنجاح.");
console.log(`رابط Replit: https://${process.env.REPLIT_DEV_DOMAIN ?? "رابط-replit-dev"}`);
console.log(`اختبار API المحلي: ${SITE_URL}/api/admin/auth/me`);
console.log("");
console.log("اترك هذا الأمر يعمل. للإيقاف اضغط Ctrl+C.");
