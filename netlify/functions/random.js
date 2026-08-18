'use strict';

// Netlify Function: GET /.netlify/functions/random  (aliased to /api/jokes/random)
// Returns one randomly selected joke.

const { randomJoke } = require('../../lib/handlers');

exports.handler = async () => randomJoke();
