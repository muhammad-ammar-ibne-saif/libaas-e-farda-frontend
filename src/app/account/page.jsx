"use client";
import { useState, useEffect } from "react";
import { useCustomerStore } from "../../store/customerStore";
import Link from "next/link";
import {
  User,
  ShoppingBag,
  LogOut,
  Eye,
  EyeOff,
  Package,
  ChevronDown,
  ChevronUp,
  MapPin,
  CreditCard,
} from "lucide-react";
import { formatPrice } from "../../lib/utils";

const inp =
  "w-full border border-ivory-300 focus:border-charcoal bg-ivory-50 px-4 py-3 text-sm font-body text-charcoal outline-none transition-colors";

const statusColors = {
  placed: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-indigo-100 text-indigo-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function OrderCard({ order }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-ivory-50 border border-ivory-200">
      {/* Summary row */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between p-5 text-left hover:bg-ivory-100 transition-colors"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <span className="font-mono font-bold text-terracotta-500 text-sm">
              {order.orderNumber}
            </span>
            <span
              className={`text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase ${
                statusColors[order.orderStatus] || "bg-gray-100 text-gray-600"
              }`}
            >
              {order.orderStatus}
            </span>
            {order.trackingNumber && (
              <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium font-mono">
                📦 {order.trackingNumber}
              </span>
            )}
          </div>
          <p className="font-body text-xs text-charcoal-light">
            {new Date(order.createdAt).toLocaleDateString("en-PK", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {" · "}
            {order.items?.length || 0} item
            {order.items?.length !== 1 ? "s" : ""}
            {" · "}
            {order.paymentMethod?.toUpperCase()}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
          <span className="font-body text-sm font-semibold text-charcoal">
            {formatPrice(order.pricing?.total || 0)}
          </span>
          {open ? (
            <ChevronUp size={15} className="text-charcoal-light" />
          ) : (
            <ChevronDown size={15} className="text-charcoal-light" />
          )}
        </div>
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="border-t border-ivory-200 px-5 pb-5 pt-4 space-y-4">
          {/* Items */}
          {order.items?.length > 0 && (
            <div>
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal-light mb-3">
                Items Ordered
              </p>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-14 object-cover rounded flex-shrink-0"
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

          {/* Pricing */}
          <div className="border-t border-ivory-100 pt-3 space-y-1.5">
            {[
              { label: "Subtotal", val: order.pricing?.subtotal },
              {
                label: "Shipping",
                val:
                  order.pricing?.shippingCost === 0
                    ? null
                    : order.pricing?.shippingCost,
                free: order.pricing?.shippingCost === 0,
              },
              {
                label: "Discount",
                val:
                  order.pricing?.discount > 0 ? -order.pricing.discount : null,
              },
            ]
              .filter((r) => r.val !== undefined && r.val !== null)
              .map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between font-body text-xs text-charcoal-light"
                >
                  <span>{row.label}</span>
                  <span>
                    {row.free ? "Free" : formatPrice(Math.abs(row.val))}
                  </span>
                </div>
              ))}
            <div className="flex justify-between font-body text-sm font-semibold text-charcoal pt-1.5 border-t border-ivory-100">
              <span>Total</span>
              <span>{formatPrice(order.pricing?.total || 0)}</span>
            </div>
          </div>

          {/* Shipping address */}
          {order.shippingAddress && (
            <div className="flex items-start gap-2 pt-1">
              <MapPin
                size={13}
                className="text-charcoal-light mt-0.5 flex-shrink-0"
              />
              <p className="font-body text-xs text-charcoal-light leading-relaxed">
                {order.shippingAddress.street}, {order.shippingAddress.city}
                {order.shippingAddress.province &&
                  `, ${order.shippingAddress.province}`}
              </p>
            </div>
          )}

          {/* Track link */}
          <div className="pt-1">
            <Link
              href={`/orders?order=${order.orderNumber}`}
              className="inline-flex items-center gap-1.5 font-body text-xs text-terracotta-500 hover:underline"
            >
              Track this order →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function AuthForm({ onSuccess }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, register } = useCustomerStore();

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "login") await login(form.email, form.password);
      else await register(form.name, form.email, form.phone, form.password);
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-terracotta-500 mb-2">
          My Account
        </p>
        <h1 className="section-title">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h1>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 mb-5">
          {error}
        </div>
      )}
      <form onSubmit={submit} className="space-y-4">
        {mode === "register" && (
          <>
            <input
              value={form.name}
              onChange={(e) => upd("name", e.target.value)}
              placeholder="Full Name"
              required
              className={inp}
            />
            <input
              value={form.phone}
              onChange={(e) => upd("phone", e.target.value)}
              placeholder="Phone (optional)"
              type="tel"
              className={inp}
            />
          </>
        )}
        <input
          value={form.email}
          onChange={(e) => upd("email", e.target.value)}
          placeholder="Email Address"
          type="email"
          required
          className={inp}
        />
        <div className="relative">
          <input
            value={form.password}
            onChange={(e) => upd("password", e.target.value)}
            placeholder="Password"
            type={showPw ? "text" : "password"}
            required
            className={`${inp} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-light hover:text-terracotta-500"
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-ivory-100/30 border-t-ivory-100 rounded-full animate-spin" />
          )}
          {loading
            ? "Please wait..."
            : mode === "login"
            ? "Sign In"
            : "Create Account"}
        </button>
      </form>
      <p className="text-center font-body text-sm text-charcoal-light mt-6">
        {mode === "login"
          ? "Don't have an account? "
          : "Already have an account? "}
        <button
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError("");
          }}
          className="text-terracotta-500 hover:underline font-medium"
        >
          {mode === "login" ? "Register" : "Sign In"}
        </button>
      </p>
    </div>
  );
}

function ProfileTab({ customer }) {
  const { updateProfile } = useCustomerStore();
  const [form, setForm] = useState({
    name: customer?.name || "",
    phone: customer?.phone || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const save = async () => {
    setSaving(true);
    await updateProfile(form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  return (
    <div className="max-w-md space-y-4">
      {[
        { k: "name", l: "Full Name", ph: "Your name" },
        { k: "phone", l: "Phone Number", ph: "03XX-XXXXXXX", t: "tel" },
      ].map((f) => (
        <div key={f.k}>
          <label className="block text-xs font-body tracking-wider text-charcoal-light mb-1.5">
            {f.l}
          </label>
          <input
            type={f.t || "text"}
            value={form[f.k]}
            onChange={(e) => setForm((p) => ({ ...p, [f.k]: e.target.value }))}
            placeholder={f.ph}
            className={inp}
          />
        </div>
      ))}
      <div>
        <label className="block text-xs font-body tracking-wider text-charcoal-light mb-1.5">
          Email Address
        </label>
        <input
          value={customer?.email}
          disabled
          className={`${inp} opacity-50 cursor-not-allowed`}
        />
        <p className="text-xs text-charcoal-light mt-1">
          Email cannot be changed
        </p>
      </div>
      <button
        onClick={save}
        disabled={saving}
        className={`btn-primary ${saved ? "!bg-sage-400" : ""}`}
      >
        {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
      </button>
    </div>
  );
}

function AccountDashboard() {
  const { customer, logout, fetchOrders } = useCustomerStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("orders");

  useEffect(() => {
    fetchOrders().then((o) => {
      setOrders(o);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase text-terracotta-500 mb-1">
            My Account
          </p>
          <h1 className="font-display text-4xl text-charcoal font-light">
            Hello, {customer?.name?.split(" ")[0]} 👋
          </h1>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm font-body text-charcoal-light hover:text-terracotta-500 transition-colors"
        >
          <LogOut size={15} /> Sign Out
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Orders", value: orders.length },
          {
            label: "Total Spent",
            value: `Rs. ${orders
              .reduce((s, o) => s + (o.pricing?.total || 0), 0)
              .toLocaleString()}`,
          },
          {
            label: "Member Since",
            value: new Date(
              customer?.createdAt || Date.now()
            ).toLocaleDateString("en-PK", { month: "short", year: "numeric" }),
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-ivory-50 border border-ivory-200 p-5 text-center"
          >
            <p className="font-display text-2xl text-terracotta-500">
              {s.value}
            </p>
            <p className="font-body text-xs text-charcoal-light uppercase tracking-wider mt-1">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6">
        {[
          { k: "orders", l: "Orders", icon: ShoppingBag },
          { k: "profile", l: "Profile", icon: User },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-body tracking-widest uppercase font-medium transition-colors ${
              tab === t.k
                ? "bg-charcoal text-ivory-100"
                : "bg-ivory-200 text-charcoal hover:bg-ivory-300"
            }`}
          >
            <t.icon size={13} />
            {t.l}
          </button>
        ))}
      </div>

      {tab === "orders" &&
        (loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-7 h-7 border-2 border-terracotta-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <Package size={40} className="text-ivory-300 mx-auto mb-4" />
            <p className="font-display text-2xl text-charcoal mb-2">
              No orders yet
            </p>
            <p className="font-body text-sm text-charcoal-light mb-6">
              Time to treat yourself.
            </p>
            <Link href="/shop" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        ))}

      {tab === "profile" && <ProfileTab customer={customer} />}
    </div>
  );
}

export default function AccountPage() {
  const { isLoggedIn } = useCustomerStore();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    useCustomerStore.persist.rehydrate();
    setHydrated(true);
  }, []);
  if (!hydrated) return null;
  return isLoggedIn() ? <AccountDashboard /> : <AuthForm />;
}
