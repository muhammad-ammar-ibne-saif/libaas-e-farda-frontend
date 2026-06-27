"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { fetchProducts, fetchCategories } from "../../lib/api";
import ProductCard from "../../components/ui/ProductCard";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const initCategory = searchParams.get("category") || "all";
  const initFilter = searchParams.get("filter") || "";
  const initSearch = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState(initCategory);
  const [sort, setSort] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sizeFilter, setSizeFilter] = useState([]);
  const [maxPrice, setMaxPrice] = useState(15000);
  const [page, setPage] = useState(1);

  // Load dynamic categories
  useEffect(() => {
    fetchCategories().then((d) => {
      if (d.success && d.categories?.length) setCategories(d.categories);
    });
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== "all") params.set("category", category);
      if (initFilter) params.set("filter", initFilter);
      if (initSearch) params.set("search", initSearch);
      params.set("sort", sort);
      params.set("page", page);
      params.set("limit", 20);
      const data = await fetchProducts(params.toString());
      if (data.success) {
        setProducts(data.products);
        setTotal(data.total);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [category, sort, page, initFilter, initSearch]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = products.filter((p) => {
    const price = p.salePrice || p.price;
    const sizeOk =
      sizeFilter.length === 0 || p.sizes?.some((s) => sizeFilter.includes(s));
    return sizeOk && price <= maxPrice;
  });

  const toggleSize = (s) =>
    setSizeFilter((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const pageTitle =
    initFilter === "new"
      ? "New Arrivals"
      : initFilter === "sale"
      ? "Sale"
      : initSearch
      ? `Results for "${initSearch}"`
      : "All Pieces";

  // Build category tabs — always include "All" first
  const categoryTabs = [
    { slug: "all", name: "All Pieces" },
    ...categories
      .filter((c) => c.isActive !== false)
      .map((c) => ({ slug: c.slug, name: c.name })),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-terracotta-500 mb-2">
          The Collection
        </p>
        <h1 className="section-title">{pageTitle}</h1>
        <p className="font-body text-sm text-charcoal-light mt-2">
          {total} pieces
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-ivory-200 flex-wrap">
        {/* Dynamic category filters */}
        <div className="hidden md:flex gap-1 overflow-x-auto max-w-[60%]">
          {categoryTabs.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => {
                setCategory(cat.slug);
                setPage(1);
              }}
              className={`flex-shrink-0 px-4 py-1.5 text-xs font-body tracking-widest uppercase transition-all ${
                category === cat.slug
                  ? "bg-charcoal text-ivory-100"
                  : "text-charcoal hover:text-terracotta-500"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 text-xs font-body tracking-wider text-charcoal border border-ivory-300 px-4 py-2 hover:border-terracotta-400 transition-colors"
          >
            <SlidersHorizontal size={13} />
            Filter {sizeFilter.length > 0 && `(${sizeFilter.length})`}
          </button>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="appearance-none bg-ivory-100 border border-ivory-300 text-xs font-body tracking-wider text-charcoal px-4 py-2 pr-8 outline-none hover:border-terracotta-400 cursor-pointer"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal-light pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Mobile category dropdown */}
      <div className="md:hidden mb-5">
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="w-full border border-ivory-300 text-sm font-body text-charcoal px-4 py-2.5 outline-none bg-ivory-50"
        >
          {categoryTabs.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {filtersOpen && (
        <div className="mb-8 p-6 bg-ivory-50 border border-ivory-200 grid sm:grid-cols-3 gap-8">
          <div>
            <p className="text-xs tracking-widest uppercase font-body font-medium text-charcoal mb-3">
              Size
            </p>
            <div className="flex flex-wrap gap-2">
              {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSize(s)}
                  className={`w-10 h-10 text-xs font-body border transition-all ${
                    sizeFilter.includes(s)
                      ? "bg-charcoal border-charcoal text-ivory-100"
                      : "border-ivory-300 text-charcoal hover:border-terracotta-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase font-body font-medium text-charcoal mb-3">
              Max Price: Rs. {maxPrice.toLocaleString()}
            </p>
            <input
              type="range"
              min={0}
              max={15000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-terracotta-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSizeFilter([]);
                setMaxPrice(15000);
                setFiltersOpen(false);
              }}
              className="flex items-center gap-1.5 text-xs font-body text-charcoal-light hover:text-terracotta-500 transition-colors"
            >
              <X size={12} /> Clear filters
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] bg-ivory-200 animate-pulse rounded"
            />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((product, i) => (
            <div
              key={product._id}
              className="animate-fade-up"
              style={{
                animationDelay: `${i * 0.04}s`,
                animationFillMode: "both",
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <p className="font-display text-3xl text-charcoal mb-3">
            No pieces found
          </p>
          <p className="font-body text-sm text-charcoal-light">
            Try adjusting your filters
          </p>
        </div>
      )}

      {total > 20 && (
        <div className="flex justify-center gap-3 mt-12">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-6 py-2 border border-ivory-300 text-xs font-body text-charcoal hover:border-terracotta-400 disabled:opacity-40 transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-xs font-body text-charcoal-light">
            Page {page}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page * 20 >= total}
            className="px-6 py-2 border border-ivory-300 text-xs font-body text-charcoal hover:border-terracotta-400 disabled:opacity-40 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-terracotta-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
