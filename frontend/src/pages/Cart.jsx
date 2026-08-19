import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { api } from "../api";

const formatPrice = (cents) => `$${(cents / 100).toFixed(2)}`;

export default function Cart() {
  const { items, removeItem, setQuantity, totalCents } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setError("");
    setLoading(true);
    try {
      const payload = items.map((i) => ({ slug: i.slug, quantity: i.quantity }));
      const { url } = await api.createCheckoutSession(payload);
      window.location.href = url;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <section className="max-w-2xl mx-auto px-6 pt-16 pb-24 text-center">
        <p className="text-[var(--color-gold-dim)] mb-4">Your cart is empty.</p>
        <Link to="/" className="btn-gold inline-block px-6 py-2.5 uppercase tracking-widest text-sm">
          Browse records
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-2xl mx-auto px-6 pt-16 pb-24">
      <h1 className="font-[var(--font-display)] text-3xl mb-8">Your cart.</h1>

      {error && <p className="text-[var(--color-red)] text-sm mb-4">{error}</p>}

      <div className="flex flex-col gap-4 mb-8">
        {items.map((item) => (
          <div key={item.slug} className="card p-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-[var(--font-display)] text-sm">{item.artist}</p>
              <p className="text-[var(--color-gold-dim)] text-sm">{item.name}</p>
              <p className="tabular text-[var(--color-gold)] text-sm mt-1">{formatPrice(item.price_cents)}</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => setQuantity(item.slug, parseInt(e.target.value) || 1)}
                className="tabular w-16 bg-transparent border border-white/20 px-2 py-1 text-center"
              />
              <button
                onClick={() => removeItem(item.slug)}
                className="text-xs text-[var(--color-red)] uppercase tracking-widest"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-6 mb-8">
        <span className="uppercase tracking-widest text-sm text-[var(--color-gold-dim)]">Total</span>
        <span className="tabular text-2xl text-[var(--color-gold)]">{formatPrice(totalCents)}</span>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="btn-gold w-full py-3.5 uppercase tracking-widest text-sm disabled:opacity-60"
      >
        {loading ? "Redirecting to checkout…" : "Checkout with Stripe"}
      </button>
    </section>
  );
}
