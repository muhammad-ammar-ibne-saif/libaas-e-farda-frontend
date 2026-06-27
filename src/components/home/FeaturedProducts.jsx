"use client";
import { useState, useEffect } from "react";
import { fetchProducts, fetchCategories } from "../../lib/api";
import ProductCard from "../../components/ui/ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const DEFAULT_CATS = [
  { slug: "all", name: "All Pieces" },
  { slug: "tops", name: "Tops & Blouses" },
  { slug: "bottoms", name: "Trousers & Skirts" },
  { slug: "sets", name: "Co-ord Sets" },
  { slug: "outerwear", name: "Outerwear" },
];

export default function FeaturedProducts() {
  const [active, setActive] = useState("all");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load dynamic categories
  useEffect(() => {
    fetchCategories()
      .then((d) => {
        if (d.success && d.categories?.length) {
          setCategories([
            { slug: "all", name: "All Pieces" },
            ...d.categories.filter((c) => c.isActive !== false),
          ]);
        } else {
          setCategories(DEFAULT_CATS);
        }
      })
      .catch(() => setCategories(DEFAULT_CATS));
  }, []);

  // Load products when active category changes
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params =
          active === "all"
            ? "limit=8&sort=featured"
            : `category=${active}&limit=8&sort=featured`;
        const data = await fetchProducts(params);
        if (data.success) setProducts(data.products || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [active]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase text-terracotta-500 mb-3">
            The Collection
          </p>
          <h2 className="section-title">
            Pieces Built for
            <br />
            <span className="italic font-light">Her Next Chapter</span>
          </h2>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase text-charcoal hover:text-terracotta-500 transition-colors group self-start md:self-auto pb-1 border-b border-charcoal hover:border-terracotta-500"
        >
          View All Pieces{" "}
          <ArrowRight
            size={12}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setActive(cat.slug)}
            className={`flex-shrink-0 px-5 py-2 text-xs font-body tracking-widest uppercase font-medium transition-all duration-300 ${
              active === cat.slug
                ? "bg-charcoal text-ivory-100"
                : "bg-ivory-200 text-charcoal hover:bg-ivory-300"
            }`}
          >
            {cat.icon && <span className="mr-1">{cat.icon}</span>}
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] bg-ivory-200 animate-pulse rounded"
            >
              <div className="h-full bg-gradient-to-r from-ivory-200 via-ivory-100 to-ivory-200 animate-shimmer" />
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, i) => (
            <div
              key={product._id}
              className="animate-fade-up"
              style={{
                animationDelay: `${i * 0.05}s`,
                animationFillMode: "both",
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="font-display text-2xl text-charcoal mb-2">
            No pieces in this category yet
          </p>
          <p className="font-body text-sm text-charcoal-light">
            Check back soon — new pieces drop every Friday.
          </p>
        </div>
      )}
    </section>
  );
}
