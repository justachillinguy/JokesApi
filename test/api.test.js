'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const jokesHandler = require('../netlify/functions/jokes').handler;
const randomHandler = require('../netlify/functions/random').handler;
const { JOKES } = require('../lib/jokes');

function call(handler, query = {}) {
  return handler({ httpMethod: 'GET', queryStringParameters: query });
}

test('jokes data is valid', () => {
  assert.equal(JOKES.length, 25);
  for (const joke of JOKES) {
    assert.equal(typeof joke, 'string');
    assert.ok(joke.length > 0, 'every joke must be non-empty');
  }
});

test('GET /api/jokes lists all jokes', async () => {
  const res = await call(jokesHandler);
  assert.equal(res.statusCode, 200);
  const body = JSON.parse(res.body);
  assert.equal(body.total, 25);
  assert.equal(body.count, 25);
  assert.deepEqual(body.jokes[0], { id: 1, joke: JOKES[0] });
  assert.deepEqual(body.jokes[24], { id: 25, joke: JOKES[24] });
});

test('GET /api/jokes?limit=3 caps the list', async () => {
  const res = await call(jokesHandler, { limit: '3' });
  const body = JSON.parse(res.body);
  assert.equal(res.statusCode, 200);
  assert.equal(body.count, 3);
  assert.equal(body.total, 25);
});

test('GET /api/jokes?limit=0 is rejected with 400', async () => {
  const res = await call(jokesHandler, { limit: '0' });
  assert.equal(res.statusCode, 400);
  const body = JSON.parse(res.body);
  assert.ok(body.error);
});

test('GET /api/jokes?limit=abc is rejected with 400', async () => {
  const res = await call(jokesHandler, { limit: 'abc' });
  assert.equal(res.statusCode, 400);
});

test('GET /api/jokes?search works case-insensitively', async () => {
  const res = await call(jokesHandler, { search: 'AMERICA' });
  assert.equal(res.statusCode, 200);
  const body = JSON.parse(res.body);
  assert.ok(body.count > 0, 'expected at least one match');
  assert.ok(body.jokes.every(({ joke }) => joke.toLowerCase().includes('america')));
});

test('GET /api/jokes?search= returns 400', async () => {
  const res = await call(jokesHandler, { search: '   ' });
  assert.equal(res.statusCode, 400);
});

test('GET /api/jokes?id=7 returns that joke', async () => {
  const res = await call(jokesHandler, { id: '7' });
  assert.equal(res.statusCode, 200);
  const body = JSON.parse(res.body);
  assert.equal(body.id, 7);
  assert.equal(body.joke, JOKES[6]);
});

test('GET /api/jokes?id=999 returns 404', async () => {
  const res = await call(jokesHandler, { id: '999' });
  assert.equal(res.statusCode, 404);
});

test('GET /api/jokes/random returns one valid joke', async () => {
  const res = await call(randomHandler);
  assert.equal(res.statusCode, 200);
  const body = JSON.parse(res.body);
  assert.ok(body.id >= 1 && body.id <= 25);
  assert.equal(body.joke, JOKES[body.id - 1]);
  assert.equal(body.total, 25);
});

test('responses include CORS headers', async () => {
  const res = await call(jokesHandler);
  assert.equal(res.headers['Access-Control-Allow-Origin'], '*');
  assert.match(res.headers['Content-Type'], /^application\/json/);
});
