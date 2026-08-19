import stripe
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status as http_status
from catalog.models import Product
from .models import Order

stripe.api_key = settings.STRIPE_SECRET_KEY


class CreateCheckoutSessionView(APIView):
    """
    Accepts a cart: [{ "slug": "...", "quantity": 2 }, ...]
    Looks up real prices server-side (never trusts client-sent prices),
    creates a Stripe Checkout Session, and returns its redirect URL.
    """

    def post(self, request):
        cart = request.data.get("items", [])
        if not cart:
            return Response({"error": "Cart is empty."}, status=http_status.HTTP_400_BAD_REQUEST)

        line_items = []
        snapshot = []

        for entry in cart:
            slug = entry.get("slug")
            quantity = max(1, int(entry.get("quantity", 1)))
            try:
                product = Product.objects.get(slug=slug, is_active=True)
            except Product.DoesNotExist:
                return Response(
                    {"error": f"Product '{slug}' not found."}, status=http_status.HTTP_400_BAD_REQUEST
                )

            line_items.append(
                {
                    "price_data": {
                        "currency": "usd",
                        "product_data": {"name": f"{product.artist} — {product.name}"},
                        "unit_amount": product.price_cents,
                    },
                    "quantity": quantity,
                }
            )
            snapshot.append(
                {
                    "slug": product.slug,
                    "name": product.name,
                    "artist": product.artist,
                    "quantity": quantity,
                    "unit_price_cents": product.price_cents,
                }
            )

        try:
            session = stripe.checkout.Session.create(
                mode="payment",
                line_items=line_items,
                success_url=f"{settings.CLIENT_URL}/success?session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url=f"{settings.CLIENT_URL}/cart",
            )
        except stripe.error.StripeError as e:
            return Response({"error": str(e)}, status=http_status.HTTP_502_BAD_GATEWAY)

        Order.objects.create(
            stripe_session_id=session.id,
            status="pending",
            line_items=snapshot,
        )

        return Response({"url": session.url})


@method_decorator(csrf_exempt, name="dispatch")
class StripeWebhookView(APIView):
    """
    Listens for checkout.session.completed and marks the matching Order as paid.
    Register this URL in the Stripe dashboard (or via the Stripe CLI for local testing).
    """

    def post(self, request):
        payload = request.body
        sig_header = request.META.get("HTTP_STRIPE_SIGNATURE", "")

        try:
            event = stripe.Webhook.construct_event(payload, sig_header, settings.STRIPE_WEBHOOK_SECRET)
        except (ValueError, stripe.error.SignatureVerificationError):
            return HttpResponse(status=400)

        if event["type"] == "checkout.session.completed":
            session = event["data"]["object"]
            try:
                order = Order.objects.get(stripe_session_id=session["id"])
                order.status = "paid"
                order.customer_email = session.get("customer_details", {}).get("email", "") or ""
                order.amount_total_cents = session.get("amount_total") or 0
                order.save()
            except Order.DoesNotExist:
                pass

        return HttpResponse(status=200)
