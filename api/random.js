'use strict';

// Vercel Function: GET /api/jokes/random
// (vercel.json rewrites /api/jokes/random → /api/random)
// Returns one randomly selected joke.

const { randomJoke } = require('../lib/handlers');

module.exports = async (req, res) => {
  const result = randomJoke();
  res.writeHead(result.statusCode, result.headers);
  res.end(result.body);
};
