import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

function syncStaticAssets() {
  try {
    const srcDir = path.resolve('./dist/client');
    const destDir = path.resolve('../public_html');
    if (fs.existsSync(srcDir) && fs.existsSync(destDir)) {
      fs.cpSync(srcDir, destDir, { recursive: true, force: true });
      console.log('Successfully synced static assets to public_html!');
    }
  } catch (err) {
    console.error('Asset sync error:', err);
  }
}

syncStaticAssets();

let handlerPromise = null;

function getHandler() {
  if (!handlerPromise) {
    handlerPromise = import('./dist/server/bundle.mjs')
      .then((m) => {
        console.log('Successfully loaded Astro bundled handler!');
        return m.handler;
      })
      .catch((err) => {
        console.error('Failed to import bundle.mjs:', err);
        return null;
      });
  }
  return handlerPromise;
}

const server = http.createServer(async (req, res) => {
  try {
    const handler = await getHandler();
    if (handler) {
      return handler(req, res);
    }
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Astro Handler Failed to Load');
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Server Error: ' + (err ? err.message : 'Unknown error'));
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Astro SSR Server running on port ${port}`);
});
