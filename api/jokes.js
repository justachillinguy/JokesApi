'use strict';

// Vercel Function: GET /api/jokes  (api/jokes.js maps to /api/jokes automatically)
// Query parameters (all optional):
//   id     – fetch one joke by id            → /api/jokes?id=7
//   search – case-insensitive text search    → /api/jokes?search=america
//   limit  – cap the number of jokes (1–25)  → /api/jokes?limit=3

const { listJokes } = require('../lib/handlers');

module.exports = async (req, res) => {
  const result = listJokes(req.query || {});
  res.writeHead(result.statusCode, result.headers);
  res.end(result.body);
};
