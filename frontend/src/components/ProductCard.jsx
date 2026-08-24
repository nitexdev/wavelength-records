import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import VinylPlaceholder from "./VinylPlaceholder";

const formatPrice = (cents) => `$${(cents / 100).toFixed(2)}`;

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <div className="card p-4 flex flex-col gap-3 group">
      <Link
        to={`/records/${product.slug}`}
        className="aspect-square bg-[var(--color-ink)] flex items-center justify-center overflow-hidden relative"
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={`${product.artist} — ${product.name}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <VinylPlaceholder className="w-2/3 h-2/3" />
        )}
      </Link>

      <div className="flex items-start justify-between gap-3">
        <div>
          <Link to={`/records/${product.slug}`}>
            <p className="font-[var(--font-display)] text-sm leading-tight group-hover:text-[var(--color-gold)] transition-colors">
              {product.artist}
            </p>
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