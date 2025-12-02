## X-Ray Analytics

A small React + Vite + Tailwind app that analyzes a simulated X (Twitter) profile, classifying posts into Hero/Zombie buckets and estimating media value.

### Prerequisites

- Node.js 18+
- npm 10+
- A [twitterapi.io](https://twitterapi.io) account + API key
- (Recommended) [Vercel CLI](https://vercel.com/download) for local serverless testing

### Configure environment variables

Create a `.env.local` file in the project root with:

```
VITE_TWITTERAPI_KEY=pk_live_xxxxxxxxx           # only used during local dev if you skip vercel dev
TWITTERAPI_KEY=pk_live_xxxxxxxxx               # used by the Vercel serverless function
```

> `TWITTERAPI_KEY` must be kept secret. In production you’ll set it inside Vercel → Project → Settings → Environment Variables.

### Run locally (option A – secure path via Vercel dev)

This path exercises the same serverless function you’ll deploy:

```bash
npm install
vercel dev
```

`vercel dev` runs the API function on port 3000; Vite (port 5173) proxies `/api/*` to that process. Visit the printed localhost URL for the UI.

### Run locally (option B – direct API calls)

If you just want to try it quickly without `vercel dev`, expose your key to the browser (only do this on trusted machines):

```bash
npm install
VITE_TWITTERAPI_KEY=pk_live_x npm run dev
```

The app will call twitterapi.io directly from the client.

### Production build

```bash
npm run build
npm run preview
```

### Deploy on Vercel

1. Push the repo to GitHub.
2. In Vercel → “Add New Project” → import the repo.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. In Project → Settings → Environment Variables add `TWITTERAPI_KEY` (same value you used locally).
5. Deploy. The serverless function in `/api/twitter.ts` will keep the API key private at runtime.


