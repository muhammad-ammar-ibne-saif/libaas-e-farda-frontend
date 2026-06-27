"use client";
import { useEffect } from "react";
import { useSettingsStore } from "../../store/settingsStore";

export default function PressPage() {
  const { settings, fetch } = useSettingsStore();
  useEffect(() => {
    fetch();
  }, []);

  const press = settings?.press || {};
  const brand = settings?.brand || {};
  const entries = (press.entries || []).filter((e) => e.isActive !== false);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-14">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-terracotta-500 mb-3">
          In The News
        </p>
        <h1 className="section-title mb-4">Press</h1>
        <p className="font-body text-sm text-charcoal-light max-w-xl leading-relaxed">
          {press.headline ||
            `For press enquiries, email ${
              brand.email || "press@libaas-e-farda.com"
            }`}
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="bg-ivory-50 border border-ivory-200 p-10 text-center mb-10">
          <p className="font-body text-sm text-charcoal-light">
            No press coverage listed yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6 mb-16">
          {entries.map((item, i) => (
            <div
              key={i}
              className="bg-ivory-50 border border-ivory-200 p-6 md:p-8"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <span className="font-body text-xs tracking-widest uppercase font-semibold text-terracotta-500">
                  {item.outlet}
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-body text-xs text-charcoal-light">
                    {item.date}
                  </span>
                  <span className="font-body text-xs bg-ivory-200 text-charcoal px-2 py-0.5">
                    {item.type}
                  </span>
                </div>
              </div>
              <p className="font-display text-xl md:text-2xl text-charcoal font-light leading-snug italic">
                {item.headline}
              </p>
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-3 font-body text-xs text-terracotta-500 hover:underline"
                >
                  Read article →
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="bg-charcoal text-ivory-100 p-8 md:p-12">
        <h2 className="font-display text-3xl mb-4">Press Kit</h2>
        <p className="font-body text-sm text-ivory-400 leading-relaxed mb-6">
          Download our press kit including brand guidelines, imagery, founder
          bio, and brand story.
        </p>
        <a
          href={`mailto:${brand.email || "hello@libaas-e-farda.com"}`}
          className="inline-flex items-center gap-2 bg-terracotta-500 text-ivory-100 px-6 py-3 font-body text-xs tracking-widest uppercase hover:bg-terracotta-600 transition-colors"
        >
          Request Press Kit
        </a>
      </div>
    </div>
  );
}
