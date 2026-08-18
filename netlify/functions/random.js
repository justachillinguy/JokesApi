'use strict';

// Netlify Function: GET /.netlify/functions/random  (aliased to /api/jokes/random)
// Returns one randomly selected joke.

const { allJokes, getRandomJoke } = require('../../lib/jokes');

exports.handler = async () => ({
  statusCode: 200,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Cache-Control': 'no-store',
  },
  body: JSON.stringify({ ...getRandomJoke(), total: allJokes().length }),
});
