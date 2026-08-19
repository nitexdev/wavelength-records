from django.urls import path
from .views import CreateCheckoutSessionView, StripeWebhookView

urlpatterns = [
    path("checkout/create-session/", CreateCheckoutSessionView.as_view(), name="create-checkout-session"),
    path("webhooks/stripe/", StripeWebhookView.as_view(), name="stripe-webhook"),
]
