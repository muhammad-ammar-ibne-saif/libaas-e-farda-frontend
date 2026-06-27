"use client";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useSettingsStore } from "../../store/settingsStore";

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-ivory-200">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-4 text-left gap-4"
      >
        <span className="font-body text-sm font-medium text-charcoal">{q}</span>
        {open ? (
          <ChevronUp size={16} className="text-terracotta-500 flex-shrink-0" />
        ) : (
          <ChevronDown
            size={16}
            className="text-charcoal-light flex-shrink-0"
          />
        )}
      </button>
      {open && (
        <p className="pb-4 font-body text-sm text-charcoal-light leading-relaxed">
          {a}
        </p>
      )}
    </div>
  );
}

const defaultFaqs = [
  {
    category: "Orders & Payment",
    items: [
      {
        question: "Do you offer Cash on Delivery?",
        answer: "Yes! COD is available nationwide across Pakistan.",
      },
      {
        question: "Can I modify or cancel my order?",
        answer: "You can cancel within 2 hours by WhatsApp-ing us.",
      },
    ],
  },
  {
    category: "Sizing & Fit",
    items: [
      {
        question: "How do I find my size?",
        answer:
          "Visit our Size Guide for detailed measurements in centimetres.",
      },
    ],
  },
];

export default function FAQsPage() {
  const { settings, fetch } = useSettingsStore();
  useEffect(() => {
    fetch();
  }, []);

  const faqs = settings?.faqs?.length ? settings.faqs : defaultFaqs;
  const brand = settings?.brand;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-14">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-terracotta-500 mb-3">
          Got Questions?
        </p>
        <h1 className="section-title mb-4">Frequently Asked Questions</h1>
        <p className="font-body text-sm text-charcoal-light">
          Can't find your answer?{" "}
          <a
            href={`https://wa.me/${brand?.whatsappNumber || "923001234567"}`}
            className="text-terracotta-500 underline"
          >
            WhatsApp us
          </a>{" "}
          — we reply within 2 hours.
        </p>
      </div>
      <div className="space-y-12">
        {faqs.map((section, i) => (
          <div key={i}>
            <h2 className="font-body text-xs tracking-[0.25em] uppercase font-semibold text-terracotta-500 mb-4 pb-2 border-b border-terracotta-200">
              {section.category}
            </h2>
            <div>
              {(section.items || [])
                .filter((item) => item.question)
                .map((item, j) => (
                  <FAQItem key={j} q={item.question} a={item.answer} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
