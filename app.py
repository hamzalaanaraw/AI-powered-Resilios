from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from mascot_manager import get_random_mascot, list_mascots
import os
from pydantic import BaseModel
from typing import Optional
from chat_store import add_message, get_history, count_user_messages_today
import logging
from fastapi import Request
import stripe
from payments import (
    create_stripe_checkout_session,
    handle_stripe_event,
    create_paypal_order,
    capture_paypal_order,
)
from user_store import set_premium, is_premium
from dotenv import load_dotenv
from fastapi.staticfiles import StaticFiles

load_dotenv()


logger = logging.getLogger("uvicorn")

app = FastAPI(title="Mascot API")

# Serve a `media/` folder at the `/media` route so you can drop avatar videos and images there.
media_dir = os.path.join(os.path.dirname(__file__), "media")
if not os.path.exists(media_dir):
    os.makedirs(media_dir, exist_ok=True)
app.mount("/media", StaticFiles(directory=media_dir), name="media")


@app.get("/mascots")
def all_mascots():
    files = list_mascots()
    return JSONResponse({"count": len(files), "files": files})


@app.get("/mascot/random")
def random_mascot():
    path = get_random_mascot()
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Mascot not found")
    return FileResponse(path)


@app.get("/mascot/{index}")
def mascot_index(index: int):
    files = list_mascots()
    if index < 0 or index >= len(files):
        raise HTTPException(status_code=404, detail="Index out of range")
    return FileResponse(files[index])


# ---- Chat endpoints ----


class ChatRequest(BaseModel):
    user_id: str
    message: str
    session_id: Optional[str] = None


def apply_safety_checks(text: str) -> bool:
    """Very small placeholder safety check. Extend with a proper moderation system.

    Returns True if text is allowed, False if blocked.
    """
    banned = ["bomb", "kill", "suicide", "terrorism", "child sexual"]
    txt = text.lower()
    for b in banned:
        if b in txt:
            return False
    return True


def call_gemini(prompt: str) -> str:
    """Placeholder server-side Gemini call.

    This function reads `GEMINI_API_KEY` from the environment and should
    perform the model request from the server so the key is never exposed
    to the browser. Currently it returns a canned reply if the key is missing.

    Replace this implementation with the official Google GenAI client or
    an HTTP call to the GenAI endpoint.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        logger.warning("GEMINI_API_KEY not set — returning fallback reply")
        return "(No Gemini API key configured on server — reply unavailable.)"

    # Server-side call to Google Generative Language REST API (text generation)
    # This implementation uses the REST endpoint and requires that you set
    # GEMINI_API_KEY in the environment (do NOT commit the key to the repo).
    # NOTE: The exact REST path and auth method may vary depending on your
    # Google GenAI account configuration. Adjust the endpoint and parsing
    # logic per the GenAI REST API docs for your account.
    try:
        import requests
        # Example endpoint for text generation (may need to be adjusted):
        url = os.getenv("GEMINI_API_URL") or "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generate"
        headers = {"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"}
        payload = {"prompt": {"text": prompt}, "temperature": 0.7}
        resp = requests.post(url, json=payload, headers=headers, timeout=20)
        resp.raise_for_status()
        data = resp.json()
        # Parse best-effort depending on response shape
        if isinstance(data, dict):
            # Common shapes: 'candidates' or 'output'
            if "candidates" in data and len(data["candidates"])>0:
                return data["candidates"][0].get("output", data["candidates"][0].get("text", ""))
            if "output" in data:
                return data["output"]
            # Fallback to full text content
            return str(data)
    except Exception as e:
        logger.exception("Gemini call failed")
        return "(Model call failed; try again later.)"


@app.post("/chat/send")
def chat_send(req: ChatRequest):
    # Enforce free-tier quota: 100 chats per day for non-premium users
    FREE_DAILY_QUOTA = 100
    try:
        if not is_premium(req.user_id):
            used = count_user_messages_today(req.user_id)
            if used >= FREE_DAILY_QUOTA:
                raise HTTPException(status_code=402, detail="Free daily quota exceeded. Upgrade to premium for unlimited access.")
    except HTTPException:
        raise
    except Exception:
        # On error counting usage, log and allow the request (fail-open)
        logger.exception("Error checking user quota")

    if not apply_safety_checks(req.message):
        raise HTTPException(status_code=400, detail="Message blocked by safety policy")

    # Persist user message
    add_message(req.user_id, "user", req.message)

    # Call server-side model (Gemini) — implementation is server-side only
    reply = call_gemini(req.message)

    # Persist assistant reply
    add_message(req.user_id, "assistant", reply)

    return {"reply": reply}


@app.get("/chat/history/{user_id}")
def chat_history(user_id: str, limit: int = 200):
    history = get_history(user_id, limit=limit)
    return {"count": len(history), "messages": history}


# ---- Payment endpoints ----


class CreateSessionRequest(BaseModel):
    user_id: str


@app.post("/create-checkout-session")
def create_checkout(req: CreateSessionRequest):
    try:
        url = create_stripe_checkout_session(req.user_id)
        return {"url": url}
    except Exception as e:
        logger.exception("Failed to create Stripe session")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/stripe/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig = request.headers.get("stripe-signature")
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
    if not webhook_secret:
        # If no webhook secret configured, attempt to parse event directly (unsafe)
        event = None
        try:
            import json

            event = json.loads(payload)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid payload")
    else:
        try:
            event = stripe.Webhook.construct_event(payload, sig, webhook_secret)
        except Exception as e:
            logger.exception("Stripe webhook signature verification failed")
            raise HTTPException(status_code=400, detail=str(e))

    handled, msg = handle_stripe_event(event)
    return {"handled": handled, "message": msg}


class PayPalCreateRequest(BaseModel):
    user_id: str
    amount: Optional[str] = "4.99"


@app.post("/paypal/create-order")
def paypal_create(req: PayPalCreateRequest):
    try:
        data = create_paypal_order(req.user_id, amount=req.amount)
        return data
    except Exception as e:
        logger.exception("PayPal create order failed")
        raise HTTPException(status_code=500, detail=str(e))


class PayPalCaptureRequest(BaseModel):
    order_id: str
    user_id: Optional[str]


@app.post("/paypal/capture-order")
def paypal_capture(req: PayPalCaptureRequest):
    try:
        result = capture_paypal_order(req.order_id, req.user_id)
        return result
    except Exception as e:
        logger.exception("PayPal capture failed")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/user/{user_id}/premium")
def check_premium(user_id: str):
    return {"user_id": user_id, "is_premium": is_premium(user_id)}


@app.get("/config")
def get_public_config():
    """Return non-sensitive public config for the frontend (e.g., PayPal client id).

    Do NOT return secrets like Stripe secret keys or Gemini keys.
    """
    return {
        "paypalClientId": os.getenv("PAYPAL_CLIENT_ID", ""),
        "publicOrigin": os.getenv("PUBLIC_ORIGIN", "http://localhost:3000"),
    }
