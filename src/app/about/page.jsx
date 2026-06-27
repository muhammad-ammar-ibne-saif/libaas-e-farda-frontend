"use client";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSettingsStore } from "../../store/settingsStore";

export default function AboutPage() {
  const { settings, fetch } = useSettingsStore();
  useEffect(() => {
    fetch();
  }, []);

  const about = settings?.about || {};
  const brand = settings?.brand || {};

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Hero */}
      <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase text-terracotta-500 mb-4">
            Our Story
          </p>
          <div className="font-urdu text-4xl text-terracotta-500 mb-4">
            لباسِ فردا
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-light text-charcoal leading-tight mb-8">
            {about.storyTitle || "Made for the woman building her tomorrow"}
          </h1>
          <div className="space-y-5 font-body text-sm text-charcoal leading-relaxed">
            {[
              about.storyParagraph1,
              about.storyParagraph2,
              about.storyParagraph3,
            ]
              .filter(Boolean)
              .map((p, i) => (
                <p key={i}>{p}</p>
              ))}
          </div>
        </div>
        <div className="relative aspect-square">
          <img
            src={
              about.storyImage ||
              "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&q=80"
            }
            alt="Brand story"
            className="w-full h-full object-cover"
          />
          <div className="absolute -bottom-6 -left-6 bg-terracotta-500 w-32 h-32 flex items-center justify-center">
            <p className="font-display italic text-ivory-100 text-lg text-center leading-tight px-4">
              {about.quoteText || '"She has places to be."'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      {(about.stats || []).length > 0 && (
        <div className="grid grid-cols-3 gap-6 mb-20 py-10 border-y border-ivory-200">
          {(about.stats || []).map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-display text-4xl text-terracotta-500">
                {stat.number}
              </div>
              <div className="font-body text-xs text-charcoal-light tracking-wider mt-1 uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Values */}
      <div className="py-20 border-y border-ivory-200">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-terracotta-500 mb-3 text-center">
          What We Stand For
        </p>
        <h2 className="section-title text-center mb-16">
          {about.valuesTitle || "Our Values"}
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {(about.values || []).map((v, i) => (
            <div key={i} className="relative pt-8">
              <div className="font-display text-7xl font-light text-ivory-200 absolute top-0 left-0 leading-none select-none">
                {v.number || String(i + 1).padStart(2, "0")}
              </div>
              <div className="relative z-10">
                <h3 className="font-display text-2xl text-charcoal mb-4">
                  {v.title}
                </h3>
                <p className="font-body text-sm text-charcoal-light leading-relaxed">
                  {v.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center py-20">
        <h2 className="section-title mb-6">Ready to meet your wardrobe?</h2>
        <Link
          href="/shop"
          className="btn-primary inline-flex items-center gap-2"
        >
          Shop the Collection <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
