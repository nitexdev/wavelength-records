# Wavelength Records

A vinyl record storefront — product catalog, cart, and Stripe checkout (test mode). Built to demonstrate a Django REST Framework backend paired with a React frontend, plus a real payment integration pattern.

**Stack:** Django + Django REST Framework + PostgreSQL (backend) · React (Vite) + Tailwind CSS v4 (frontend) · Stripe Checkout for payment.

## Structure

```
wavelength-records/
  backend/    Django REST API — see backend/README.md
  frontend/   React storefront — see frontend/README.md
```

## How checkout works

1. Cart lives entirely in the browser (localStorage) — no account needed to shop.
2. On checkout, the frontend sends only product slugs + quantities to the backend.
3. The backend looks up real prices from the database (never trusts the client), creates a Stripe Checkout Session, and returns Stripe's hosted payment page URL.
4. The browser redirects to Stripe. After payment, Stripe redirects back to `/success` and also calls a webhook that marks the order "paid" in the database — so the order record is trustworthy even if the customer closes the tab before returning.

## Quick start (local)

```bash
# Terminal 1
cd backend && python -m venv venv && source venv/bin/activate
pip install -r requirements.txt && cp .env.example .env
python manage.py migrate && python manage.py seed_products
python manage.py runserver 8002

# Terminal 2
cd frontend && npm install && cp .env.example .env
npm run dev
```

See `backend/README.md` for Stripe test-mode setup (needed for checkout to actually work), and both READMEs for free deployment steps (Render + Neon for backend, Vercel for frontend).
