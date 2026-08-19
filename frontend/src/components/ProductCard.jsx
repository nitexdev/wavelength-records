import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const formatPrice = (cents) => `$${(cents / 100).toFixed(2)}`;

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <div className="card p-4 flex flex-col gap-3">
      <Link to={`/records/${product.slug}`} className="aspect-square bg-[var(--color-ink)] flex items-center justify-center overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={`${product.artist} — ${product.name}`} className="w-full h-full object-cover" />
        ) : (
          <div className="w-24 h-24 rounded-full border-2 border-[var(--color-gold-dim)] flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[var(--color-gold-dim)]" />
          </div>
        )}
      </Link>

      <div className="flex items-start justify-between gap-3">
        <div>
          <Link to={`/records/${product.slug}`}>
            <p className="font-[var(--font-display)] text-sm leading-tight">{product.artist}</p>
            <p className="text-[var(--color-gold-dim)] text-sm mt-0.5">{product.name}</p>
          </Link>
          <p className="text-xs text-[var(--color-gold-dim)] mt-2 uppercase tracking-widest">
            {product.format} &middot; {product.genre}
          </p>
        </div>
        <div className="record-badge">
          <span>{formatPrice(product.price_cents)}</span>
        </div>
      </div>

      <button
        onClick={() => addItem(product)}
        className="btn-gold py-2 text-sm uppercase tracking-widest"
      >
        Add to cart
      </button>
    </div>
  );
}
