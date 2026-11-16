// Serves the built site (the repo root, as GitHub Pages does) at http://localhost:4300 so it can be checked before pushing.
// (The pages also open fine straight from disk; this is for checking the built copy as it will be served.)
// Folders serve their index.html (the old /about, /events and /newsfeed addresses redirect to the new pages).
// Usage: npm run build, then npm run preview. No extra packages needed.

import http from 'http';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT) || 4300;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8',
};

async function send(res, file, status = 200) {
  const body = await fs.readFile(file);
  res.writeHead(status, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' });
  res.end(body);
}

http.createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.join(ROOT, path.normalize(urlPath));
    if (!file.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
    const stat = await fs.stat(file).catch(() => null);
    if (stat && stat.isFile()) return await send(res, file);
    const index = path.join(file, 'index.html');
    if (stat && stat.isDirectory() && (await fs.stat(index).catch(() => null))) return await send(res, index);
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  } catch (err) {
    res.writeHead(500); res.end(String(err && err.message));
  }
}).listen(PORT, () => {
  console.log(`Previewing dist/spanish-fort-lodge at http://localhost:${PORT}  (Ctrl+C to stop)`);
});
