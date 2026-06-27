"use client";
import { useState } from "react";
import { Bell, X, CheckCircle } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function BackInStock({ product }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await fetch(`${API}/back-in-stock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id || product.id,
          productName: product.name,
          email,
        }),
      });
      setDone(true);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  if (product.stock > 0) return null;

  return (
    <div className="w-full">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3 border border-ivory-300 font-body text-xs tracking-widest uppercase font-medium text-charcoal hover:border-terracotta-400 hover:text-terracotta-500 transition-colors"
        >
          <Bell size={13} /> Notify Me When Available
        </button>
      ) : (
        <div className="border border-ivory-200 bg-ivory-50 p-4 rounded">
          <div className="flex items-center justify-between mb-3">
            <p className="font-body text-sm font-medium text-charcoal">
              Get Notified
            </p>
            <button
              onClick={() => setOpen(false)}
              className="text-charcoal-light hover:text-terracotta-500"
            >
              <X size={14} />
            </button>
          </div>
          {done ? (
            <div className="flex items-center gap-2 text-sage-500">
              <CheckCircle size={16} />
              <p className="font-body text-sm">
                We'll email you when this is back in stock!
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 border border-ivory-300 focus:border-charcoal bg-ivory-100 px-3 py-2 text-sm font-body text-charcoal outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-charcoal text-ivory-100 px-4 py-2 text-xs font-body font-medium hover:bg-terracotta-500 transition-colors disabled:opacity-60"
              >
                {loading ? "..." : "Notify Me"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
