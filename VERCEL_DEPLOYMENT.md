# Vercel Deployment Guide

This guide covers deploying the Resilios app to Vercel (frontend) and optional backend hosting options.

## Quick Start: Frontend-Only Deployment (Recommended for Vercel)

Vercel is designed for frontend hosting. The backend (Python) should be deployed separately to Render, Railway, or similar.

### Step 1: Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub (or create an account)
3. Click "Add New" → "Project"
4. Select the `AI-powered-Resilios` repository
5. Vercel will auto-detect Vite configuration (via `vercel.json`)
6. Click "Deploy"

### Step 2: Configure Environment Variables

After deployment is created, go to **Settings** → **Environment Variables** and add:

```
VITE_PUBLIC_ORIGIN=https://your-app.vercel.app
```

(Note: Frontend doesn't need Gemini key or PayPal credentials; those are server-side only)

### Step 3: Verify Build Settings

Vercel should automatically detect:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Framework**: Vite

If not auto-detected, manually set these in **Settings** → **Build & Development**.

---

## Backend Deployment (Python API)

The Python backend must be deployed separately. Choose one:

### Option A: Render (Recommended)

1. **Go to render.com** → Create account if needed
2. **New Web Service** → Connect GitHub repo
3. **Configure**:
   - **Runtime**: Docker (uses included `Dockerfile`)
   - **Build Command**: Leave empty (Docker will build)
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`

4. **Environment Variables** (in Render dashboard):
   ```
   GEMINI_API_KEY=<your-gemini-key>
   GEMINI_MODEL=gemini-2.5-flash
   PAYPAL_CLIENT_ID=<sandbox-or-live>
   PAYPAL_SECRET=<secret>
   PAYPAL_MODE=sandbox
   STRIPE_SECRET_KEY=<optional-stripe-key>
   STRIPE_WEBHOOK_SECRET=<optional-webhook-secret>
   PUBLIC_ORIGIN=https://your-app.vercel.app
   ```

5. **Deploy** → Render will build Docker image and deploy

### Option B: Railway

1. Go to [railway.app](https://railway.app) → Create account
2. **New Project** → Connect GitHub
3. Select `AI-powered-Resilios` repo
4. Add environment variables (same as Render)
5. Railway auto-detects Python and deploys

### Option C: Local Testing with Backend

To test backend locally before deploying:

```bash
# Install deps
pip install -r requirements.txt

# Set env vars (copy .env.example → .env and fill in values)
# OR export them:
export GEMINI_API_KEY="your-key-here"
export PAYPAL_CLIENT_ID="..."
export PAYPAL_SECRET="..."

# Run server
uvicorn app:app --reload
# Server runs on http://localhost:8000
```

---

## Environment Variables Reference

| Variable | Required | Scope | Notes |
|----------|----------|-------|-------|
| `GEMINI_API_KEY` | Yes (for AI replies) | Backend | Never expose to frontend |
| `GEMINI_MODEL` | No | Backend | Default: `gemini-2.5-flash` |
| `PAYPAL_CLIENT_ID` | Yes (for PayPal) | Backend | Get from PayPal Developer |
| `PAYPAL_SECRET` | Yes (for PayPal) | Backend | Get from PayPal Developer |
| `PAYPAL_MODE` | No | Backend | `sandbox` (testing) or `live` |
| `STRIPE_SECRET_KEY` | No | Backend | Leave empty to disable Stripe |
| `STRIPE_WEBHOOK_SECRET` | No | Backend | For webhook verification |
| `PUBLIC_ORIGIN` | Yes | Backend | Frontend URL (e.g., `https://app.vercel.app`) |
| `TRIAL_DAYS` | No | Backend | Default: `7` |
| `FREE_CHATS_PER_DAY` | No | Backend | Default: `100` |

---

## Testing After Deployment

### Frontend (Vercel)

1. Visit your Vercel deployment URL
2. You should see the Resilios login page
3. If Gemini key not configured, you'll see a yellow warning banner
4. Language selector should work (top-right)
5. Click "Continue with Gmail" to log in

### Backend API (Render/Railway)

Test endpoints from command line:

```bash
BACKEND_URL="https://your-render-app.onrender.com"

# Check if backend is up
curl $BACKEND_URL/mascots

# Test public config
curl $BACKEND_URL/config

# Test chat endpoint (should fail with 402 if no premium)
curl -X POST $BACKEND_URL/chat/send \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test@example.com", "message": "Hello"}'
```

---

## Troubleshooting

### "No Output Directory named 'dist' found" on Vercel

**Solution**: `vercel.json` is already configured. Re-deploy or check that:
- `npm run build` runs successfully locally
- `dist/index.html` exists after build

### Backend gives "No Gemini key configured"

**Solution**: Add `GEMINI_API_KEY` to your Render/Railway environment variables. Restart the service.

### PayPal payments fail with "Client credentials not set"

**Solution**: Ensure `PAYPAL_CLIENT_ID` and `PAYPAL_SECRET` are set in backend environment variables.

### "PUBLIC_ORIGIN mismatch" errors

**Solution**: Set `PUBLIC_ORIGIN` in backend to match your frontend URL (e.g., `https://resilios.vercel.app`).

---

## Continuous Deployment

Both Vercel and Render support automatic deployments on `git push`:

1. Connect GitHub repo (already done if following steps above)
2. Push changes to `main` branch
3. Vercel/Render will auto-rebuild and redeploy

---

## Production Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Render/Railway
- [ ] `GEMINI_API_KEY` set in backend environment (Render/Railway dashboard)
- [ ] `PAYPAL_CLIENT_ID` and `PAYPAL_SECRET` set for live PayPal (or sandbox for testing)
- [ ] `PUBLIC_ORIGIN` set to your frontend URL in backend environment
- [ ] Tested login flow (Gmail)
- [ ] Tested chat send (should work with Gemini key, or show fallback)
- [ ] Tested PayPal subscribe button (if configured)
- [ ] Stripe disabled (no key set) — PayPal is active
- [ ] CI/CD workflows passing (check GitHub Actions)

---

## Notes

- **Frontend is static**: Vercel serves the built `dist/` folder (Vite output)
- **Backend is dynamic**: Render/Railway runs the Python FastAPI server
- **API calls**: Frontend calls backend at the URL in `PUBLIC_ORIGIN` env var
- **Secrets**: Never commit `.env` file; always use deployment platform's environment variable management
- **Scaling**: Vercel handles frontend scaling automatically; Render/Railway scales Python dynos based on traffic

---

For questions or issues, check:
- [Vercel docs](https://vercel.com/docs)
- [Render docs](https://render.com/docs)
- [FastAPI deployment](https://fastapi.tiangolo.com/deployment/)
