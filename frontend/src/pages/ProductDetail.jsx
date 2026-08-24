import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";
import { useCart } from "../context/CartContext";
import VinylPlaceholder from "../components/VinylPlaceholder";

const formatPrice = (cents) => `$${(cents / 100).toFixed(2)}`;

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    setLoading(true);
    setAdded(false);
    api
      .getProduct(slug)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p className="max-w-4xl mx-auto px-6 py-16 text-[var(--color-gold-dim)]">Loading…</p>;
  if (!product) return <p className="max-w-4xl mx-auto px-6 py-16 text-[var(--color-gold-dim)]">Record not found.</p>;

  return (
    <section className="max-w-4xl mx-auto px-6 pt-16 pb-24 grid md:grid-cols-2 gap-10">
      <div className="aspect-square bg-[var(--color-ink-soft)] flex items-center justify-center">
        {product.image_url ? (
          <img src={product.image_url} alt={`${product.artist} — ${product.name}`} className="w-full h-full object-cover" />
        ) : (
          <VinylPlaceholder className="w-2/3 h-2/3" />
        )}
      </div>

      <div>
        <Link to="/" className="text-xs uppercase tracking-widest text-[var(--color-gold-dim)] hover:text-[var(--color-gold)]">
          &larr; Back to shop
        </Link>
        <p className="uppercase tracking-[0.3em] text-xs text-[var(--color-gold)] mt-4 mb-1">{product.artist}</p>
        <h1 className="font-[var(--font-display)] text-3xl mb-3">{product.name}</h1>
        <p className="tabular text-2xl text-[var(--color-gold)] mb-4">{formatPrice(product.price_cents)}</p>
        <p className="text-[var(--color-gold-dim)] mb-2 uppercase text-xs tracking-widest">
          {product.format} &middot; {product.genre} &middot; {product.year}
        </p>
        <p className="text-[var(--color-paper)]/80 mb-8">{product.description}</p>

        <button
          onClick={() => {
            addItem(product);
            setAdded(true);
          }}
          className="btn-gold px-8 py-3 uppercase tracking-widest text-sm"
        >
          {added ? "Added ✓" : "Add to cart"}
        </button>
      </div>
    </section>
  );
}