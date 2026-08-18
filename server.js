'use strict';

// Zero-dependency local dev server.
//
//   npm start            → http://localhost:8888
//
// It runs the exact same Netlify Functions used in production and maps the
// /api/* URLs the way netlify.toml redirects do on Netlify, so what you see
// locally is what you get after deploying.

const http = require('http');
const fs = require('fs');
const path = require('path');

const jokesHandler = require('./netlify/functions/jokes').handler;
const randomHandler = require('./netlify/functions/random').handler;

const PUBLIC_DIR = path.join(__dirname, 'public');
const PORT = Number(process.env.PORT) || 8888;
const HOST = '0.0.0.0'; // reachable from the browser preview

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

/** Same URL→function mapping as the redirects in netlify.toml. */
function resolveFunction(pathname) {
  if (pathname === '/api/jokes/random' || pathname === '/.netlify/functions/random') {
    return randomHandler;
  }
  if (pathname === '/api/jokes' || pathname === '/.netlify/functions/jokes') {
    return jokesHandler;
  }
  return null;
}

async function handleApi(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const handler = resolveFunction(url.pathname);

  if (!handler) {
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Not found.' }));
    return;
  }

  const event = {
    httpMethod: req.method,
    path: url.pathname,
    queryStringParameters: Object.fromEntries(url.searchParams),
  };

  try {
    const result = await handler(event);
    res.writeHead(result.statusCode, result.headers);
    res.end(result.body);
  } catch (err) {
    console.error(err);
    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Internal server error.' }));
  }
}

function handleStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === '/') pathname = '/index.html';

  const filePath = path.normalize(path.join(PUBLIC_DIR, pathname));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 – Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/') || req.url.startsWith('/.netlify/')) {
    handleApi(req, res);
  } else {
    handleStatic(req, res);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Jokes API running at http://localhost:${PORT}`);
  console.log(`  GET /api/jokes          – list all jokes`);
  console.log(`  GET /api/jokes/random   – get a random joke`);
  console.log(`  GET /api/jokes?limit=3  – limit results`);
  console.log(`  GET /api/jokes?search=america – search jokes`);
});
