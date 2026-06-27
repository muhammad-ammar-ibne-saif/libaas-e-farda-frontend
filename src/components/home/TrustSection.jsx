"use client";
import {
  Truck,
  RotateCcw,
  Shield,
  MessageCircle,
  Star,
  Package,
  Clock,
  Globe,
} from "lucide-react";
import { useSettingsStore } from "../../store/settingsStore";
import { useEffect } from "react";

const ICON_MAP = {
  truck: Truck,
  return: RotateCcw,
  shield: Shield,
  whatsapp: MessageCircle,
  star: Star,
  package: Package,
  clock: Clock,
  globe: Globe,
};

export default function TrustSection() {
  const { settings, fetch } = useSettingsStore();
  useEffect(() => {
    fetch();
  }, []);

  const badges = settings?.trustBadges?.filter((b) => b.isActive) || [];
  const testimonials = settings?.testimonials?.filter((t) => t.isActive) || [];

  // Fallback badges if none configured
  const displayBadges =
    badges.length > 0
      ? badges
      : [
          {
            icon: "truck",
            title: "Free Shipping",
            description: "On orders above Rs. 4,000",
          },
          {
            icon: "return",
            title: "Easy Returns",
            description: "7-day hassle-free returns",
          },
          {
            icon: "shield",
            title: "Quality Assured",
            description: "Every piece hand-checked",
          },
          {
            icon: "whatsapp",
            title: "WhatsApp Support",
            description: "Reply within 2 hours",
          },
        ];

  return (
    <>
      {/* Trust badges strip */}
      <section className="border-y border-ivory-200 bg-ivory-50">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {displayBadges.map((badge, i) => {
              const Icon = ICON_MAP[badge.icon] || Shield;
              return (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-terracotta-500/10">
                    <Icon size={18} className="text-terracotta-500" />
                  </div>
                  <div>
                    <p className="font-body text-xs font-semibold text-charcoal tracking-wide">
                      {badge.title}
                    </p>
                    <p className="font-body text-xs text-charcoal-light mt-0.5">
                      {badge.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-terracotta-500 mb-3">
              Real Women
            </p>
            <h2 className="section-title">What She Said</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((t, i) => (
              <div
                key={t._id || i}
                className="bg-ivory-50 p-8 relative animate-fade-up"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationFillMode: "both",
                }}
              >
                <div className="font-display text-6xl text-terracotta-200 leading-none absolute top-4 right-6 select-none">
                  "
                </div>
                <div className="flex gap-0.5 mb-5">
                  {[...Array(t.rating || 5)].map((_, j) => (
                    <Star
                      key={j}
                      size={13}
                      className="text-terracotta-400 fill-terracotta-400"
                    />
                  ))}
                </div>
                <p className="font-body text-sm text-charcoal leading-relaxed mb-6 relative z-10">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  {t.image && (
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-body text-sm font-medium text-charcoal">
                      {t.name}
                    </p>
                    <p className="font-body text-xs text-charcoal-light">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
