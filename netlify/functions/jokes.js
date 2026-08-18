'use strict';

// Netlify Function: GET /.netlify/functions/jokes  (aliased to /api/jokes)
// Query parameters (all optional):
//   id     – fetch one joke by id            → /api/jokes?id=7
//   search – case-insensitive text search    → /api/jokes?search=america
//   limit  – cap the number of jokes (1–25)  → /api/jokes?limit=3

const { allJokes, getJoke, searchJokes } = require('../../lib/jokes');

const HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Cache-Control': 'no-store',
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: HEADERS,
    body: JSON.stringify(body),
  };
}

/** Validate the `limit` query parameter. Returns null when invalid. */
function parseLimit(raw, max) {
  if (raw === undefined || raw === '') return max;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > max) return null;
  return n;
}

exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  const total = allJokes().length;

  // One joke by id
  if (params.id !== undefined) {
    const joke = getJoke(params.id);
    return joke
      ? json(200, { ...joke, total })
      : json(404, { error: `No joke with id ${params.id}.` });
  }

  // Text search
  if (params.search !== undefined) {
    const term = params.search.trim();
    if (term === '') {
      return json(400, { error: 'The "search" parameter must not be empty.' });
    }
    const jokes = searchJokes(term);
    return json(200, { jokes, count: jokes.length, total });
  }

  // List, optionally limited
  const limit = parseLimit(params.limit, total);
  if (limit === null) {
    return json(400, { error: `The "limit" parameter must be a whole number between 1 and ${total}.` });
  }

  const jokes = allJokes().slice(0, limit);
  return json(200, { jokes, count: jokes.length, total });
};
