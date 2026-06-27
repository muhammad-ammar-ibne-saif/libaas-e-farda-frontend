"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCartStore } from "../../store/cartStore";
import { useSettingsStore } from "../../store/settingsStore";
import { createOrder, validateCoupon } from "../../lib/api";
import { formatPrice } from "../../lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Tag,
  X,
  CreditCard,
  Loader,
} from "lucide-react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const inp =
  "w-full border border-ivory-300 focus:border-charcoal bg-ivory-50 px-4 py-3 text-sm font-body text-charcoal outline-none transition-colors";

const PAYMENT_ICONS = {
  cod: "💵",
  jazzcash: "📱",
  easypaisa: "📱",
  bank: "🏦",
  stripe: "💳",
};

function CheckoutContent() {
  const { items, total, clearCart } = useCartStore();
  const { settings, fetch } = useSettingsStore();
  const router = useRouter();
  const cartTotal = total();
  const cartItems = items;

  const [step, setStep] = useState(1);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [coupon, setCoupon] = useState({
    code: "",
    discount: 0,
    applied: false,
    loading: false,
    error: "",
  });
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    province: "",
    shippingOption: "standard",
    paymentMethod: "cod",
    notes: "",
  });

  useEffect(() => {
    fetch();
  }, []);
  useEffect(() => {
    if (cartItems.length === 0) router.push("/shop");
  }, [cartItems]);

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const paymentMethods = (settings?.paymentMethods || []).filter(
    (m) => m.isActive
  );
  const threshold = settings?.shipping?.freeShippingThreshold || 4000;
  const standardRate = settings?.shipping?.standardCost || 199;
  const expressRate = settings?.shipping?.expressCost || 349;
  const shippingCost =
    cartTotal >= threshold
      ? 0
      : form.shippingOption === "express"
      ? expressRate
      : standardRate;
  const finalTotal = cartTotal + shippingCost - coupon.discount;

  const applyCoupon = async () => {
    if (!coupon.code.trim()) return;
    setCoupon((c) => ({ ...c, loading: true, error: "" }));
    try {
      const data = await validateCoupon(coupon.code, cartTotal);
      if (data.success)
        setCoupon((c) => ({
          ...c,
          discount: data.discount,
          applied: true,
          loading: false,
        }));
      else setCoupon((c) => ({ ...c, error: data.message, loading: false }));
    } catch {
      setCoupon((c) => ({
        ...c,
        error: "Could not validate coupon",
        loading: false,
      }));
    }
  };

  const buildOrderPayload = () => ({
    items: cartItems.map((item) => ({
      productId: item.product._id || item.product.id,
      name: item.product.name,
      price: item.product.salePrice || item.product.price,
      image: item.color?.image || item.product.images?.[0] || "",
      size: item.size || "",
      color: item.color?.name || "Default",
      quantity: item.quantity,
    })),
    customer: { name: form.name, email: form.email, phone: form.phone },
    shippingAddress: {
      street: form.street,
      city: form.city,
      province: form.province,
    },
    shippingOption: form.shippingOption,
    paymentMethod: form.paymentMethod,
    couponCode: coupon.applied ? coupon.code : "",
    notes: form.notes,
  });

  const placeOrder = async () => {
    setPlacing(true);
    setError("");
    try {
      // ── Stripe Card Payment ───────────────────────────────
      if (form.paymentMethod === "stripe") {
        const res = await fetch(`${API}/payments/create-checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildOrderPayload()),
        });
        const data = await res.json();
        if (data.success && data.url) {
          // Redirect to Stripe hosted checkout
          window.location.href = data.url;
          return;
        }
        throw new Error(data.message || "Could not create Stripe session");
      }

      // ── All other payment methods (COD, JazzCash etc.) ───
      const data = await createOrder(buildOrderPayload());
      if (data.success) {
        clearCart();
        router.push(`/orders?order=${data.orderNumber}`);
      } else {
        throw new Error(data.message || "Could not place order");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setPlacing(false);
    }
  };

  const validateStep1 = () => {
    if (!form.name.trim()) return setError("Please enter your name");
    if (!form.email.trim()) return setError("Please enter your email");
    if (!form.phone.trim()) return setError("Please enter your phone number");
    if (!form.street.trim()) return setError("Please enter your address");
    if (!form.city.trim()) return setError("Please enter your city");
    setError("");
    setStep(2);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/shop"
          className="text-charcoal-light hover:text-charcoal transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="font-display text-3xl text-charcoal font-light">
          Checkout
        </h1>
        <div className="flex items-center gap-2 ml-auto">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`flex items-center gap-2 text-xs font-body ${
                step === s
                  ? "text-terracotta-500 font-semibold"
                  : "text-charcoal-light"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step === s
                    ? "bg-terracotta-500 text-white"
                    : step > s
                    ? "bg-sage-400 text-white"
                    : "bg-ivory-200 text-charcoal-light"
                }`}
              >
                {s}
              </div>
              <span className="hidden sm:inline">
                {s === 1 ? "Details" : "Payment"}
              </span>
              {s < 2 && <ArrowRight size={12} className="text-ivory-300" />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-3 space-y-6">
          {/* Step 1: Address */}
          {step === 1 && (
            <div className="bg-ivory-50 border border-ivory-200 p-6 space-y-4">
              <h2 className="font-display text-xl text-charcoal">
                Delivery Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs text-charcoal-light block mb-1.5">
                    Full Name *
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => upd("name", e.target.value)}
                    placeholder="Ayesha Raza"
                    className={inp}
                  />
                </div>
                <div>
                  <label className="font-body text-xs text-charcoal-light block mb-1.5">
                    Phone *
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) => upd("phone", e.target.value)}
                    placeholder="0300-1234567"
                    className={inp}
                  />
                </div>
              </div>
              <div>
                <label className="font-body text-xs text-charcoal-light block mb-1.5">
                  Email *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => upd("email", e.target.value)}
                  placeholder="you@example.com"
                  className={inp}
                />
              </div>
              <div>
                <label className="font-body text-xs text-charcoal-light block mb-1.5">
                  Street Address *
                </label>
                <input
                  value={form.street}
                  onChange={(e) => upd("street", e.target.value)}
                  placeholder="House/Flat No, Street"
                  className={inp}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs text-charcoal-light block mb-1.5">
                    City *
                  </label>
                  <input
                    value={form.city}
                    onChange={(e) => upd("city", e.target.value)}
                    placeholder="London"
                    className={inp}
                  />
                </div>
                <div>
                  <label className="font-body text-xs text-charcoal-light block mb-1.5">
                    County / State
                  </label>
                  <input
                    value={form.province}
                    onChange={(e) => upd("province", e.target.value)}
                    placeholder="Greater London"
                    className={inp}
                  />
                </div>
              </div>

              {/* Shipping option */}
              <div>
                <label className="font-body text-xs text-charcoal-light block mb-2">
                  Shipping Method
                </label>
                <div className="space-y-2">
                  {[
                    {
                      k: "standard",
                      l:
                        settings?.shipping?.standardLabel ||
                        "Standard (3–5 days)",
                      p:
                        cartTotal >= threshold
                          ? "Free"
                          : `${formatPrice(standardRate)}`,
                    },
                    {
                      k: "express",
                      l:
                        settings?.shipping?.expressLabel ||
                        "Express (1–2 days)",
                      p: formatPrice(expressRate),
                    },
                  ].map((opt) => (
                    <label
                      key={opt.k}
                      className={`flex items-center justify-between p-3 border cursor-pointer transition-colors ${
                        form.shippingOption === opt.k
                          ? "border-charcoal bg-ivory-100"
                          : "border-ivory-300 hover:border-ivory-400"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          value={opt.k}
                          checked={form.shippingOption === opt.k}
                          onChange={() => upd("shippingOption", opt.k)}
                          className="accent-terracotta-500"
                        />
                        <span className="font-body text-sm text-charcoal">
                          {opt.l}
                        </span>
                      </div>
                      <span
                        className={`font-body text-sm font-semibold ${
                          opt.p === "Free" ? "text-sage-500" : "text-charcoal"
                        }`}
                      >
                        {opt.p}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <p className="font-body text-sm text-terracotta-500">{error}</p>
              )}
              <button
                onClick={validateStep1}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                Continue to Payment <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="bg-ivory-50 border border-ivory-200 p-6 space-y-5">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="text-charcoal-light hover:text-charcoal transition-colors"
                >
                  <ArrowLeft size={16} />
                </button>
                <h2 className="font-display text-xl text-charcoal">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <label
                    key={method.key}
                    className={`flex items-start gap-4 p-4 border cursor-pointer transition-all ${
                      form.paymentMethod === method.key
                        ? "border-charcoal bg-ivory-100"
                        : "border-ivory-300 hover:border-ivory-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.key}
                      checked={form.paymentMethod === method.key}
                      onChange={() => upd("paymentMethod", method.key)}
                      className="accent-terracotta-500 mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {PAYMENT_ICONS[method.key] || "💳"}
                        </span>
                        <span className="font-body text-sm font-medium text-charcoal">
                          {method.label}
                        </span>
                        {method.key === "stripe" && (
                          <span className="text-[9px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                            Secure
                          </span>
                        )}
                      </div>
                      {method.description && (
                        <p className="font-body text-xs text-charcoal-light mt-0.5">
                          {method.description}
                        </p>
                      )}
                      {method.key === "bank" &&
                        method.accountDetails &&
                        form.paymentMethod === "bank" && (
                          <div className="mt-2 p-3 bg-ivory-200 rounded text-xs font-mono text-charcoal">
                            {method.accountDetails}
                          </div>
                        )}
                      {method.key === "stripe" &&
                        form.paymentMethod === "stripe" && (
                          <div className="mt-2 flex items-center gap-2">
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
                              alt="Stripe"
                              className="h-5 opacity-60"
                            />
                            <span className="text-xs text-charcoal-light">
                              You'll be redirected to Stripe's secure checkout
                            </span>
                          </div>
                        )}
                    </div>
                  </label>
                ))}
              </div>

              <div>
                <label className="font-body text-xs text-charcoal-light block mb-1.5">
                  Order Notes (optional)
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => upd("notes", e.target.value)}
                  rows={2}
                  placeholder="Any special instructions..."
                  className={`${inp} resize-none`}
                />
              </div>

              {error && (
                <p className="font-body text-sm text-terracotta-500">{error}</p>
              )}

              <button
                onClick={placeOrder}
                disabled={placing}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {placing ? (
                  <>
                    <Loader size={14} className="animate-spin" />{" "}
                    {form.paymentMethod === "stripe"
                      ? "Redirecting to Stripe..."
                      : "Placing Order..."}
                  </>
                ) : form.paymentMethod === "stripe" ? (
                  <>
                    <CreditCard size={14} /> Pay £
                    {(finalTotal / 100).toFixed(2)} with Card
                  </>
                ) : (
                  <>Place Order — {formatPrice(finalTotal)}</>
                )}
              </button>
              <p className="text-center font-body text-xs text-charcoal-light">
                By placing your order you agree to our{" "}
                <Link href="/" className="underline hover:text-terracotta-500">
                  Terms & Privacy Policy
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="bg-ivory-50 border border-ivory-200 p-5 sticky top-6">
            <h3 className="font-body text-xs tracking-widest uppercase text-charcoal-light mb-4">
              Order Summary
            </h3>

            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {cartItems.map((item) => {
                const price = item.product.salePrice || item.product.price;
                return (
                  <div key={item.key} className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={item.color?.image || item.product.images?.[0]}
                        alt={item.product.name}
                        className="w-12 h-14 object-cover rounded"
                      />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-charcoal text-ivory-100 rounded-full flex items-center justify-center text-[9px] font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-xs font-medium text-charcoal truncate">
                        {item.product.name}
                      </p>
                      <p className="font-body text-[10px] text-charcoal-light">
                        {item.size} · {item.color?.name || "Default"}
                      </p>
                    </div>
                    <span className="font-body text-sm text-charcoal">
                      {formatPrice(price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Coupon */}
            <div className="border-t border-ivory-200 pt-4 mb-4">
              {!coupon.applied ? (
                <div className="flex gap-2">
                  <input
                    value={coupon.code}
                    onChange={(e) =>
                      setCoupon((c) => ({
                        ...c,
                        code: e.target.value.toUpperCase(),
                        error: "",
                      }))
                    }
                    onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                    placeholder="Coupon code"
                    className={`${inp} flex-1 py-2 text-xs`}
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={coupon.loading}
                    className="flex items-center gap-1.5 px-3 py-2 bg-charcoal text-ivory-100 text-xs font-body hover:bg-terracotta-500 transition-colors disabled:opacity-60"
                  >
                    {coupon.loading ? (
                      <Loader size={12} className="animate-spin" />
                    ) : (
                      <Tag size={12} />
                    )}{" "}
                    Apply
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-sage-50 border border-sage-200 px-3 py-2 rounded">
                  <span className="font-body text-xs text-sage-600 font-medium">
                    ✓ {coupon.code} applied
                  </span>
                  <button
                    onClick={() =>
                      setCoupon({
                        code: "",
                        discount: 0,
                        applied: false,
                        loading: false,
                        error: "",
                      })
                    }
                  >
                    <X size={14} className="text-sage-500" />
                  </button>
                </div>
              )}
              {coupon.error && (
                <p className="font-body text-xs text-terracotta-500 mt-1">
                  {coupon.error}
                </p>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-2 text-sm font-body border-t border-ivory-200 pt-4">
              <div className="flex justify-between text-charcoal-light">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-charcoal-light">
                <span>Shipping</span>
                <span className={shippingCost === 0 ? "text-sage-500" : ""}>
                  {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                </span>
              </div>
              {coupon.discount > 0 && (
                <div className="flex justify-between text-sage-500">
                  <span>Discount ({coupon.code})</span>
                  <span>-{formatPrice(coupon.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-charcoal text-base pt-2 border-t border-ivory-200">
                <span>Total</span>
                <span className="text-terracotta-500">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader size={24} className="animate-spin text-terracotta-500" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
