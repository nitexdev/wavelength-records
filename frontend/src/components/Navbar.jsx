import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { totalCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-ink)]/95 backdrop-blur border-b border-white/10">
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="22" fill="#1C1F3D" stroke="#E0B23C" strokeWidth="1.5" />
            <circle cx="32" cy="32" r="6" fill="#E0B23C" />
          </svg>
          <span className="font-[var(--font-display)] text-lg tracking-tight">WAVELENGTH</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest text-[var(--color-gold-dim)]">
          <Link to="/" className="hover:text-[var(--color-gold)] transition-colors">
            Shop
          </Link>
        </div>

        <Link
          to="/cart"
          className="relative border border-[var(--color-gold)] text-[var(--color-gold)] px-4 py-2 text-sm uppercase tracking-widest hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)] transition-colors"
        >
          Cart {totalCount > 0 && `(${totalCount})`}
        </Link>
      </nav>
    </header>
  );
}
