import { useEffect, useState } from "react";
import { api } from "../api";
import ProductCard from "../components/ProductCard";
import VinylPlaceholder from "../components/VinylPlaceholder";

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
    <>
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-14 grid md:grid-cols-[1.2fr_0.8fr] gap-10 items-center border-b border-white/10">
        <div>
          <p className="uppercase tracking-[0.3em] text-xs text-[var(--color-gold)] mb-4">
            Since forever, on wax
          </p>
          <h1 className="font-[var(--font-display)] text-5xl md:text-6xl leading-[1.05] mb-6">
            Records worth
            <br />
            the shelf space.
          </h1>
          <p className="text-[var(--color-gold-dim)] text-lg max-w-md">
            Hand-picked pressings across jazz, soul, rock, and electronic —
            new arrivals every week, no repress filler.
          </p>
        </div>
        <VinylPlaceholder className="w-48 h-48 md:w-64 md:h-64 mx-auto" />
      </section>

      <section className="max-w-6xl mx-auto px-6 pt-14 pb-24">
        <div className="flex items-baseline justify-between mb-8">
          <p className="uppercase tracking-[0.3em] text-xs text-[var(--color-gold)]">New Arrivals</p>
        </div>

        <div className="flex gap-2 mb-10 flex-wrap">
          <button
            onClick={() => setGenre("")}
            className={`px-3 py-1.5 text-xs uppercase tracking-widest border transition-colors ${
              genre === ""
                ? "border-[var(--color-gold)] text-[var(--color-gold)]"
                : "border-white/20 text-[var(--color-gold-dim)] hover:border-[var(--color-gold-dim)]"
            }`}
          >
            All
          </button>
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={`px-3 py-1.5 text-xs uppercase tracking-widest border transition-colors ${
                genre === g
                  ? "border-[var(--color-gold)] text-[var(--color-gold)]"
                  : "border-white/20 text-[var(--color-gold-dim)] hover:border-[var(--color-gold-dim)]"
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
    </>
  );
}