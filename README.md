# Jokes API

A tiny, dependency-free jokes API. It serves 25 hand-picked jokes as clean JSON with CORS enabled, so any website or app can fetch them. Deploys to **Vercel** or **Netlify** — zero configuration, zero dependencies.

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

## Deploy to Vercel

The `api/` directory contains the serverless functions — Vercel maps `api/jokes.js` → `/api/jokes` and `api/random.js` → `/api/jokes/random` (via `vercel.json`). The demo page in `public/` is served at the site root.

**Option A — one click:** push this repo to GitHub, then open

```
https://vercel.com/new/clone?repository-url=https://github.com/justachillinguy/JokesApi
```

**Option B — CLI:**

```bash
npm i -g vercel
vercel login
vercel --prod
```

**Option C — dashboard:** import the GitHub repo at vercel.com/new. No build command or settings needed.

Once deployed, your API is live immediately:

```bash
curl https://your-project.vercel.app/api/jokes/random
```

## Deploy to Netlify

This repo also works on Netlify out of the box (`netlify.toml` is included):

1. Push this repo to GitHub.
2. In Netlify, choose **Add new site → Import an existing project** and pick the repo.

Or with the Netlify CLI:

```bash
npx netlify deploy --prod
```

## Run locally

Requires Node.js 18+. No dependencies, no `npm install` needed.

```bash
npm start
```

Then open http://localhost:8888 — you'll see a demo page that fetches jokes from the API. The `/api/*` routes work exactly as they do in production, because the local server runs the same function code the platforms run.

Run the test suite (covers both the Vercel and Netlify handlers):

```bash
npm test
```

## Project structure

```
├── api/                      # Vercel serverless functions
│   ├── jokes.js              # /api/jokes (list / limit / search / by-id)
│   └── random.js             # /api/jokes/random
├── lib/
│   ├── jokes.js              # The 25 jokes + query helpers (single source of truth)
│   └── handlers.js           # Shared request logic (used by both platforms)
├── netlify/
│   └── functions/            # Netlify serverless functions (thin adapters)
├── public/                   # Demo page served at the site root
│   ├── index.html
│   ├── style.css
│   └── app.js
├── vercel.json               # Vercel rewrites (/api/jokes/random, static files)
├── .vercelignore             # Keeps Netlify-only files out of Vercel deploys
├── netlify.toml              # Netlify build settings + /api/* URL redirects
├── server.js                 # Zero-dependency local dev server
├── test/                     # Handler tests (node --test)
└── package.json
```

## Credits

The jokes themselves come from the original single-file version of this project. They've been lightly cleaned up, and each one now has a stable id.

## License

MIT
