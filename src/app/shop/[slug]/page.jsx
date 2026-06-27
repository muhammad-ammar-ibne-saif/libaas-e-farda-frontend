"use client";
import { useState, useEffect, use } from "react";
import { fetchProduct, fetchProducts } from "../../../lib/api";
import { notFound } from "next/navigation";
import { formatPrice, getDiscount } from "../../../lib/utils";
import { useCartStore, useWishlistStore } from "../../../store/cartStore";
import ProductCard from "../../../components/ui/ProductCard";
import {
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  Shield,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { useSettingsStore } from "../../../store/settingsStore";
import ProductReviews from "../../../components/ui/ProductReviews";
import BackInStock from "../../../components/ui/BackInStock";

export default function ProductPage({ params }) {
  const { slug } = use(params);
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [mainImg, setMainImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState("details");

  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();
  const { settings, fetch: fetchSettings } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchProduct(slug);
        if (!data.success || !data.product) {
          notFound();
          return;
        }
        setProduct(data.product);
        setSelectedColor(data.product.colors?.[0] || null);

        // Load related
        const rel = await fetchProducts(
          `category=${data.product.category}&limit=4`
        );
        if (rel.success)
          setRelated(
            rel.products.filter((p) => p._id !== data.product._id).slice(0, 4)
          );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-terracotta-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  if (!product) return null;

  const wishlisted = isWishlisted(product._id || product.id);
  const discount = getDiscount(product.price, product.salePrice);
  const whatsapp = settings?.brand?.whatsappNumber || "923001234567";

  const handleAdd = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    addItem({ ...product, id: product._id }, selectedSize, selectedColor, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsApp = () => {
    const msg = `Hi! I'd like to order:\n\n*${product.name}*\nSize: ${
      selectedSize || "TBD"
    }\nColour: ${selectedColor?.name}\nQty: ${qty}\nPrice: ${formatPrice(
      (product.salePrice || product.price) * qty
    )}\n\nPlease confirm availability.`;
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`);
  };

  const accordionData = [
    {
      key: "details",
      label: "Product Details",
      content: (
        <ul className="space-y-1.5">
          {(product.details || []).map((d) => (
            <li key={d} className="flex items-start gap-2">
              <span className="text-terracotta-400 mt-0.5">·</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      key: "size",
      label: "Size & Fit",
      content: (
        <p>
          This piece is true to size. If you're between sizes, we recommend
          sizing up.
        </p>
      ),
    },
    {
      key: "shipping",
      label: "Shipping & Returns",
      content: (
        <div className="space-y-2">
          <p>
            <strong>Standard:</strong> 3-5 working days (Rs.{" "}
            {settings?.shipping?.standardCost || 199})
          </p>
          <p>
            <strong>Express:</strong> 1-2 working days (Rs.{" "}
            {settings?.shipping?.expressCost || 349})
          </p>
          <p>
            <strong>Returns:</strong> 7-day return policy on unworn, tagged
            items.
          </p>
        </div>
      ),
    },
    {
      key: "care",
      label: "Care Instructions",
      content: (
        <p>
          Please refer to the care label inside your garment. Most pieces are
          machine washable at 30°C on a gentle cycle.
        </p>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Link
          href="/shop"
          className="flex items-center gap-1.5 text-xs font-body text-charcoal-light hover:text-terracotta-500 transition-colors"
        >
          <ArrowLeft size={12} /> Shop
        </Link>
        <span className="text-charcoal-light text-xs">/</span>
        <span className="text-xs font-body text-charcoal capitalize">
          {product.category}
        </span>
        <span className="text-charcoal-light text-xs">/</span>
        <span className="text-xs font-body text-charcoal font-medium">
          {product.name}
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 xl:gap-16">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-[4/5] bg-ivory-200 overflow-hidden">
            <img
              src={product.images?.[mainImg] || product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            {discount > 0 && (
              <div className="absolute top-4 left-4 bg-terracotta-500 text-ivory-100 text-xs font-body tracking-widest uppercase px-3 py-1">
                -{discount}% Sale
              </div>
            )}
            {product.isNewArrival && (
              <div className="absolute top-4 right-4 bg-charcoal text-ivory-100 text-xs font-body tracking-widest uppercase px-3 py-1">
                New
              </div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImg(i)}
                  className={`aspect-square overflow-hidden border-2 transition-colors ${
                    mainImg === i
                      ? "border-terracotta-500"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-7">
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="font-display text-3xl md:text-4xl text-charcoal font-light leading-tight">
                {product.name}
              </h1>
              <button
                onClick={() =>
                  navigator.share?.({
                    title: product.name,
                    url: window.location.href,
                  })
                }
                className="p-2 text-charcoal-light hover:text-terracotta-500 transition-colors flex-shrink-0"
              >
                <Share2 size={16} />
              </button>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating || 0)
                        ? "text-terracotta-400"
                        : "text-ivory-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="font-body text-xs text-charcoal-light">
                {product.rating} ({product.numReviews} reviews)
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span
                className={`font-body text-2xl font-medium ${
                  product.salePrice ? "text-terracotta-500" : "text-charcoal"
                }`}
              >
                {formatPrice(product.salePrice || product.price)}
              </span>
              {product.salePrice && (
                <>
                  <span className="font-body text-base text-charcoal-light line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="font-body text-xs bg-terracotta-100 text-terracotta-600 px-2 py-0.5">
                    Save {formatPrice(product.price - product.salePrice)}
                  </span>
                </>
              )}
            </div>
          </div>

          <p className="font-body text-sm text-charcoal leading-relaxed">
            {product.description}
          </p>

          {product.colors?.length > 0 && (
            <div>
              <p className="text-xs tracking-widest uppercase font-body text-charcoal-light mb-3">
                Colour:{" "}
                <span className="text-charcoal font-medium">
                  {selectedColor?.name}
                </span>
              </p>
              <div className="flex gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    title={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor?.name === c.name
                        ? "border-terracotta-500 scale-110 shadow-md"
                        : "border-ivory-300 hover:border-charcoal"
                    }`}
                    style={{
                      backgroundColor: c.hex,
                      outline: "1px solid #e5e7eb",
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-3">
              <p
                className={`text-xs tracking-widest uppercase font-body ${
                  sizeError
                    ? "text-terracotta-500 font-medium"
                    : "text-charcoal-light"
                }`}
              >
                {sizeError ? "⚠ Please select a size" : "Select Size"}
              </p>
              <Link
                href="/size-guide"
                className="text-xs font-body text-charcoal-light hover:text-terracotta-500 transition-colors underline underline-offset-2"
              >
                Size Guide
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {(product.sizes || []).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSelectedSize(s);
                    setSizeError(false);
                  }}
                  className={`px-4 py-2 text-xs font-body font-medium border transition-all duration-200 ${
                    selectedSize === s
                      ? "bg-charcoal border-charcoal text-ivory-100"
                      : "border-ivory-300 text-charcoal hover:border-charcoal"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex items-center border border-ivory-300 bg-ivory-50">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-12 flex items-center justify-center text-charcoal hover:text-terracotta-500 transition-colors"
                >
                  −
                </button>
                <span className="w-10 text-center font-body text-sm">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-10 h-12 flex items-center justify-center text-charcoal hover:text-terracotta-500 transition-colors"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAdd}
                className={`flex-1 flex items-center justify-center gap-2 py-3 font-body text-xs tracking-widest uppercase font-medium transition-all duration-300 ${
                  added
                    ? "bg-sage-300 text-charcoal border border-sage-400"
                    : "bg-charcoal text-ivory-100 hover:bg-terracotta-500"
                }`}
              >
                {added ? (
                  "✓ Added to Bag"
                ) : (
                  <>
                    <ShoppingBag size={14} /> Add to Bag
                  </>
                )}
              </button>
            </div>
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white font-body text-xs tracking-widest uppercase font-medium hover:bg-[#20b858] transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Order on WhatsApp
            </button>
            <button
              onClick={() => toggle({ ...product, id: product._id })}
              className={`w-full flex items-center justify-center gap-2 py-3 border font-body text-xs tracking-widest uppercase font-medium transition-all ${
                wishlisted
                  ? "bg-terracotta-50 border-terracotta-300 text-terracotta-500"
                  : "border-ivory-300 text-charcoal hover:border-terracotta-400"
              }`}
            >
              <Heart size={13} fill={wishlisted ? "currentColor" : "none"} />
              {wishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 py-5 border-y border-ivory-200">
            {[
              { icon: Truck, text: "Free shipping over Rs. 4,000" },
              { icon: RotateCcw, text: "7-day easy returns" },
              { icon: Shield, text: "Authentic & quality checked" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex flex-col items-center text-center gap-1.5"
              >
                <Icon size={16} className="text-terracotta-500" />
                <p className="font-body text-[10px] text-charcoal-light leading-tight">
                  {text}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-0 border-t border-ivory-200">
            {accordionData.map((item) => (
              <div key={item.key} className="border-b border-ivory-200">
                <button
                  onClick={() =>
                    setOpenAccordion(
                      openAccordion === item.key ? null : item.key
                    )
                  }
                  className="flex items-center justify-between w-full py-4 text-left"
                >
                  <span className="font-body text-sm font-medium text-charcoal tracking-wide">
                    {item.label}
                  </span>
                  {openAccordion === item.key ? (
                    <ChevronUp size={16} className="text-charcoal-light" />
                  ) : (
                    <ChevronDown size={16} className="text-charcoal-light" />
                  )}
                </button>
                {openAccordion === item.key && (
                  <div className="pb-4 font-body text-sm text-charcoal-light leading-relaxed">
                    {item.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20 pt-12 border-t border-ivory-200">
          <h2 className="section-title mb-10">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
