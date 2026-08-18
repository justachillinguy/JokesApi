'use strict';

// Shared request-handling core, used by BOTH the Vercel functions (api/)
// and the Netlify functions (netlify/functions/). Each platform adds a
// thin adapter around listJokes() / randomJoke().

const { allJokes, getJoke, getRandomJoke, searchJokes } = require('./jokes');

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Cache-Control': 'no-store',
};

function response(statusCode, body) {
  return { statusCode, headers: JSON_HEADERS, body: JSON.stringify(body) };
}

/** Validate the `limit` query parameter. Returns null when invalid. */
function parseLimit(raw, max) {
  if (raw === undefined || raw === '') return max;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > max) return null;
  return n;
}

/**
 * Handle the jokes endpoint: ?id, ?search, ?limit, or the full list.
 * Returns a platform-agnostic `{ statusCode, headers, body }`.
 */
function listJokes(query = {}) {
  const total = allJokes().length;

  // One joke by id
  if (query.id !== undefined) {
    const joke = getJoke(query.id);
    return joke
      ? response(200, { ...joke, total })
      : response(404, { error: `No joke with id ${query.id}.` });
  }

  // Text search
  if (query.search !== undefined) {
    const term = query.search.trim();
    if (term === '') {
      return response(400, { error: 'The "search" parameter must not be empty.' });
    }
    const jokes = searchJokes(term);
    return response(200, { jokes, count: jokes.length, total });
  }

  // List, optionally limited
  const limit = parseLimit(query.limit, total);
  if (limit === null) {
    return response(400, {
      error: `The "limit" parameter must be a whole number between 1 and ${total}.`,
    });
  }

  const jokes = allJokes().slice(0, limit);
  return response(200, { jokes, count: jokes.length, total });
}

/** Handle the random endpoint. */
function randomJoke() {
  return response(200, { ...getRandomJoke(), total: allJokes().length });
}

module.exports = { listJokes, randomJoke };
