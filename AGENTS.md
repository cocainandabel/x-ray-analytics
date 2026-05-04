# AGENTS.md

## Cursor Cloud specific instructions

### Overview
X-Ray Analytics is a single-page React + Vite + Tailwind CSS app that analyzes X (Twitter) profiles. It classifies tweets as Hero/Regular/Zombie based on engagement ratios.

### Stack
- **Frontend**: React 18, Vite 5 (with SWC plugin), Tailwind CSS 3, TypeScript
- **API**: Vercel Serverless Function at `/api/twitter.ts` (primary) and Next.js route at `/app/api/analyze/route.ts` (alternative)
- **External API**: twitterapi.io (requires `TWITTERAPI_KEY`)
- **Package manager**: npm (lockfile: `package-lock.json`)

### Running the dev server
```bash
npm run dev
```
Starts Vite on port 5173. The Vite config includes a proxy for `/api/twitter` that forwards to `twitterapi.io` with the API key from `VITE_TWITTERAPI_KEY` env var.

### Building
```bash
npm run build
```

### Type checking
```bash
npx tsc --noEmit
```

### Key caveats
- No ESLint config exists in the repo. There are no lint scripts.
- No test framework is configured. There are no test scripts.
- The app requires a `TWITTERAPI_KEY` (or `VITE_TWITTERAPI_KEY` for the Vite proxy path) to fetch real data. Without it, the analyze action returns a "Forbidden" error — this is expected behavior.
- Two parallel API implementations exist: `/api/twitter.ts` (Vercel serverless, uses `TWITTERAPI_KEY`) and `/app/api/analyze/route.ts` (Next.js App Router, uses `TWITTER_API_IO_KEY`). The primary path used by the Vite SPA is the former.
