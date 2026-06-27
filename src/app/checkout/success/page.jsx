"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight, Loader } from "lucide-react";
import { useCartStore } from "../../../store/cartStore";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    if (!sessionId) {
      router.push("/");
      return;
    }

    const verify = async () => {
      try {
        // Poll up to 5 times waiting for webhook / verify endpoint
        for (let i = 0; i < 5; i++) {
          const res = await fetch(`${API}/payments/verify/${sessionId}`);
          const data = await res.json();
          if (data.success && data.order) {
            setOrder(data.order);
            clearCart();
            return;
          }
          // Wait 1.5s before retry
          await new Promise((r) => setTimeout(r, 1500));
        }
        setError(
          "Payment verified but order is still being processed. Check your email for confirmation."
        );
      } catch (e) {
        setError(
          "Could not verify payment. Please contact us with your payment reference."
        );
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [sessionId]);

  if (loading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader size={32} className="text-terracotta-500 animate-spin" />
        <p className="font-body text-charcoal-light text-sm">
          Confirming your payment...
        </p>
      </div>
    );

  return (
    <div className="max-w-lg mx-auto px-6 py-20 text-center">
      {/* Success icon */}
      <div className="w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={40} className="text-sage-500" />
      </div>

      <h1 className="font-display text-4xl text-charcoal font-light mb-3">
        Payment Confirmed!
      </h1>
      <p className="font-body text-charcoal-light text-sm mb-8 leading-relaxed">
        Thank you for your order. We've received your payment and will begin
        processing immediately. A confirmation email is on its way to you.
      </p>

      {order && (
        <div className="bg-ivory-50 border border-ivory-200 rounded-xl p-6 mb-8 text-left space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <Package size={16} className="text-terracotta-500" />
            <p className="font-body text-sm font-semibold text-charcoal">
              Order Summary
            </p>
          </div>
          <div className="flex justify-between text-sm font-body">
            <span className="text-charcoal-light">Order Number</span>
            <span className="font-mono font-bold text-terracotta-500">
              {order.orderNumber}
            </span>
          </div>
          <div className="flex justify-between text-sm font-body">
            <span className="text-charcoal-light">Items</span>
            <span className="text-charcoal">
              {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex justify-between text-sm font-body">
            <span className="text-charcoal-light">Total Paid</span>
            <span className="font-semibold text-charcoal">
              £{(order.pricing?.total || 0).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm font-body">
            <span className="text-charcoal-light">Payment</span>
            <span className="bg-sage-100 text-sage-600 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase">
              Paid via Card
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <p className="font-body text-sm text-yellow-700">{error}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {order && (
          <Link
            href={`/orders?order=${order.orderNumber}`}
            className="flex items-center justify-center gap-2 btn-primary"
          >
            Track Your Order <ArrowRight size={14} />
          </Link>
        )}
        <Link
          href="/shop"
          className="btn-outline flex items-center justify-center gap-2"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccess() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader size={24} className="animate-spin text-terracotta-500" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
