"use client";
import { useEffect } from "react";
import { useSettingsStore } from "../../store/settingsStore";

export default function CareersPage() {
  const { settings, fetch } = useSettingsStore();
  useEffect(() => {
    fetch();
  }, []);

  const careers = settings?.careers || {};
  const jobs = (careers.jobs || []).filter((j) => j.isActive !== false);
  const values = careers.values || [];
  const brand = settings?.brand || {};

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-14">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-terracotta-500 mb-3">
          Join Us
        </p>
        <h1 className="section-title mb-4">Careers</h1>
        <p className="font-body text-sm text-charcoal-light max-w-xl leading-relaxed">
          {careers.headline || "We're building something real. Join us."}
        </p>
      </div>

      {values.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {values.map((v, i) => (
            <div key={i} className="bg-ivory-50 border border-ivory-200 p-6">
              <h3 className="font-body text-sm font-semibold text-charcoal mb-2">
                {v.title}
              </h3>
              <p className="font-body text-xs text-charcoal-light leading-relaxed">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      )}

      <h2 className="font-display text-3xl text-charcoal mb-8">
        Open Positions
      </h2>

      {jobs.length === 0 ? (
        <div className="bg-ivory-50 border border-ivory-200 p-10 text-center mb-10">
          <p className="font-body text-sm text-charcoal-light">
            No open positions right now. Check back soon!
          </p>
        </div>
      ) : (
        <div className="space-y-5 mb-12">
          {jobs.map((role, i) => (
            <div
              key={i}
              className="border border-ivory-200 p-6 md:p-8 hover:border-terracotta-300 transition-colors"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <h3 className="font-body text-base font-semibold text-charcoal">
                  {role.title}
                </h3>
                <div className="flex gap-2">
                  <span className="font-body text-xs bg-ivory-200 text-charcoal px-3 py-1">
                    {role.type}
                  </span>
                  <span className="font-body text-xs bg-terracotta-50 text-terracotta-600 px-3 py-1">
                    {role.location}
                  </span>
                </div>
              </div>
              <p className="font-body text-sm text-charcoal-light leading-relaxed mb-4">
                {role.description}
              </p>
              <a
                href={`mailto:careers@${
                  (brand.email || "hello@libaas-e-farda.com").split("@")[1]
                }?subject=Application: ${role.title}`}
                className="inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase text-terracotta-500 border-b border-terracotta-300 pb-0.5"
              >
                Apply Now →
              </a>
            </div>
          ))}
        </div>
      )}

      <div className="bg-charcoal text-ivory-100 p-8 text-center">
        <p className="font-display text-2xl mb-3">Don't see your role?</p>
        <p className="font-body text-sm text-ivory-400 mb-6">
          Send us your CV — if you're exceptional, we'll find a place for you.
        </p>
        <a
          href={`mailto:${brand.email || "hello@libaas-e-farda.com"}`}
          className="btn-primary inline-block"
        >
          Send Your CV
        </a>
      </div>
    </div>
  );
}
