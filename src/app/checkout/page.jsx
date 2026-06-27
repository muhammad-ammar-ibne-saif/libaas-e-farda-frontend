"use client";
import { useState, useEffect } from "react";
import { useCartStore } from "../../store/cartStore";
import { useSettingsStore } from "../../store/settingsStore";
import { formatPrice, cities, generateOrderNumber } from "../../lib/utils";
import { createOrder, validateCoupon } from "../../lib/api";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, CheckCircle, Tag, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const { settings, fetch: fetchSettings } = useSettingsStore();
  const cartTotal = total();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [shipping, setShipping] = useState("standard");

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    paymentMethod: "cod",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  // Dynamic payment methods from settings
  const paymentMethods = settings?.paymentMethods?.filter(
    (m) => m.isActive
  ) || [
    {
      key: "cod",
      label: "Cash on Delivery",
      description: "Pay when your order arrives",
      icon: "💵",
    },
    {
      key: "jazzcash",
      label: "JazzCash",
      description: "Pay with your JazzCash account",
      icon: "📱",
    },
    {
      key: "easypaisa",
      label: "Easypaisa",
      description: "Pay with your Easypaisa account",
      icon: "💳",
    },
  ];

  const shippingSettings = settings?.shipping || {};
  const freeThreshold = shippingSettings.freeShippingThreshold || 4000;
  const shippingRates = {
    standard: {
      label: `Standard (3-5 days)`,
      price: shippingSettings.standardCost || 199,
    },
    express: {
      label: `Express (1-2 days)`,
      price: shippingSettings.expressCost || 349,
    },
    lahore: {
      label: `Same Day (${shippingSettings.sameDayCity || "Lahore"})`,
      price: shippingSettings.sameDayCost || 249,
    },
  };

  const shippingCost =
    cartTotal >= freeThreshold ? 0 : shippingRates[shipping]?.price || 199;
  const orderTotal = cartTotal + shippingCost - couponDiscount;

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city) e.city = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const data = await validateCoupon(couponInput, cartTotal);
      if (data.success) {
        setCouponCode(couponInput.toUpperCase());
        setCouponDiscount(data.discount);
        setCouponMsg(data.message);
        setCouponError("");
      } else {
        setCouponError(data.message || "Invalid coupon");
        setCouponDiscount(0);
        setCouponCode("");
      }
    } catch {
      setCouponError("Could not validate coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    setCouponMsg("");
    setCouponInput("");
  };

  const placeOrder = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const orderData = {
        customer: {
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          phone: form.phone,
        },
        shippingAddress: {
          street: form.address,
          city: form.city,
          province: form.province,
          postalCode: form.postalCode,
        },
        items: items.map((item) => ({
          productId: item.product._id || item.product.id,
          name: item.product.name,
          price: item.product.salePrice || item.product.price,
          image: item.color?.image || item.product.images?.[0] || "",
          size: item.size || "",
          color: item.color?.name || "Default",
          quantity: item.quantity,
        })),
        paymentMethod: form.paymentMethod,
        shippingOption: shipping,
        couponCode: couponCode || undefined,
        notes: form.notes,
      };

      const data = await createOrder(orderData);
      if (data.success) {
        setOrder({
          ...data.order,
          customerName: form.firstName,
          email: form.email,
          items,
          total: orderTotal,
        });
        clearCart();
        setStep(3);
      } else {
        alert(data.message || "Order failed. Please try again.");
      }
    } catch (e) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step < 3) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-6">
        <ShoppingBag size={48} className="text-ivory-300" />
        <p className="font-display text-3xl text-charcoal">Your bag is empty</p>
        <Link href="/shop" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-10">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-body text-charcoal-light hover:text-terracotta-500 transition-colors mb-6"
        >
          <ArrowLeft size={12} /> Continue Shopping
        </Link>
        <div className="flex items-center gap-0 max-w-sm">
          {["Details", "Payment", "Confirmed"].map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-body font-medium transition-colors ${
                  step > i
                    ? "bg-terracotta-500 text-ivory-100"
                    : step === i + 1
                    ? "bg-charcoal text-ivory-100"
                    : "bg-ivory-200 text-charcoal-light"
                }`}
              >
                {step > i ? "✓" : i + 1}
              </div>
              <div
                className={`text-[10px] font-body ml-1.5 ${
                  step === i + 1
                    ? "text-charcoal font-medium"
                    : "text-charcoal-light"
                }`}
              >
                {s}
              </div>
              {i < 2 && (
                <div
                  className={`flex-1 h-px mx-3 ${
                    step > i + 1 ? "bg-terracotta-500" : "bg-ivory-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ORDER CONFIRMED */}
      {step === 3 && order && (
        <div className="max-w-lg mx-auto text-center py-10">
          <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-sage-400" />
          </div>
          <p className="font-body text-xs tracking-[0.3em] uppercase text-sage-400 mb-3">
            Order Confirmed
          </p>
          <h1 className="font-display text-4xl text-charcoal mb-4">
            Thank you, {order.customerName}!
          </h1>
          <p className="font-body text-sm text-charcoal-light mb-2">
            Order{" "}
            <span className="font-medium text-charcoal">
              #{order.orderNumber}
            </span>{" "}
            placed successfully.
          </p>
          <p className="font-body text-sm text-charcoal-light mb-8">
            Confirmation sent to{" "}
            <span className="text-charcoal">{order.email}</span>.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/shop" className="btn-primary">
              Shop More
            </Link>
            <Link href="/orders" className="btn-outline">
              Track Order
            </Link>
          </div>
        </div>
      )}

      {/* CHECKOUT FORM */}
      {step < 3 && (
        <div className="grid lg:grid-cols-[1fr_380px] gap-10">
          <div className="space-y-8">
            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl text-charcoal">
                  Delivery Details
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {["firstName", "lastName"].map((f) => (
                    <div key={f}>
                      <label className="block text-xs font-body tracking-wider text-charcoal-light mb-1.5 capitalize">
                        {f === "firstName" ? "First Name" : "Last Name"}
                      </label>
                      <input
                        value={form[f]}
                        onChange={(e) => update(f, e.target.value)}
                        className={`w-full bg-ivory-50 border px-4 py-3 text-sm font-body text-charcoal outline-none transition-colors ${
                          errors[f]
                            ? "border-terracotta-400"
                            : "border-ivory-300 focus:border-charcoal"
                        }`}
                      />
                      {errors[f] && (
                        <p className="text-terracotta-500 text-xs mt-1">
                          {errors[f]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                {[
                  {
                    f: "email",
                    label: "Email Address",
                    type: "email",
                    ph: "you@example.com",
                  },
                  {
                    f: "phone",
                    label: "Phone Number",
                    type: "tel",
                    ph: "03XX-XXXXXXX",
                  },
                  {
                    f: "address",
                    label: "Street Address",
                    type: "text",
                    ph: "House #, Street, Area",
                  },
                ].map(({ f, label, type, ph }) => (
                  <div key={f}>
                    <label className="block text-xs font-body tracking-wider text-charcoal-light mb-1.5">
                      {label}
                    </label>
                    <input
                      type={type}
                      value={form[f]}
                      onChange={(e) => update(f, e.target.value)}
                      placeholder={ph}
                      className={`w-full bg-ivory-50 border px-4 py-3 text-sm font-body text-charcoal outline-none transition-colors ${
                        errors[f]
                          ? "border-terracotta-400"
                          : "border-ivory-300 focus:border-charcoal"
                      }`}
                    />
                    {errors[f] && (
                      <p className="text-terracotta-500 text-xs mt-1">
                        {errors[f]}
                      </p>
                    )}
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-body tracking-wider text-charcoal-light mb-1.5">
                      City
                    </label>
                    <select
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                      className={`w-full bg-ivory-50 border px-4 py-3 text-sm font-body text-charcoal outline-none transition-colors ${
                        errors.city
                          ? "border-terracotta-400"
                          : "border-ivory-300 focus:border-charcoal"
                      }`}
                    >
                      <option value="">Select city</option>
                      {cities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {errors.city && (
                      <p className="text-terracotta-500 text-xs mt-1">
                        {errors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-body tracking-wider text-charcoal-light mb-1.5">
                      Postal Code
                    </label>
                    <input
                      value={form.postalCode}
                      onChange={(e) => update("postalCode", e.target.value)}
                      placeholder="54000"
                      className="w-full bg-ivory-50 border border-ivory-300 focus:border-charcoal px-4 py-3 text-sm font-body text-charcoal outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Shipping */}
                <div>
                  <label className="block text-xs font-body tracking-widest uppercase text-charcoal-light mb-3">
                    Shipping Method
                  </label>
                  <div className="space-y-2">
                    {Object.entries(shippingRates).map(([key, rate]) => (
                      <label
                        key={key}
                        className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
                          shipping === key
                            ? "border-charcoal bg-ivory-50"
                            : "border-ivory-200 hover:border-ivory-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            value={key}
                            checked={shipping === key}
                            onChange={() => setShipping(key)}
                            className="accent-terracotta-500"
                          />
                          <p className="font-body text-sm text-charcoal">
                            {rate.label}
                          </p>
                        </div>
                        <span className="font-body text-sm font-medium text-charcoal">
                          {cartTotal >= freeThreshold ? (
                            <span className="text-sage-400">Free</span>
                          ) : (
                            formatPrice(rate.price)
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Coupon */}
                <div>
                  <label className="block text-xs font-body tracking-widest uppercase text-charcoal-light mb-3">
                    Coupon Code
                  </label>
                  {couponCode ? (
                    <div className="flex items-center justify-between bg-sage-50 border border-sage-200 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Tag size={14} className="text-sage-400" />
                        <span className="font-mono text-sm font-medium text-charcoal">
                          {couponCode}
                        </span>
                        <span className="text-xs text-sage-600">
                          {couponMsg}
                        </span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-charcoal-light hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-0">
                      <input
                        value={couponInput}
                        onChange={(e) =>
                          setCouponInput(e.target.value.toUpperCase())
                        }
                        placeholder="Enter coupon code"
                        onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                        className="flex-1 bg-ivory-50 border border-ivory-300 focus:border-charcoal px-4 py-3 text-sm font-body font-mono text-charcoal outline-none transition-colors uppercase"
                      />
                      <button
                        onClick={applyCoupon}
                        disabled={couponLoading}
                        className="bg-charcoal text-ivory-100 px-5 text-xs font-body tracking-widest uppercase hover:bg-terracotta-500 transition-colors disabled:opacity-60"
                      >
                        {couponLoading ? "..." : "Apply"}
                      </button>
                    </div>
                  )}
                  {couponError && (
                    <p className="text-terracotta-500 text-xs mt-1">
                      {couponError}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-body tracking-wider text-charcoal-light mb-1.5">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    rows={3}
                    className="w-full bg-ivory-50 border border-ivory-300 focus:border-charcoal px-4 py-3 text-sm font-body text-charcoal outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  onClick={() => validate() && setStep(2)}
                  className="btn-primary w-full"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="p-1 text-charcoal-light hover:text-terracotta-500 transition-colors"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <h2 className="font-display text-2xl text-charcoal">
                    Payment Method
                  </h2>
                </div>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.key}
                      className={`flex items-center gap-4 p-4 border cursor-pointer transition-all ${
                        form.paymentMethod === method.key
                          ? "border-charcoal bg-ivory-50"
                          : "border-ivory-200 hover:border-ivory-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.key}
                        checked={form.paymentMethod === method.key}
                        onChange={() => update("paymentMethod", method.key)}
                        className="accent-terracotta-500"
                      />
                      <span className="text-xl">{method.icon || "💳"}</span>
                      <div className="flex-1">
                        <p className="font-body text-sm font-medium text-charcoal">
                          {method.label}
                        </p>
                        <p className="font-body text-xs text-charcoal-light">
                          {method.description}
                        </p>
                        {method.key === "bank" && method.accountDetails && (
                          <p className="font-body text-xs text-terracotta-600 mt-1 font-mono">
                            {method.accountDetails}
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
                {(form.paymentMethod === "jazzcash" ||
                  form.paymentMethod === "easypaisa") && (
                  <div className="bg-terracotta-50 border border-terracotta-200 p-4">
                    <p className="font-body text-sm text-terracotta-700">
                      After placing your order, you'll receive payment
                      instructions via WhatsApp.
                    </p>
                  </div>
                )}
                <button
                  onClick={placeOrder}
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 py-4 font-body text-xs tracking-widest uppercase font-medium transition-all ${
                    loading
                      ? "bg-charcoal-light text-ivory-300 cursor-wait"
                      : "bg-charcoal text-ivory-100 hover:bg-terracotta-500"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-ivory-300 border-t-ivory-100 rounded-full animate-spin" />{" "}
                      Placing Order...
                    </>
                  ) : (
                    `Place Order — ${formatPrice(orderTotal)}`
                  )}
                </button>
                <p className="text-center font-body text-xs text-charcoal-light">
                  By placing your order you agree to our Terms & Privacy Policy
                </p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-ivory-50 border border-ivory-200 p-6 sticky top-24">
              <p className="font-body text-xs tracking-widest uppercase text-charcoal-light mb-5">
                Order Summary
              </p>
              <div className="space-y-4 mb-6">
                {items.map((item) => {
                  const price = item.product.salePrice || item.product.price;
                  return (
                    <div key={item.key} className="flex gap-3">
                      <div className="relative w-14 h-16 flex-shrink-0">
                        <img
                          src={item.color?.image || item.product.images?.[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-charcoal text-ivory-100 text-[10px] font-body rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-xs font-medium text-charcoal leading-snug">
                          {item.product.name}
                        </p>
                        <p className="font-body text-xs text-charcoal-light">
                          {item.size} · {item.color?.name}
                        </p>
                      </div>
                      <p className="font-body text-xs font-medium text-charcoal">
                        {formatPrice(price * item.quantity)}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="space-y-3 pt-4 border-t border-ivory-200">
                <div className="flex justify-between">
                  <span className="font-body text-sm text-charcoal-light">
                    Subtotal
                  </span>
                  <span className="font-body text-sm text-charcoal">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-sm text-charcoal-light">
                    Shipping
                  </span>
                  <span
                    className={`font-body text-sm ${
                      cartTotal >= freeThreshold
                        ? "text-sage-400"
                        : "text-charcoal"
                    }`}
                  >
                    {cartTotal >= freeThreshold
                      ? "Free"
                      : formatPrice(shippingCost)}
                  </span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="font-body text-sm text-sage-500">
                      Coupon ({couponCode})
                    </span>
                    <span className="font-body text-sm text-sage-500">
                      -{formatPrice(couponDiscount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-ivory-200">
                  <span className="font-body text-sm font-semibold text-charcoal">
                    Total
                  </span>
                  <span className="font-body text-base font-semibold text-charcoal">
                    {formatPrice(orderTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
