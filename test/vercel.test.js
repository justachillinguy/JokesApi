'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const jokesHandler = require('../api/jokes');
const randomHandler = require('../api/random');
const { JOKES } = require('../lib/jokes');

/** Call a Vercel-style (req, res) handler with a fake response. */
function call(handler, query = {}) {
  const captured = {};
  const req = { query };
  const res = {
    writeHead(statusCode, headers) {
      captured.statusCode = statusCode;
      captured.headers = headers;
    },
    end(body) {
      captured.body = body;
    },
  };
  return handler(req, res).then(() => captured);
}

test('Vercel GET /api/jokes lists all jokes', async () => {
  const res = await call(jokesHandler);
  assert.equal(res.statusCode, 200);
  const body = JSON.parse(res.body);
  assert.equal(body.total, 25);
  assert.equal(body.count, 25);
});

test('Vercel GET /api/jokes?id=7 returns that joke', async () => {
  const res = await call(jokesHandler, { id: '7' });
  assert.equal(res.statusCode, 200);
  const body = JSON.parse(res.body);
  assert.equal(body.joke, JOKES[6]);
});

test('Vercel GET /api/jokes?limit=3 caps the list', async () => {
  const res = await call(jokesHandler, { limit: '3' });
  const body = JSON.parse(res.body);
  assert.equal(res.statusCode, 200);
  assert.equal(body.count, 3);
});

test('Vercel GET /api/jokes?search=america finds matches', async () => {
  const res = await call(jokesHandler, { search: 'AMERICA' });
  assert.equal(res.statusCode, 200);
  const body = JSON.parse(res.body);
  assert.ok(body.count > 0);
});

test('Vercel GET /api/jokes?id=999 returns 404', async () => {
  const res = await call(jokesHandler, { id: '999' });
  assert.equal(res.statusCode, 404);
});

test('Vercel GET /api/jokes/random returns one valid joke', async () => {
  const res = await call(randomHandler);
  assert.equal(res.statusCode, 200);
  const body = JSON.parse(res.body);
  assert.equal(body.joke, JOKES[body.id - 1]);
});

test('Vercel responses include CORS headers', async () => {
  const res = await call(jokesHandler);
  assert.equal(res.headers['Access-Control-Allow-Origin'], '*');
  assert.match(res.headers['Content-Type'], /^application\/json/);
});
