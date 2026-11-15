// AI-assisted generation: OpenAI Codex. See AI_USAGE.md and ai-usage.json.
// Development-only static server; the deployed game needs no Node.js process.
import http from "node:http";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const port = Number(process.env.PORT ?? 5173);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("PORT must be between 1 and 65535.");
const types = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".png": "image/png", ".woff2": "font/woff2" };
const server = http.createServer(async (request, response) => {
  if (!["GET", "HEAD"].includes(request.method)) { response.writeHead(405); response.end(); return; }
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const segments = pathname.split("/");
    const target = path.resolve(root, `.${pathname === "/" ? "/index.html" : pathname}`);
    if (segments.some(part => part.startsWith(".") || part === "node_modules") || !target.startsWith(root)) {
      response.writeHead(403); response.end(); return;
    }
    const bytes = await readFile(target);
    response.writeHead(200, { "Content-Type": types[path.extname(target)] ?? "application/octet-stream", "Cache-Control": "no-store" });
    response.end(request.method === "HEAD" ? undefined : bytes);
  } catch {
    response.writeHead(404); response.end("Not found");
  }
});
server.listen(port, "127.0.0.1", () => console.log(`Compass Outpost: http://127.0.0.1:${port}`));
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => server.close(() => process.exit(0)));
