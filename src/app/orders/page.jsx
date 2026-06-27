"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, CheckCircle, Clock, Truck, Package } from "lucide-react";
import { trackOrder } from "../../lib/api";

const statusSteps = [
  "placed",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];
const stepLabels = {
  placed: { label: "Order Placed", icon: Package },
  confirmed: { label: "Confirmed", icon: CheckCircle },
  processing: { label: "Being Processed", icon: Clock },
  shipped: { label: "Dispatched", icon: Truck },
  delivered: { label: "Delivered", icon: CheckCircle },
};

function OrdersContent() {
  const searchParams = useSearchParams();
  const prefillOrder = searchParams.get("order") || "";

  const [orderNumber, setOrderNumber] = useState(prefillOrder);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-track if order number pre-filled from account page
  useEffect(() => {
    if (prefillOrder) {
      handleTrack(null, prefillOrder);
    }
  }, [prefillOrder]);

  const handleTrack = async (e, forcedNumber) => {
    e?.preventDefault();
    const num = forcedNumber || orderNumber.trim().toUpperCase();
    if (!num) return;
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const data = await trackOrder(num);
      if (data.success) setOrder(data.order);
      else
        setError(
          data.message || "Order not found. Please check your order number."
        );
    } catch {
      setError("Could not connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = order ? statusSteps.indexOf(order.orderStatus) : -1;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-terracotta-500 mb-3">
          Track Your Order
        </p>
        <h1 className="section-title">Where's My Order?</h1>
        <p className="font-body text-sm text-charcoal-light mt-3">
          Enter your order number to get real-time delivery updates.
        </p>
      </div>

      <form
        onSubmit={handleTrack}
        className="bg-ivory-50 border border-ivory-200 p-8 mb-10 space-y-4"
      >
        <div>
          <label className="block text-xs font-body tracking-wider text-charcoal-light mb-2">
            Order Number
          </label>
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="e.g. LEF-000001"
            required
            className="w-full bg-ivory-100 border border-ivory-300 focus:border-charcoal px-4 py-3 text-sm font-body font-mono text-charcoal outline-none transition-colors uppercase"
          />
        </div>
        {error && (
          <p className="text-terracotta-500 text-xs font-body">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-charcoal text-ivory-100 py-3 font-body text-xs tracking-widest uppercase font-medium hover:bg-terracotta-500 transition-colors disabled:opacity-60"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-ivory-100/30 border-t-ivory-100 rounded-full animate-spin" />
              Tracking...
            </>
          ) : (
            <>
              <Search size={14} />
              Track Order
            </>
          )}
        </button>
      </form>

      {order && (
        <div className="space-y-5 animate-fade-up">
          <div className="bg-ivory-50 border border-ivory-200 p-6">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <p className="font-body text-xs tracking-widest uppercase text-charcoal-light">
                  Order Number
                </p>
                <p className="font-display text-2xl text-terracotta-500">
                  {order.orderNumber}
                </p>
              </div>
              <span
                className={`text-xs font-body font-semibold tracking-widest uppercase px-3 py-1.5 rounded ${
                  order.orderStatus === "delivered"
                    ? "bg-sage-100 text-sage-500"
                    : order.orderStatus === "shipped"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-terracotta-50 text-terracotta-500"
                }`}
              >
                {order.orderStatus}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-body">
              <div>
                <span className="text-charcoal-light">Customer</span>
                <p className="text-charcoal font-medium mt-0.5">
                  {order.customer?.name}
                </p>
              </div>
              <div>
                <span className="text-charcoal-light">Payment</span>
                <p className="text-charcoal font-medium mt-0.5 uppercase">
                  {order.paymentMethod}
                </p>
              </div>
              <div>
                <span className="text-charcoal-light">Total</span>
                <p className="text-terracotta-500 font-semibold mt-0.5">
                  Rs. {order.pricing?.total?.toLocaleString()}
                </p>
              </div>
              {order.trackingNumber && (
                <div>
                  <span className="text-charcoal-light">Tracking</span>
                  <p className="text-charcoal font-mono font-medium mt-0.5">
                    {order.trackingNumber}
                  </p>
                  {order.courier && (
                    <p className="text-charcoal-light text-[10px] mt-0.5">
                      {order.courier}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-ivory-50 border border-ivory-200 p-6">
            <p className="font-body text-xs tracking-widest uppercase text-charcoal-light mb-6">
              Delivery Progress
            </p>
            <div className="relative">
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-ivory-300">
                <div
                  className="h-full bg-terracotta-500 transition-all duration-700"
                  style={{
                    width: `${
                      currentStepIndex >= 0
                        ? (currentStepIndex / (statusSteps.length - 1)) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <div className="flex justify-between relative z-10">
                {statusSteps.map((step, i) => {
                  const done = i <= currentStepIndex;
                  const current = i === currentStepIndex;
                  const Icon = stepLabels[step].icon;
                  return (
                    <div
                      key={step}
                      className="flex flex-col items-center gap-2 flex-1"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                          done
                            ? "bg-terracotta-500 border-terracotta-500"
                            : "bg-ivory-100 border-ivory-300"
                        } ${current ? "scale-110 shadow-md" : ""}`}
                      >
                        <Icon
                          size={14}
                          className={
                            done ? "text-ivory-100" : "text-charcoal-light"
                          }
                        />
                      </div>
                      <p
                        className={`text-[10px] text-center font-body leading-tight ${
                          done
                            ? "text-charcoal font-medium"
                            : "text-charcoal-light"
                        }`}
                      >
                        {stepLabels[step].label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {order.statusHistory?.length > 0 && (
            <div className="bg-ivory-50 border border-ivory-200 p-6">
              <p className="font-body text-xs tracking-widest uppercase text-charcoal-light mb-4">
                Status History
              </p>
              <div className="space-y-3">
                {[...order.statusHistory].reverse().map((h, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 text-xs font-body"
                  >
                    <span className="w-2 h-2 rounded-full bg-terracotta-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-charcoal capitalize">
                        {h.status}
                      </span>
                      {h.note && (
                        <span className="text-charcoal-light"> · {h.note}</span>
                      )}
                      <p className="text-charcoal-light mt-0.5">
                        {new Date(h.date).toLocaleString("en-PK")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {order.items?.length > 0 && (
            <div className="bg-ivory-50 border border-ivory-200 p-6">
              <p className="font-body text-xs tracking-widest uppercase text-charcoal-light mb-4">
                Items Ordered
              </p>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-2 border-b border-ivory-200 last:border-0"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-14 object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-body text-sm font-medium text-charcoal">
                        {item.name}
                      </p>
                      <p className="font-body text-xs text-charcoal-light">
                        {item.color} · {item.size} · Qty {item.quantity}
                      </p>
                    </div>
                    <p className="font-body text-sm text-charcoal">
                      Rs.{" "}
                      {(
                        (item.price || 0) * (item.quantity || 1)
                      ).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-terracotta-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OrdersContent />
    </Suspense>
  );
}
