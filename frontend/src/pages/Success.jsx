import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Success() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="max-w-lg mx-auto px-6 pt-24 pb-24 text-center">
      <div className="record-badge mx-auto mb-6" style={{ width: "5.5rem", height: "5.5rem" }}>
        <span>✓</span>
      </div>
      <h1 className="font-[var(--font-display)] text-3xl mb-3">Order placed.</h1>
      <p className="text-[var(--color-gold-dim)] mb-8">
        Thanks for your order. A confirmation has been sent to your email.
        {sessionId && (
          <span className="block mt-2 text-xs opacity-70">Reference: {sessionId.slice(0, 24)}…</span>
        )}
      </p>
      <Link to="/" className="btn-gold inline-block px-8 py-3 uppercase tracking-widest text-sm">
        Continue shopping
      </Link>
    </section>
  );
}
