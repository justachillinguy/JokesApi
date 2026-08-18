'use strict';

// Netlify Function: GET /.netlify/functions/jokes  (aliased to /api/jokes)
// Query parameters (all optional):
//   id     – fetch one joke by id            → /api/jokes?id=7
//   search – case-insensitive text search    → /api/jokes?search=america
//   limit  – cap the number of jokes (1–25)  → /api/jokes?limit=3

const { listJokes } = require('../../lib/handlers');

exports.handler = async (event) => listJokes(event.queryStringParameters || {});
