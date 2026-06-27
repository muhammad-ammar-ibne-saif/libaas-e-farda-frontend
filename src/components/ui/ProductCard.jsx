"use client";
import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { formatPrice, getDiscount } from "../../lib/utils";
import { useWishlistStore } from "../../store/cartStore";
import QuickViewModal from "./QuickViewModal";

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [quickView, setQuickView] = useState(false);

  const { toggle, isWishlisted } = useWishlistStore();
  const productId = product._id || product.id;
  const wishlisted = isWishlisted(productId);
  const discount = getDiscount(product.price, product.salePrice);
  const images = product.images?.length
    ? product.images
    : [
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
      ];
  const numReviews = product.numReviews || product.reviews || 0;

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle({ ...product, id: productId });
  };
  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickView(true);
  };

  return (
    <>
      <Link
        href={`/shop/${product.slug}`}
        className="group block relative bg-ivory-50 cursor-pointer"
        onMouseEnter={() => {
          setHovered(true);
          setImgIdx(images.length > 1 ? 1 : 0);
        }}
        onMouseLeave={() => {
          setHovered(false);
          setImgIdx(0);
        }}
      >
        {/* Image container */}
        <div className="relative overflow-hidden aspect-[3/4] bg-ivory-200">
          <img
            src={images[imgIdx] || images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80";
            }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {(product.isNewArrival || product.isNew) && (
              <span className="bg-charcoal text-ivory-100 text-[10px] font-body tracking-widest uppercase px-2.5 py-1">
                New
              </span>
            )}
            {discount > 0 && (
              <span className="bg-terracotta-500 text-ivory-100 text-[10px] font-body tracking-widest uppercase px-2.5 py-1">
                -{discount}%
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-charcoal/70 text-ivory-100 text-[10px] font-body tracking-widest uppercase px-2.5 py-1">
                Sold Out
              </span>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <span className="bg-yellow-500 text-white text-[10px] font-body tracking-widest uppercase px-2.5 py-1">
                Low Stock
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div
            className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
              hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
            }`}
          >
            <button
              onClick={handleWishlist}
              title="Add to wishlist"
              className={`w-9 h-9 flex items-center justify-center shadow-card transition-all duration-200 ${
                wishlisted
                  ? "bg-terracotta-500 text-ivory-100"
                  : "bg-ivory-100 text-charcoal hover:bg-terracotta-500 hover:text-ivory-100"
              }`}
            >
              <Heart size={15} fill={wishlisted ? "currentColor" : "none"} />
            </button>
            <button
              onClick={handleQuickView}
              title="Quick view"
              className="w-9 h-9 bg-ivory-100 flex items-center justify-center shadow-card text-charcoal hover:bg-charcoal hover:text-ivory-100 transition-all duration-200"
            >
              <Eye size={15} />
            </button>
          </div>

          {/* Quick Add bottom bar */}
          {product.stock > 0 && (
            <div
              className={`absolute bottom-0 left-0 right-0 bg-charcoal/90 backdrop-blur-sm py-3 transition-all duration-300 ${
                hovered
                  ? "translate-y-0 opacity-100"
                  : "translate-y-full opacity-0"
              }`}
            >
              <button
                onClick={handleQuickView}
                className="flex items-center justify-center gap-2 w-full text-xs tracking-widest uppercase font-body text-ivory-100 hover:text-terracotta-300 transition-colors"
              >
                <ShoppingBag size={13} /> Quick Add
              </button>
            </div>
          )}

          {/* Image dots */}
          {images.length > 1 && hovered && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    imgIdx === i ? "bg-ivory-100" : "bg-ivory-100/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          {product.colors?.length > 1 && (
            <div className="flex gap-1.5 mb-2">
              {product.colors.slice(0, 6).map((c) => (
                <div
                  key={c.name || c.hex}
                  title={c.name}
                  className="w-3.5 h-3.5 rounded-full border border-ivory-300"
                  style={{ backgroundColor: c.hex || c.color }}
                />
              ))}
            </div>
          )}

          <h3 className="font-body text-sm font-medium text-charcoal group-hover:text-terracotta-500 transition-colors leading-snug">
            {product.name}
          </h3>

          <div className="flex gap-0.5 mt-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-2.5 h-2.5 ${
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
            <span className="text-[10px] font-body text-charcoal-light ml-1">
              ({numReviews})
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1.5">
            <span
              className={`font-body text-sm font-medium ${
                product.salePrice ? "text-terracotta-500" : "text-charcoal"
              }`}
            >
              {formatPrice(product.salePrice || product.price)}
            </span>
            {product.salePrice && (
              <span className="font-body text-xs text-charcoal-light line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {quickView && (
        <QuickViewModal
          product={product}
          isOpen={quickView}
          onClose={() => setQuickView(false)}
        />
      )}
    </>
  );
}
