import { useEffect, useState } from "react";
import { api } from "../api";
import ProductCard from "../components/ProductCard";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genre, setGenre] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = genre ? `?genre=${encodeURIComponent(genre)}` : "";
    api
      .listProducts(params)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [genre]);

  const genres = ["Alternative", "Jazz", "Rock", "Soul", "Electronic"];

  return (
    <section className="max-w-6xl mx-auto px-6 pt-16 pb-24">
      <div className="mb-10">
        <p className="uppercase tracking-[0.3em] text-xs text-[var(--color-gold)] mb-3">New Arrivals</p>
        <h1 className="font-[var(--font-display)] text-4xl md:text-5xl">The shop.</h1>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        <button
          onClick={() => setGenre("")}
          className={`px-3 py-1.5 text-xs uppercase tracking-widest border ${
            genre === "" ? "border-[var(--color-gold)] text-[var(--color-gold)]" : "border-white/20 text-[var(--color-gold-dim)]"
          }`}
        >
          All
        </button>
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => setGenre(g)}
            className={`px-3 py-1.5 text-xs uppercase tracking-widest border ${
              genre === g ? "border-[var(--color-gold)] text-[var(--color-gold)]" : "border-white/20 text-[var(--color-gold-dim)]"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-[var(--color-gold-dim)]">Loading records…</p>
      ) : products.length === 0 ? (
        <p className="text-[var(--color-gold-dim)]">No records found in this genre yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
