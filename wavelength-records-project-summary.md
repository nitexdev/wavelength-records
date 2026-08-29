# Project Summary: Wavelength Records

Use this as context when starting a new chat about this project — paste it in or attach it.

## What it is
A vinyl record storefront — product catalog, cart, and real Stripe checkout (test mode) — built as portfolio piece #4 of 6 for an Upwork developer profile targeting web development and design projects. Demonstrates a Django REST Framework backend paired with a React frontend, plus a genuine payment-processing integration, which is one of the most commonly requested freelance skills.

## Stack
- **Backend:** Django 5.1 + Django REST Framework + PostgreSQL (via `psycopg` v3) + Stripe SDK
- **Frontend:** React (Vite) + Tailwind CSS v4 + React Router
- **Database:** Neon (free serverless Postgres)
- **Hosting:** Render (backend), Vercel (frontend)
- **Payments:** Stripe Checkout (hosted payment page, test mode)
- **Repo:** GitHub — `nitexdev/wavelength-records`

## Design direction
Bold, graphic vinyl-record aesthetic — deep ink navy (`#12142B`) background, warm gold (`#E0B23C`) accent, Archivo Black display headlines, tabular monospace pricing. Signature elements: a circular "record label" price badge on every product, and a custom-drawn spinning vinyl-record SVG (concentric grooves + label) used as the placeholder wherever a product has no real cover image — it spins slowly at rest and speeds up on hover.

## Live URLs
- Shop: `https://wavelength-records.vercel.app`
- API: `https://wavelength-records.onrender.com` (health check at `/api/health/`)
- Admin: `https://wavelength-records.onrender.com/admin/` (Django admin — manage products, view orders)

## How the code is organized

```
wavelength-records/
  backend/
    config/            Django project settings, root urls.py
    catalog/            Product model, serializer, read-only ViewSet, admin registration
      management/commands/seed_products.py   Seeds 6 sample records for local/demo use
    orders/              Order model, checkout session + webhook views
    render.yaml          Render build/start command hints (Render didn't auto-detect this in practice — commands were entered manually in the dashboard instead)
  frontend/
    src/
      api.js             Thin fetch wrapper around the Django API
      context/CartContext.jsx   Cart state, persisted to localStorage (no backend cart needed)
      components/
        ProductCard.jsx
        VinylPlaceholder.jsx    Custom SVG record graphic used when no product image exists
        Navbar.jsx
      pages/
        Shop.jsx           Hero section + genre-filterable product grid
        ProductDetail.jsx
        Cart.jsx            Triggers checkout session creation, redirects to Stripe
        Success.jsx         Post-payment landing page, clears the cart
```

## How checkout actually works (important pattern)
1. Cart lives entirely client-side (localStorage) — no login or backend cart needed to shop.
2. On checkout, the **frontend only ever sends product slugs + quantities** to the backend — never prices.
3. The backend (`orders/views.py` → `CreateCheckoutSessionView`) looks up real prices from the database itself, builds Stripe line items server-side, and creates a Stripe Checkout Session. This matters: it means a malicious client can't tamper with prices by editing browser requests.
4. The browser is redirected to Stripe's own hosted payment page (never touches raw card data).
5. After payment, Stripe redirects the browser back to `/success` AND separately calls a webhook (`StripeWebhookView`) that marks the matching `Order` row as `paid` in the database — so the order record is trustworthy even if the customer closes the tab before the redirect completes.

## Environment variables
**Render (backend):** `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=False`, `ALLOWED_HOSTS` (real Render domain), `DATABASE_URL` (Neon connection string), `CORS_ALLOWED_ORIGINS` + `CLIENT_URL` (real Vercel URL), `STRIPE_SECRET_KEY` (real `sk_test_...`), `STRIPE_WEBHOOK_SECRET`
**Vercel (frontend):** `VITE_API_URL` (real Render URL)
**Local `.env` (backend):** same shape, pointed at local/dev values; falls back to SQLite if `DATABASE_URL` isn't set at all

## Deployment process (what actually happened, in order)
1. Reinstalled Git for Windows first to fix the recurring Credential Manager error from every prior project — pushing to GitHub finally worked via normal browser login, no more token-in-URL workaround needed.
2. Created a free Neon Postgres project, copied the connection string into local `.env`.
3. `pip install -r requirements.txt` inside a venv, then `python manage.py migrate` — initially hit a `ConnectionTimeout` reaching Neon.
4. Created a Render Web Service pointed at `backend/` as root directory. Render did **not** auto-detect `render.yaml` — build/start commands had to be entered manually in the dashboard:
   - Build: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
   - Start: `gunicorn config.wsgi:application`
5. Set environment variables on Render (placeholder Stripe keys initially, real Postgres URL).
6. First deploy succeeded but returned `400 Bad Request` on every request — fixed by setting `ALLOWED_HOSTS` to the real `.onrender.com` domain after Render revealed it.
7. Deployed frontend to Vercel (root directory `frontend`, `VITE_API_URL` pointed at the live Render API).
8. Shop page loaded but showed "No records found" — a CORS mismatch, fixed by updating `CORS_ALLOWED_ORIGINS` and `CLIENT_URL` on Render to the real Vercel URL.
9. Added `vercel.json` SPA rewrite proactively (learned from Anchor Studio's `/admin` 404 issue) so direct loads of `/records/:slug` or `/cart` wouldn't 404.
10. Checkout button failed with a Stripe "no API key provided" error — fixed by swapping the placeholder `STRIPE_SECRET_KEY` for a real Stripe test-mode secret key.
11. Full checkout flow tested successfully with Stripe's `4242 4242 4242 4242` test card.

## Notable issues hit & fixed
- **`ConnectionTimeout` connecting to Neon from the local machine** — same root cause as the earlier Firebase/Firestore connectivity issues on Anchor Studio: an ISP/network-level block, not a credentials or code problem (a real auth failure would have shown an authentication error, not a timeout). Fixed the same way — turning on a VPN. Notably, Render's own servers connected to Neon without any VPN, confirming the block was specific to the local network, not Neon itself.
- **`ALLOWED_HOSTS` 400 errors immediately after first deploy** — Django rejects requests from hosts not in this list by default; had to add the real Render-assigned domain after the fact.
- **CORS blocking the live frontend from reaching the API** — `CORS_ALLOWED_ORIGINS`/`CLIENT_URL` were still pointed at `localhost:5175` after the Vercel deploy; updating both to the real Vercel URL fixed it.
- **Stripe checkout failing with "You did not provide an API key"** — `STRIPE_SECRET_KEY` was still the literal placeholder text from `.env.example`; swapped for a real `sk_test_...` key from the Stripe dashboard.
- **Render didn't auto-detect `render.yaml`** — had to manually paste the build/start commands into Render's dashboard fields instead of relying on the file being picked up automatically.
- Same exposed GitHub PAT / Neon DB password pattern as other projects — Neon password was pasted in plaintext in chat and flagged for rotation.

## Design/UX iteration
After initial deploy, the storefront felt visually flat — empty product placeholders (plain circle), no hero section, minimal hover feedback. Fixed by:
- Adding a hero section (headline + tagline + large vinyl graphic) above the shop grid
- Building a custom `VinylPlaceholder` SVG component (concentric grooves + gold label) to replace the bare circle everywhere a product lacks a real image — it idles with a slow 40s rotation and speeds up to 3s on hover
- Adding card hover states (lift + border glow, artist name shifts to gold)

## Status
✅ Complete — built, tested locally and live end-to-end (including a real Stripe test-mode payment), deployed on Render + Vercel + Neon, on GitHub.

## Outstanding items
- Product images are still placeholders (the vinyl graphic) rather than real cover art — could be swapped for real/stock images the same way Anchor Studio's gallery was.
- Stripe webhook (`STRIPE_WEBHOOK_SECRET`) — confirm this is wired to a real Stripe webhook endpoint pointing at the live Render URL (`/api/webhooks/stripe/`) in the Stripe dashboard, not just left as a placeholder, so `Order` records actually flip to `paid` in production, not just during local `stripe listen` testing.
- Confirm the earlier-flagged Neon database password (pasted in plaintext in chat) has been rotated.
