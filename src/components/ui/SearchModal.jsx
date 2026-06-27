"use client";
import { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight, Loader } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "../../lib/utils";
import { useRouter } from "next/navigation";
import { useSettingsStore } from "../../store/settingsStore";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();
  const { settings, fetch } = useSettingsStore();

  useEffect(() => {
    fetch();
  }, []);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    window
      .fetch(`${API}/categories`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCategories(d.categories || []);
      })
      .catch(() => {});
  }, []);

  // Use settings search tags if configured, else auto-generate from live categories
  const quickTags = settings?.searchTags?.length
    ? settings.searchTags
    : [
        { label: "New Arrivals", query: "new" },
        { label: "Sale", query: "sale" },
        ...categories
          .filter((c) => c.isActive)
          .slice(0, 6)
          .map((c) => ({ label: c.name, query: c.slug })),
      ];

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
    else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await fetch(
          `${API}/products?search=${encodeURIComponent(query)}&limit=6`
        );
        const d = await r.json();
        setResults(d.products || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  const handleTag = (tag) => {
    router.push(`/shop?category=${tag.query}&filter=${tag.query}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative z-10 bg-ivory-100 w-full max-w-2xl mx-auto mt-16 md:mt-24 shadow-2xl">
        {/* Search input */}
        <form
          onSubmit={handleSearch}
          className="flex items-center border-b border-ivory-200 px-5"
        >
          <Search size={18} className="text-charcoal-light flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pieces..."
            className="flex-1 px-4 py-5 font-body text-sm text-charcoal bg-transparent outline-none placeholder-charcoal-light"
          />
          {loading && (
            <Loader
              size={16}
              className="text-charcoal-light animate-spin flex-shrink-0"
            />
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-charcoal-light hover:text-terracotta-500 transition-colors ml-2"
          >
            <X size={18} />
          </button>
        </form>

        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {/* Quick tags — shown when no query */}
          {!query && (
            <div>
              <p className="font-body text-[10px] tracking-[0.25em] uppercase text-charcoal-light mb-3">
                Quick Search
              </p>
              <div className="flex flex-wrap gap-2">
                {quickTags.map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => handleTag(tag)}
                    className="px-4 py-2 bg-ivory-200 hover:bg-terracotta-500 hover:text-ivory-100 text-xs font-body text-charcoal transition-colors tracking-wider"
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {query && results.length > 0 && (
            <div>
              <p className="font-body text-[10px] tracking-[0.25em] uppercase text-charcoal-light mb-3">
                {results.length} result{results.length !== 1 ? "s" : ""} for "
                {query}"
              </p>
              <div className="space-y-0">
                {results.map((product) => (
                  <Link
                    key={product._id}
                    href={`/shop/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 py-3 border-b border-ivory-200 last:border-0 hover:bg-ivory-200 -mx-2 px-2 transition-colors group"
                  >
                    <div className="w-14 h-16 flex-shrink-0 overflow-hidden bg-ivory-200">
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-medium text-charcoal group-hover:text-terracotta-500 transition-colors truncate">
                        {product.name}
                      </p>
                      <p className="font-body text-xs text-charcoal-light capitalize">
                        {product.category}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {product.salePrice && (
                        <p className="font-body text-xs text-charcoal-light line-through">
                          {formatPrice(product.price)}
                        </p>
                      )}
                      <p className="font-body text-sm font-semibold text-terracotta-500">
                        {formatPrice(product.salePrice || product.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              {/* View all */}
              <button
                onClick={() => {
                  router.push(`/shop?search=${encodeURIComponent(query)}`);
                  onClose();
                }}
                className="flex items-center gap-2 mt-4 font-body text-xs tracking-widest uppercase text-charcoal hover:text-terracotta-500 transition-colors"
              >
                View all results <ArrowRight size={12} />
              </button>
            </div>
          )}

          {/* No results */}
          {query && !loading && results.length === 0 && (
            <div className="text-center py-10">
              <p className="font-display text-2xl text-charcoal mb-2">
                No results found
              </p>
              <p className="font-body text-sm text-charcoal-light">
                Try a different search term.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
