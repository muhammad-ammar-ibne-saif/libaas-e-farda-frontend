"use client";
import { useState, useEffect } from "react";
import { X, Heart, ShoppingBag, ArrowRight, MessageCircle } from "lucide-react";
import { formatPrice } from "../../lib/utils";
import { useCartStore, useWishlistStore } from "../../store/cartStore";
import { useSettingsStore } from "../../store/settingsStore";
import Link from "next/link";

export default function QuickViewModal({ product, isOpen, onClose }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();
  const { settings } = useSettingsStore();

  useEffect(() => {
    if (isOpen && product) {
      setSelectedSize(null);
      setSelectedColor(
        product.colors?.length
          ? product.colors[0]
          : { name: "Default", hex: "#000000" }
      );
      setImgIdx(0);
      setAdded(false);
      setSizeError(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const productId = product._id || product.id;
  const wishlisted = isWishlisted(productId);
  const whatsapp = settings?.brand?.whatsappNumber || "923001234567";
  const images = product.images?.length ? product.images : [];
  const inStock = product.stock === undefined || product.stock > 0;

  const handleAdd = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    addItem(
      { ...product, id: productId },
      selectedSize,
      selectedColor || { name: "Default", hex: "#000" }
    );
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  const handleWhatsApp = () => {
    const template =
      settings?.brand?.whatsappOrderTemplate ||
      "Hi! I'd like to order *{product}* – Size: {size}, Colour: {color}. Is it available?";
    const msg = template
      .replace("{product}", product.name)
      .replace("{size}", selectedSize || "TBD")
      .replace("{color}", selectedColor?.name || "Default")
      .replace("{qty}", "1")
      .replace("{price}", formatPrice(product.salePrice || product.price));
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-ivory-100 w-full max-w-3xl max-h-[90vh] overflow-y-auto z-10 shadow-2xl animate-fade-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-ivory-100 text-charcoal-light hover:text-terracotta-500 transition-colors shadow-card"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Images */}
          <div className="relative aspect-square bg-ivory-200">
            {images.length > 0 ? (
              <img
                src={images[imgIdx]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => (e.target.style.opacity = "0.3")}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-ivory-300">
                <ShoppingBag size={48} />
              </div>
            )}
            {!inStock && (
              <div className="absolute inset-0 bg-ivory-100/60 flex items-center justify-center">
                <span className="bg-charcoal text-ivory-100 text-xs font-body tracking-widest uppercase px-4 py-2">
                  Sold Out
                </span>
              </div>
            )}
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      imgIdx === i ? "bg-terracotta-500" : "bg-ivory-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-6 flex flex-col gap-4">
            <div>
              <h2 className="font-display text-2xl text-charcoal font-light leading-tight">
                {product.name}
              </h2>
              <div className="flex items-baseline gap-2 mt-2">
                <span
                  className={`font-body text-xl font-semibold ${
                    product.salePrice ? "text-terracotta-500" : "text-charcoal"
                  }`}
                >
                  {formatPrice(product.salePrice || product.price)}
                </span>
                {product.salePrice && (
                  <span className="font-body text-sm text-charcoal-light line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              {/* Stock status */}
              {product.stock !== undefined && (
                <p
                  className={`font-body text-xs mt-1 font-medium ${
                    product.stock === 0
                      ? "text-red-500"
                      : product.stock <= 5
                      ? "text-yellow-600"
                      : "text-sage-500"
                  }`}
                >
                  {product.stock === 0
                    ? "✗ Out of stock"
                    : product.stock <= 5
                    ? `⚡ Only ${product.stock} left`
                    : "✓ In stock"}
                </p>
              )}
            </div>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div>
                <p className="text-xs tracking-wider uppercase font-body text-charcoal-light mb-2">
                  Colour:{" "}
                  <span className="text-charcoal font-medium">
                    {selectedColor?.name}
                  </span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      title={c.name}
                      onClick={() => setSelectedColor(c)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor?.name === c.name
                          ? "border-terracotta-500 scale-110"
                          : "border-transparent hover:border-charcoal-light"
                      }`}
                      style={{
                        backgroundColor: c.hex || c.color,
                        outline: "1px solid #e5e7eb",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div>
                <p
                  className={`text-xs tracking-wider uppercase font-body mb-2 ${
                    sizeError
                      ? "text-terracotta-500 font-semibold"
                      : "text-charcoal-light"
                  }`}
                >
                  {sizeError ? "⚠ Select a size" : "Select Size"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSelectedSize(s);
                        setSizeError(false);
                      }}
                      className={`px-3 py-1.5 text-xs font-body font-medium border transition-all ${
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
            )}

            {/* Actions */}
            <div className="space-y-2 mt-auto">
              <button
                onClick={handleAdd}
                disabled={!inStock}
                className={`w-full flex items-center justify-center gap-2 py-3 font-body text-xs tracking-widest uppercase font-medium transition-all ${
                  added
                    ? "bg-sage-300 text-charcoal"
                    : !inStock
                    ? "bg-ivory-200 text-charcoal-light cursor-not-allowed"
                    : "bg-charcoal text-ivory-100 hover:bg-terracotta-500"
                }`}
              >
                {added ? (
                  "✓ Added to Bag"
                ) : (
                  <>
                    <ShoppingBag size={13} />{" "}
                    {inStock ? "Add to Bag" : "Out of Stock"}
                  </>
                )}
              </button>

              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white font-body text-xs tracking-widest uppercase font-medium hover:bg-[#20b858] transition-colors"
              >
                <MessageCircle size={13} /> Order on WhatsApp
              </button>

              <button
                onClick={() => {
                  toggle({ ...product, id: productId });
                }}
                className={`w-full flex items-center justify-center gap-2 py-2.5 border font-body text-xs tracking-widest uppercase font-medium transition-all ${
                  wishlisted
                    ? "bg-terracotta-50 border-terracotta-300 text-terracotta-500"
                    : "border-ivory-300 text-charcoal hover:border-terracotta-400"
                }`}
              >
                <Heart size={12} fill={wishlisted ? "currentColor" : "none"} />
                {wishlisted ? "Saved" : "Add to Wishlist"}
              </button>
            </div>

            <Link
              href={`/shop/${product.slug}`}
              onClick={onClose}
              className="flex items-center justify-center gap-2 font-body text-xs text-charcoal-light hover:text-terracotta-500 transition-colors py-1"
            >
              View Full Details <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
