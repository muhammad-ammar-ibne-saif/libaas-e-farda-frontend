"use client";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSettingsStore } from "../../store/settingsStore";

export default function BrandStory() {
  const { settings, fetch } = useSettingsStore();
  useEffect(() => {
    fetch();
  }, []);

  const about = settings?.about || {};
  const theme = settings?.theme || {};

  const stats = about.stats || [
    { number: "2,000+", label: "Women dressed" },
    { number: "6", label: "Core pieces" },
    { number: "100%", label: "Pakistan made" },
  ];

  return (
    <section
      className="relative overflow-hidden py-24"
      style={{ backgroundColor: theme?.dark || "#2D2D2D" }}
    >
      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
        {/* Image collage */}
        <div className="relative h-[400px] md:h-[500px]">
          <div className="absolute top-0 left-0 w-3/4 h-4/5 overflow-hidden">
            <img
              src={
                about.storyImage ||
                "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&q=80"
              }
              alt="Brand story"
              className="w-full h-full object-cover grayscale"
            />
          </div>
          <div
            className="absolute bottom-0 right-0 w-1/2 h-1/2 overflow-hidden border-4"
            style={{ borderColor: theme?.dark || "#2D2D2D" }}
          >
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          {/* Quote block */}
          <div
            className="absolute -bottom-4 left-8 px-6 py-4 max-w-[220px]"
            style={{ backgroundColor: theme?.primary || "#C4622D" }}
          >
            <p
              className="font-display text-sm italic leading-snug"
              style={{ color: theme?.buttonText || "#F5F0E8" }}
            >
              {about.quoteText || '"She has places to be."'}
            </p>
          </div>
        </div>

        {/* Text content */}
        <div>
          <p
            className="font-body text-xs tracking-[0.3em] uppercase mb-4"
            style={{ color: theme?.primary || "#C4622D" }}
          >
            Our Story
          </p>
          <div
            className="font-urdu text-3xl mb-4"
            style={{ color: theme?.primary || "#C4622D" }}
          >
            لباسِ فردا
          </div>
          <h2
            className="font-display text-4xl md:text-5xl font-light leading-tight mb-8"
            style={{ color: theme?.buttonText || "#F5F0E8" }}
          >
            {about.storyTitle || "Made for the woman building her tomorrow"}
          </h2>
          <div
            className="space-y-4 font-body text-sm leading-relaxed mb-10"
            style={{ color: `${theme?.buttonText || "#F5F0E8"}99` }}
          >
            {[about.storyParagraph1, about.storyParagraph2]
              .filter(Boolean)
              .map((p, i) => (
                <p key={i}>{p}</p>
              ))}
          </div>

          {/* Stats */}
          {stats.length > 0 && (
            <div
              className="grid grid-cols-3 gap-6 mb-10 pt-8 border-t"
              style={{ borderColor: `${theme?.buttonText || "#F5F0E8"}15` }}
            >
              {stats.map((s, i) => (
                <div key={i}>
                  <div
                    className="font-display text-3xl"
                    style={{ color: theme?.primary || "#C4622D" }}
                  >
                    {s.number}
                  </div>
                  <div
                    className="font-body text-[10px] uppercase tracking-wider mt-1"
                    style={{ color: `${theme?.buttonText || "#F5F0E8"}66` }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link
            href="/about"
            className="inline-flex items-center gap-3 font-body text-xs tracking-widest uppercase font-medium transition-all group px-8 py-4"
            style={{
              backgroundColor: theme?.buttonText || "#F5F0E8",
              color: theme?.dark || "#2D2D2D",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                theme?.primary || "#C4622D";
              e.currentTarget.style.color = theme?.buttonText || "#F5F0E8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                theme?.buttonText || "#F5F0E8";
              e.currentTarget.style.color = theme?.dark || "#2D2D2D";
            }}
          >
            Read Our Story
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
