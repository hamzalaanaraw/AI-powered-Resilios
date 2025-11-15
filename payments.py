import os
import stripe
import logging
import requests
from typing import Tuple, Optional
from user_store import set_premium

logger = logging.getLogger("payments")


def get_public_origin() -> str:
    return os.getenv("PUBLIC_ORIGIN", "http://localhost:3000")


def create_stripe_checkout_session(user_id: str, price_cents: int = 499) -> str:
    """Create a Stripe Checkout session and return the session URL.

    - `price_cents` is an integer in cents (e.g., 499 → $4.99 USD).
    """
    stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
    if not stripe.api_key:
        raise RuntimeError("STRIPE_SECRET_KEY not configured on server")

    origin = get_public_origin()
    success_url = f"{origin}/?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin}/?canceled=true"

    # Create a recurring price on-the-fly for a monthly $4.99 subscription.
    # Note: In production it's better to create a Price in the Stripe dashboard and use its id.
    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        mode="subscription",
        line_items=[
            {
                "price_data": {
                    "currency": "usd",
                    "product_data": {"name": "Live Avatar — Premium Access"},
                    "unit_amount": price_cents,
                    "recurring": {"interval": "month"},
                },
                "quantity": 1,
            }
        ],
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={"user_id": user_id},
    )

    return session.url


def handle_stripe_event(event: dict) -> Tuple[bool, str]:
    """Handle a parsed Stripe event dict. Returns (handled, message)."""
    etype = event.get("type")
    logger.info("Stripe event: %s", etype)
    if etype == "checkout.session.completed":
        session = event.get("data", {}).get("object", {})
        metadata = session.get("metadata", {}) or {}
        user_id = metadata.get("user_id")
        if user_id:
            # mark user as premium (no expiration in this demo)
            set_premium(user_id, True, None)
            return True, f"User {user_id} marked premium via Stripe"
        else:
            return False, "No user_id in session metadata"

    return False, f"Unhandled event type: {etype}"


# -------- PayPal integration (basic) --------

def _paypal_base() -> str:
    mode = os.getenv("PAYPAL_MODE", "sandbox")
    if mode == "live":
        return "https://api-m.paypal.com"
    return "https://api-m.sandbox.paypal.com"


def _paypal_auth_token() -> str:
    client = os.getenv("PAYPAL_CLIENT_ID")
    secret = os.getenv("PAYPAL_SECRET")
    if not client or not secret:
        raise RuntimeError("PayPal client credentials not set")

    url = f"{_paypal_base()}/v1/oauth2/token"
    r = requests.post(url, data={"grant_type": "client_credentials"}, auth=(client, secret), timeout=10)
    r.raise_for_status()
    return r.json()["access_token"]


def create_paypal_order(user_id: str, amount: str = "4.99") -> dict:
    """Create a PayPal order and return the approval link and order id."""
    token = _paypal_auth_token()
    url = f"{_paypal_base()}/v2/checkout/orders"
    origin = get_public_origin()
    payload = {
        "intent": "CAPTURE",
        "purchase_units": [{"amount": {"currency_code": "USD", "value": amount}}],
        "application_context": {
            "return_url": f"{origin}/paypal-success",
            "cancel_url": f"{origin}/paypal-cancel",
        },
    }
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    r = requests.post(url, json=payload, headers=headers, timeout=10)
    r.raise_for_status()
    data = r.json()
    approve = None
    for link in data.get("links", []):
        if link.get("rel") == "approve":
            approve = link.get("href")
    return {"order": data, "approve_url": approve}


def capture_paypal_order(order_id: str, user_id: Optional[str] = None) -> dict:
    token = _paypal_auth_token()
    url = f"{_paypal_base()}/v2/checkout/orders/{order_id}/capture"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    r = requests.post(url, headers=headers, timeout=10)
    r.raise_for_status()
    data = r.json()
    # On successful capture, mark user premium
    status = data.get("status")
    if status and status.upper() in ("COMPLETED", "COMPLETED_WITH_PENDING_SETTLEMENT"):
        if user_id:
            set_premium(user_id, True, None)
    return data
