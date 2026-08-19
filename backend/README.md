# Wavelength Records — Backend

Django REST Framework API for a vinyl record storefront. Product catalog, Stripe Checkout Session creation, and a webhook that marks orders as paid.

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/products/` | List active products (filter with `?genre=` or `?format=`) |
| GET | `/api/products/<slug>/` | Single product |
| POST | `/api/checkout/create-session/` | Body: `{"items": [{"slug": "...", "quantity": 2}]}`. Returns `{"url": "..."}` — redirect the browser here. |
| POST | `/api/webhooks/stripe/` | Stripe calls this on `checkout.session.completed` to mark an Order as paid. |
| GET | `/api/health/` | Health check |
| `/admin/` | Django admin — manage products and view orders |

Prices are always looked up server-side from the database — the client only ever sends product slugs and quantities, never prices, so nobody can tamper with checkout totals from the browser.

## Local setup

```bash
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py seed_products    # adds 6 sample records so the shop isn't empty
python manage.py createsuperuser  # for /admin/ access
python manage.py runserver 8002
```

Falls back to local SQLite if `DATABASE_URL` isn't set — fine for local dev.

## Stripe setup (test mode)

1. Create a free account at [stripe.com](https://stripe.com) if you don't have one.
2. Dashboard → Developers → API keys → copy the **test mode** Secret key (`sk_test_...`) into `STRIPE_SECRET_KEY`.
3. To test webhooks locally, install the [Stripe CLI](https://stripe.com/docs/stripe-cli), then run:
   ```bash
   stripe listen --forward-to localhost:8002/api/webhooks/stripe/
   ```
   It prints a webhook signing secret (`whsec_...`) — put that in `STRIPE_WEBHOOK_SECRET`.
4. Use [Stripe's test card numbers](https://stripe.com/docs/testing) (e.g. `4242 4242 4242 4242`, any future expiry, any CVC) to complete a test checkout.

## Deploying free

1. **Database — Neon**: same as TaskFlow API — free serverless Postgres, copy the connection string into `DATABASE_URL`.
2. **API — Render**: New → Web Service → root directory `backend`. Render will detect `render.yaml` and use its build/start commands. Add env vars: `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=False`, `ALLOWED_HOSTS` (your Render domain), `DATABASE_URL`, `CORS_ALLOWED_ORIGINS` (your frontend URL), `CLIENT_URL` (your frontend URL), `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.
3. In the Stripe dashboard (once live), add a webhook endpoint pointing to `https://your-api.onrender.com/api/webhooks/stripe/`, listening for `checkout.session.completed` — this replaces the local `stripe listen` command once deployed.
