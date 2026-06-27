"use client";
import { useCartStore } from "../../store/cartStore";
import { useSettingsStore } from "../../store/settingsStore";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "../../lib/utils";
import { useEffect } from "react";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, total, count } =
    useCartStore();
  const { settings, fetch } = useSettingsStore();
  const cartTotal = total();
  const cartCount = count();

  useEffect(() => {
    fetch();
  }, []);
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const threshold = settings?.shipping?.freeShippingThreshold || 4000;
  const remaining = threshold - cartTotal;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-50"
          onClick={closeCart}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-ivory-100 z-50 flex flex-col shadow-2xl transition-transform duration-500 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-ivory-200">
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} className="text-terracotta-500" />
            <span className="font-body text-sm font-medium tracking-widest uppercase text-charcoal">
              Your Bag ({cartCount})
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-1 text-charcoal hover:text-terracotta-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-5 pb-20">
              <ShoppingBag size={48} className="text-ivory-300" />
              <div>
                <p className="font-display text-2xl text-charcoal mb-2">
                  Your bag is empty
                </p>
                <p className="font-body text-sm text-charcoal-light">
                  Discover pieces made for where you're going.
                </p>
              </div>
              <button onClick={closeCart} className="btn-outline text-xs">
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => {
              const price = item.product.salePrice || item.product.price;
              return (
                <div
                  key={item.key}
                  className="flex gap-4 pb-5 border-b border-ivory-200 last:border-0"
                >
                  <div className="w-20 h-24 bg-ivory-200 flex-shrink-0 overflow-hidden">
                    <img
                      src={item.color?.image || item.product.images?.[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <Link
                        href={`/shop/${item.product.slug}`}
                        onClick={closeCart}
                        className="font-body text-sm font-medium text-charcoal hover:text-terracotta-500 transition-colors leading-snug"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.key)}
                        className="text-charcoal-light hover:text-terracotta-500 transition-colors flex-shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-charcoal-light font-body mt-1">
                      {item.color?.name || "Default"} · Size {item.size}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-ivory-300 bg-ivory-50">
                        <button
                          onClick={() => updateQty(item.key, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-charcoal-light hover:text-terracotta-500 transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-xs font-body font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.key, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-charcoal-light hover:text-terracotta-500 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="font-body text-sm font-medium text-charcoal">
                        {formatPrice(price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-6 border-t border-ivory-200 space-y-4 bg-ivory-50">
            {/* Dynamic free shipping bar */}
            {cartTotal < threshold && (
              <div className="text-center">
                <p className="text-xs font-body text-charcoal-light">
                  Add {formatPrice(remaining)} more for{" "}
                  <span className="text-terracotta-500 font-medium">
                    free shipping
                  </span>
                </p>
                <div className="mt-2 h-1 bg-ivory-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-terracotta-500 transition-all duration-500"
                    style={{
                      width: `${Math.min((cartTotal / threshold) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
            {cartTotal >= threshold && (
              <p className="text-center text-xs font-body text-sage-500 font-medium">
                🎉 You've unlocked free shipping!
              </p>
            )}

            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-charcoal-light">
                Subtotal
              </span>
              <span className="font-body text-base font-medium text-charcoal">
                {formatPrice(cartTotal)}
              </span>
            </div>
            <p className="text-xs text-charcoal-light font-body">
              Shipping calculated at checkout
            </p>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex items-center justify-center gap-2 w-full btn-primary"
            >
              Proceed to Checkout <ArrowRight size={14} />
            </Link>
            <button
              onClick={closeCart}
              className="w-full text-center text-xs font-body tracking-widest uppercase text-charcoal-light hover:text-terracotta-500 transition-colors py-1"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
