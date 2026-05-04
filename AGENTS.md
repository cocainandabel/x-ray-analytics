# X-Ray Analytics

## Cursor Cloud specific instructions

### Overview

X-Ray Analytics is a React + Vite + Tailwind CSS SPA that analyzes X (Twitter) profiles. It classifies tweets into Hero/Regular/Zombie buckets and estimates media value. The backend is a single Vercel serverless function (`api/twitter.ts`) that proxies calls to twitterapi.io.

### Services

| Service | Command | Port | Notes |
|---------|---------|------|-------|
| Vite dev server | `npm run dev` | 5173 | Main development server; proxies `/api/twitter` to twitterapi.io |

There is no database, Docker, or additional backend service required.

### Key commands

- **Dev server:** `npm run dev` (starts Vite on port 5173)
- **Build:** `npm run build` (outputs to `dist/`)
- **Preview built app:** `npm run preview`
- **Type check:** `npx tsc --noEmit`

No ESLint config exists in this repo; there is no lint script in `package.json`.

### Environment variables

The app needs a twitterapi.io API key to make real API calls. Without it the app loads but analyze requests return `Forbidden`. The `TWITTERAPI_KEY` secret is provided via Cursor Cloud Secrets. On startup, write `.env.local` from it:

```bash
cat > .env.local << EOF
TWITTERAPI_KEY=${TWITTERAPI_KEY}
VITE_TWITTERAPI_KEY=${TWITTERAPI_KEY}
EOF
```

Both vars use the same key value — `TWITTERAPI_KEY` is for the Vercel serverless function, `VITE_TWITTERAPI_KEY` is for the Vite dev proxy.

### Gotchas

- The repo has a secondary Next.js App Router tree under `/app/` (`app/page.tsx`, `app/api/analyze/route.ts`). This is **not** wired into the primary Vite build and can be ignored for standard dev work.
- The Vite proxy in `vite.config.ts` reads `.env.local` at startup; changing env vars requires restarting the dev server.
- There are no automated tests in this repo.
