"use client";
import { useEffect } from "react";
import { useSettingsStore } from "../../store/settingsStore";
import { Truck, Clock, CheckCircle, MapPin } from "lucide-react";

export default function ShippingPage() {
  const { settings, fetch } = useSettingsStore();
  useEffect(() => {
    fetch();
  }, []);

  const shipping = settings?.shipping || {};
  const brand = settings?.brand || {};

  const options = [
    {
      icon: Truck,
      label: shipping.standardLabel || "Standard Delivery (3–5 days)",
      price: `Rs. ${shipping.standardCost || 199}`,
      desc: "Delivered via " + (shipping.couriers || "TCS, Leopards, BlueEx"),
    },
    {
      icon: Clock,
      label: shipping.expressLabel || "Express Delivery (1–2 days)",
      price: `Rs. ${shipping.expressCost || 349}`,
      desc: "Priority dispatch, next working day",
    },
    {
      icon: CheckCircle,
      label: `Free Shipping`,
      price: "Free",
      desc: `On all orders above Rs. ${(
        shipping.freeShippingThreshold || 4000
      ).toLocaleString()}`,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="font-body text-xs tracking-[0.3em] uppercase text-terracotta-500 mb-3">
        Delivery
      </p>
      <h1 className="section-title mb-4">Shipping Information</h1>
      <p className="font-body text-sm text-charcoal-light mb-14 max-w-xl leading-relaxed">
        {shipping.shippingPolicy ||
          "We ship to every city in Pakistan. Orders placed before 2pm PKT are dispatched same day."}
      </p>

      <div className="space-y-5 mb-16">
        {options.map((opt, i) => (
          <div
            key={i}
            className="flex items-start gap-5 p-6 bg-ivory-50 border border-ivory-200"
          >
            <div className="w-10 h-10 bg-terracotta-500/10 flex items-center justify-center flex-shrink-0">
              <opt.icon size={18} className="text-terracotta-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-4 mb-1">
                <h3 className="font-body text-sm font-semibold text-charcoal">
                  {opt.label}
                </h3>
                <span
                  className={`font-body text-sm font-bold ${
                    opt.price === "Free"
                      ? "text-sage-400"
                      : "text-terracotta-500"
                  }`}
                >
                  {opt.price}
                </span>
              </div>
              <p className="font-body text-xs text-charcoal-light">
                {opt.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {shipping.couriers && (
        <div className="mb-12">
          <h2 className="font-display text-2xl text-charcoal mb-5">
            Our Courier Partners
          </h2>
          <div className="flex flex-wrap gap-3">
            {shipping.couriers.split(",").map((c) => (
              <span
                key={c}
                className="font-body text-xs bg-ivory-200 text-charcoal px-4 py-2 tracking-wider"
              >
                {c.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="p-6 bg-charcoal text-ivory-100">
        <h2 className="font-display text-2xl mb-3">Track Your Order</h2>
        <p className="font-body text-sm text-ivory-400 mb-4">
          You'll receive a tracking number by WhatsApp once your order ships.
        </p>
        <a href="/orders" className="btn-primary inline-block">
          Track Order
        </a>
      </div>
    </div>
  );
}
