# LyricSearch

Find songs by lyrics or phrases, filter by artist, and sort by popularity or other factors. Modern, responsive UI built with Next.js 14, TypeScript, and Tailwind CSS.

## Prerequisites
- Node.js 18+
- AudD API token (required) — [Sign up here](https://dashboard.audd.io/)
- Spotify Client ID and Secret (optional, for popularity enrichment) — [Get credentials](https://developer.spotify.com/dashboard)

## Setup
1. Copy `.env.local.example` to `.env.local` and fill in values.
2. Install dependencies: `npm install`
3. Run the dev server: `npm run dev`

## Environment Variables
- `AUDD_API_TOKEN` (required) — AudD API token from your dashboard
- `SPOTIFY_CLIENT_ID` (optional) — Spotify client ID for popularity enrichment
- `SPOTIFY_CLIENT_SECRET` (optional) — Spotify client secret

## Deployment to Vercel

### Quick Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/LyricSearch)

### Manual Deployment Steps
1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Vercel Dashboard** (recommended):
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure environment variables in project settings:
     - `AUDD_API_TOKEN` — Your AudD API token
     - `SPOTIFY_CLIENT_ID` — Your Spotify client ID (optional)
     - `SPOTIFY_CLIENT_SECRET` — Your Spotify client secret (optional)
   - Click "Deploy"

3. **Deploy via CLI** (alternative):
   ```bash
   vercel
   ```
   Then add environment variables:
   ```bash
   vercel env add AUDD_API_TOKEN
   vercel env add SPOTIFY_CLIENT_ID
   vercel env add SPOTIFY_CLIENT_SECRET
   ```

### After Deployment
- Your app will be live at `https://your-project.vercel.app`
- Update Spotify redirect URI to `https://your-project.vercel.app` (though it's not used by the app)
- Vercel automatically provisions HTTPS and handles deployments on every push

## Run
- Dev server: npm run dev
- Build: npm run build
- Start: npm run start
- Lint: npm run lint
- Typecheck: npm run typecheck

## Notes
- Requests are proxied via `/api/search` to avoid exposing keys.
- Popularity sorting requires Spotify credentials; otherwise it gracefully falls back.
- Respect AudD and Spotify rate limits.