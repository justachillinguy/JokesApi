# Jokes API

A tiny, dependency-free jokes API built with [Netlify Functions](https://docs.netlify.com/functions/overview/). It serves 25 hand-picked jokes as clean JSON with CORS enabled, so any website or app can fetch them.

## Endpoints

| Method | URL | Description |
| --- | --- | --- |
| `GET` | `/api/jokes` | List all jokes |
| `GET` | `/api/jokes?limit=3` | List up to `limit` jokes (1–25) |
| `GET` | `/api/jokes?search=america` | Case-insensitive text search |
| `GET` | `/api/jokes?id=7` | Fetch one joke by id |
| `GET` | `/api/jokes/random` | Fetch one random joke |

### Example responses

`GET /api/jokes/random`

```json
{
  "id": 7,
  "joke": "A turtle is crossing the road when he's mugged by two snails. ...",
  "total": 25
}
```

`GET /api/jokes?limit=2`

```json
{
  "jokes": [
    { "id": 1, "joke": "Mother: Who do you like more, me or your dad? ..." },
    { "id": 2, "joke": "The Pope and Donald Trump are on stage ..." }
  ],
  "count": 2,
  "total": 25
}
```

Errors use proper HTTP status codes with a JSON body, e.g. `404` for an unknown id and `400` for a bad `limit`.

### Quick start

```bash
curl https://your-site.netlify.app/api/jokes/random
```

## Run locally

Requires Node.js 18+. No dependencies, no `npm install` needed.

```bash
npm start
```

Then open http://localhost:8888 — you'll see a demo page that fetches jokes from the API. The `/api/*` routes work exactly as they do in production, because the local server runs the same function code Netlify runs.

Run the test suite with:

```bash
npm test
```

## Deploy to Netlify

1. Push this repo to GitHub.
2. In Netlify, choose **Add new site → Import an existing project** and pick the repo.
3. That's it — build settings are already in `netlify.toml`. Your functions are exposed at `/api/jokes` and `/api/jokes/random`.

Or with the Netlify CLI:

```bash
npx netlify deploy --prod
```

## Project structure

```
├── lib/jokes.js              # The 25 jokes + query helpers (single source of truth)
├── netlify/
│   └── functions/
│       ├── jokes.js          # list / limit / search / by-id endpoint
│       └── random.js         # random joke endpoint
├── public/                   # Demo page served at the site root
│   ├── index.html
│   ├── style.css
│   └── app.js
├── server.js                 # Zero-dependency local dev server (same function code)
├── netlify.toml              # Build settings + /api/* URL redirects
├── test/api.test.js          # Handler tests (node --test)
└── package.json
```

## Credits

The jokes themselves come from the original single-file version of this project. They've been lightly cleaned up, and each one now has a stable id.

## License

MIT
