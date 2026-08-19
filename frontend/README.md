# Wavelength Records — Frontend

React (Vite) storefront. Product grid, genre filter, cart (persisted to localStorage), and checkout via Stripe's hosted Checkout page.

## Local setup

```bash
npm install
cp .env.example .env   # set VITE_API_URL to your backend URL
npm run dev
```

Visit `http://localhost:5175`.

## Deploying free on Vercel

Same pattern as the other projects: import the repo, root directory `frontend`, framework preset Vite, add env var `VITE_API_URL` pointing to your deployed backend. Update the backend's `CORS_ALLOWED_ORIGINS` and `CLIENT_URL` to match your Vercel URL afterward.
