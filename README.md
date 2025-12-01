## X-Ray Analytics

A small React + Vite + Tailwind app that analyzes a simulated X (Twitter) profile, classifying posts into Hero/Zombie buckets and estimating media value.

### Run locally

From `/Users/gohard/x-ray-analytics`:

```bash
npm install
npm run dev
```

Then open the printed `http://localhost:5173` URL in your browser.

### Build for production

```bash
npm run build
npm run preview
```

### Deploy (Vercel example)

1. Push this folder to a Git repo (e.g. GitHub).
2. In the Vercel dashboard, “Add New Project” and import that repo.
3. Framework preset: **Vite**, build command: `npm run build`, output directory: `dist`.
4. Vercel will build and give you a live URL.


