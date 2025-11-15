<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1xzWj2Knl1IELoTD18ibA3hP2TiYzHh82

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy (GitHub Pages)

This repository includes a GitHub Actions workflow that will build the app and deploy the generated `dist` folder to GitHub Pages whenever you push to the `main` branch.

Steps to enable deployment:

- Go to the repository Settings → Pages and ensure the site is served from the `gh-pages` branch (the action will create/update this branch automatically).
- Push to `main` and monitor Actions → Build and deploy to GitHub Pages.

If you prefer to deploy with Vercel or Netlify, connect the repo in the chosen platform and set the build command to `npm run build` and publish directory to `dist`.

## Mascot Assets and API (Python)

This project now includes a lightweight mascot system:

- `mascots/` — placeholder mascot SVG assets (6 files)
- `mascot_manager.py` — Python helper to list and pick mascots
- `app.py` — FastAPI app to serve mascots via HTTP
- `ui.py` — Streamlit demo to preview mascots locally
- `mascot_tags.json` — example themed tags

How to run the mascot API (requires Python 3.11+ recommended):

1. Create and activate a virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate
```

2. Install minimal dependencies:

```bash
pip install fastapi uvicorn streamlit
```

3. Run the API:

```bash
uvicorn app:app --reload --port 8000
```

Endpoints:

- `GET /mascots` — list all assets (JSON with count & file paths)
- `GET /mascot/random` — returns a random mascot (FileResponse)
- `GET /mascot/{index}` — returns mascot at index (FileResponse)

4. (Optional) Run the Streamlit demo in another shell:

```bash
streamlit run ui.py
```

Advanced: use `mascot_tags.json` and a helper to select by tag (see `mascot_manager.py`).

## Media (custom visuals)

If you have a media package (videos, images) you'd like the app to use for the live avatar or other visuals, place them in the project's `media/` folder. The backend serves files under `/media`.

Recommended filenames:

- `media/avatar_idle.mp4`
- `media/avatar_speaking.mp4`
- `media/avatar_thumb.png`

After adding files, you can access them at `https://<your-domain>/media/avatar_idle.mp4` once the backend is deployed.

## Pricing and Free Tier

- Free tier: every user gets up to **100 chat messages per UTC day** for free. Other features (viewing mascots, wellness plan editing, basic UI features) remain free.
- Premium: **$4.99 / month** — grants unlimited access to the Live Avatar feature and removes the daily chat limit.

How it works:

- The backend enforces the free-tier quota server-side; non-premium users who exceed 100 chat messages in a UTC day will receive a `402` response indicating they should upgrade.
- Payments are handled server-side. Stripe Checkout is used to create a monthly subscription (if you provide `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`) and on successful checkout the server marks the user as premium.
- PayPal flow is included for order-based flows (captures will mark user premium in this demo).

You can test the premium flow locally by manually setting the demo user premium:

```bash
source .venv/bin/activate
python - <<'PY'
from user_store import set_premium
set_premium('demo-user-123', True)
print('Demo user set as premium.')
PY
```



### Server-side Gemini usage and keeping keys private

- Never put `GEMINI_API_KEY` into frontend source or build-time `define` values. The frontend should call server-side endpoints which hold secrets.
- Use environment variables or your platform's secret store (e.g., GitHub Secrets, Vercel env vars, Render secrets) to set `GEMINI_API_KEY`.
- In this repo the front-end `vite.config.ts` was updated to NOT expose the API key. The FastAPI app reads `GEMINI_API_KEY` from the server environment and performs model calls server-side.

If you deploy with GitHub Actions, add the secret in Settings → Secrets as `GEMINI_API_KEY` and configure your backend deployment to read it from the environment.

### Chat history & safety

- The server persists chat history in a SQLite DB (`chats.sqlite3`) via `chat_store.py` for later analysis. Use `chat_store.export_history_jsonl()` to export conversation logs.
- A basic `apply_safety_checks` filter is included as an example. Replace this with a robust moderation pipeline (use a moderation model or rules engine) before production.

