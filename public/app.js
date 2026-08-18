'use strict';

// Demo page script — asks the API for a random joke. Uses a relative URL so
// it works on Netlify and on the local dev server without any config.

const jokeEl = document.getElementById('JokesContainer');
const badgeEl = document.getElementById('badge');
const buttonEl = document.getElementById('nextButton');

async function fetchRandomJoke() {
  buttonEl.disabled = true;
  jokeEl.textContent = 'Loading…';
  try {
    const response = await fetch('/api/jokes/random');
    if (!response.ok) throw new Error(`API responded with ${response.status}`);
    const data = await response.json();
    badgeEl.textContent = `Joke #${data.id} of ${data.total}`;
    jokeEl.textContent = data.joke;
  } catch (err) {
    badgeEl.textContent = 'Error';
    jokeEl.className = 'joke error';
    jokeEl.textContent = `Could not load a joke: ${err.message}`;
  } finally {
    buttonEl.disabled = false;
  }
}

buttonEl.addEventListener('click', fetchRandomJoke);
fetchRandomJoke();
