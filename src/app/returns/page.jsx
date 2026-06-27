"use client";
import { useEffect } from "react";
import { useSettingsStore } from "../../store/settingsStore";
import { RotateCcw, CheckCircle, XCircle, MessageCircle } from "lucide-react";

export default function ReturnsPage() {
  const { settings, fetch } = useSettingsStore();
  useEffect(() => {
    fetch();
  }, []);

  const shipping = settings?.shipping || {};
  const brand = settings?.brand || {};

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="font-body text-xs tracking-[0.3em] uppercase text-terracotta-500 mb-3">
        Returns & Exchanges
      </p>
      <h1 className="section-title mb-4">Our Return Policy</h1>
      <p className="font-body text-sm text-charcoal-light mb-14 max-w-xl leading-relaxed">
        {shipping.returnPolicy ||
          "7-day hassle-free returns on unworn, tagged items. We want you to love every piece."}
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-14">
        <div className="p-6 bg-sage-50 border border-sage-200">
          <CheckCircle size={20} className="text-sage-400 mb-3" />
          <h3 className="font-body text-sm font-semibold text-charcoal mb-3">
            We Accept Returns If
          </h3>
          <ul className="space-y-2 font-body text-sm text-charcoal-light">
            {[
              "Item is unworn and in original condition",
              "Original tags are still attached",
              "Within 7 days of delivery",
              "Item is not a sale/final sale item",
            ].map((i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-sage-400 flex-shrink-0 mt-0.5">✓</span>
                {i}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-6 bg-red-50 border border-red-100">
          <XCircle size={20} className="text-red-400 mb-3" />
          <h3 className="font-body text-sm font-semibold text-charcoal mb-3">
            We Cannot Accept
          </h3>
          <ul className="space-y-2 font-body text-sm text-charcoal-light">
            {[
              "Worn, washed or altered items",
              "Items without original tags",
              "Returns after 7 days",
              "Items marked as final sale",
            ].map((i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-400 flex-shrink-0 mt-0.5">✗</span>
                {i}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="font-display text-2xl text-charcoal mb-6">
          How to Return
        </h2>
        <div className="space-y-4">
          {[
            {
              step: "01",
              title: "WhatsApp Us",
              desc: `Message us on ${
                brand.phone || "0300-1234567"
              } with your order number and reason for return.`,
            },
            {
              step: "02",
              title: "Get Approval",
              desc: "We'll confirm eligibility and provide the return address within 24 hours.",
            },
            {
              step: "03",
              title: "Ship It Back",
              desc: "Pack securely and drop at any courier. You cover return shipping cost.",
            },
            {
              step: "04",
              title: "Refund/Exchange",
              desc: "Once received and inspected, we process your refund or exchange within 3 days.",
            },
          ].map((s) => (
            <div
              key={s.step}
              className="flex items-start gap-5 p-5 bg-ivory-50 border border-ivory-200"
            >
              <span className="font-display text-2xl text-terracotta-200 font-light">
                {s.step}
              </span>
              <div>
                <h3 className="font-body text-sm font-semibold text-charcoal mb-1">
                  {s.title}
                </h3>
                <p className="font-body text-xs text-charcoal-light">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-charcoal text-ivory-100 p-6 flex items-start gap-4">
        <MessageCircle
          size={20}
          className="text-terracotta-400 flex-shrink-0 mt-1"
        />
        <div>
          <p className="font-body text-sm font-medium mb-1">
            Questions about a return?
          </p>
          <p className="font-body text-xs text-ivory-400 mb-3">
            Our team responds within 2 hours on WhatsApp.
          </p>
          <a
            href={`https://wa.me/${
              brand.whatsappNumber || "923001234567"
            }?text=Hi! I need help with a return.`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-body bg-[#25D366] text-white px-5 py-2.5 hover:bg-[#20b858] transition-colors"
          >
            <MessageCircle size={13} /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
