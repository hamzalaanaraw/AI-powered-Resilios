# Deployment Guide

## Frontend (Vercel)

The frontend is already deployed to Vercel. Configuration is in `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

**Status:** Live at `https://ai-powered-resilios-git-main-hamzas-projects-0a88cbb8.vercel.app`

---

## Backend (Render)

Deploy the FastAPI backend to Render using Docker.

### Steps

1. **Create a Render Web Service**
   - Go to https://render.com
   - Click **New +** → **Web Service**
   - Connect your GitHub repo `hamzalaanaraw/AI-powered-Resilios`
   - Select the repo and branch (`main`)

2. **Configure the service:**
   - **Name:** `ai-powered-resilios-backend`
   - **Environment:** Docker
   - **Build Command:** (leave empty; uses Dockerfile)
   - **Start Command:** `uvicorn app:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Starter (free tier available)

3. **Set Environment Variables** (in Render dashboard):
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook signing secret
   - `PAYPAL_CLIENT_ID`: Your PayPal client ID
   - `PAYPAL_SECRET`: Your PayPal secret
   - `PAYPAL_MODE`: `sandbox` or `live`
   - `PUBLIC_ORIGIN`: Your frontend URL (e.g., `https://ai-powered-resilios-git-main-hamzas-projects-0a88cbb8.vercel.app`)

4. **Deploy:**
   - Click **Create Web Service**
   - Render will build and deploy the Docker image
   - Your backend will be live at `https://ai-powered-resilios-backend.onrender.com` (or your custom domain)

### Webhook Configuration (Stripe)

Once the backend is live:

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add an endpoint**
3. **Endpoint URL:** `https://<your-backend-url>/stripe/webhook`
4. **Events to send:** Select `checkout.session.completed` and `customer.subscription.updated`
5. Copy the **Signing Secret** and add it to Render as `STRIPE_WEBHOOK_SECRET`

---

## Environment Variables Summary

### Frontend (Vercel)
No secrets needed in frontend (keys are server-side only).

### Backend (Render)
```
GEMINI_API_KEY=<your-api-key>
STRIPE_SECRET_KEY=<stripe-secret>
STRIPE_WEBHOOK_SECRET=<stripe-webhook-secret>
PAYPAL_CLIENT_ID=<paypal-client-id>
PAYPAL_SECRET=<paypal-secret>
PAYPAL_MODE=sandbox|live
PUBLIC_ORIGIN=https://your-frontend-domain.com
```

---

## Testing Locally

### Backend
```bash
source .venv/bin/activate
export GEMINI_API_KEY="your-key-here"
uvicorn app:app --reload --port 8000
```

### Frontend
```bash
npm run dev
# opens http://localhost:5173
```

---

## Monitoring

- **Frontend:** Vercel Dashboard (auto-deploys on push to `main`)
- **Backend:** Render Dashboard (auto-deploys on push to `main` if connected)

