"use client";
import { useEffect } from "react";
import { useSettingsStore } from "../../store/settingsStore";

export default function SizeGuidePage() {
  const { settings, fetch } = useSettingsStore();
  useEffect(() => {
    fetch();
  }, []);

  const sg = settings?.sizeGuide || {};
  const rows = sg.rows || [];
  const brand = settings?.brand || {};

  const cols = [
    { key: "size", label: "Size" },
    { key: "chest", label: `Chest (${sg.unit || "cm"})` },
    { key: "waist", label: `Waist (${sg.unit || "cm"})` },
    { key: "hips", label: `Hips (${sg.unit || "cm"})` },
    { key: "ukSize", label: "UK Size" },
    { key: "pkSize", label: "PK/Shalwar" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-12">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-terracotta-500 mb-3">
          Find Your Fit
        </p>
        <h1 className="section-title mb-4">Size Guide</h1>
        <p className="font-body text-sm text-charcoal-light max-w-xl">
          {sg.note ||
            "All measurements are in centimetres. We recommend measuring yourself for the best fit."}
        </p>
      </div>

      {/* How to measure */}
      <div className="grid md:grid-cols-3 gap-6 mb-12 bg-ivory-50 border border-ivory-200 p-8">
        {[
          {
            title: "Chest / Bust",
            desc: "Measure around the fullest part of your chest, keeping the tape parallel to the floor.",
          },
          {
            title: "Waist",
            desc: "Measure around your natural waistline, the narrowest part of your torso.",
          },
          {
            title: "Hips",
            desc: "Measure around the fullest part of your hips, approximately 20cm below your waist.",
          },
        ].map((m) => (
          <div key={m.title}>
            <h3 className="font-body text-sm font-semibold text-charcoal mb-2">
              {m.title}
            </h3>
            <p className="font-body text-xs text-charcoal-light leading-relaxed">
              {m.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-charcoal text-ivory-100">
              {cols.map((c) => (
                <th
                  key={c.key}
                  className="px-5 py-4 text-left text-xs font-body tracking-widest uppercase"
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={`border-b border-ivory-200 ${
                  i % 2 === 0 ? "bg-ivory-50" : "bg-ivory-100"
                }`}
              >
                {cols.map((c) => (
                  <td
                    key={c.key}
                    className={`px-5 py-4 font-body text-sm ${
                      c.key === "size"
                        ? "font-semibold text-charcoal"
                        : "text-charcoal"
                    }`}
                  >
                    {row[c.key] || "—"}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-charcoal-light font-body text-sm"
                >
                  Size guide not configured yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-5 bg-terracotta-50 border border-terracotta-200">
        <p className="font-body text-sm text-terracotta-700">
          <span className="font-medium">Still unsure?</span> WhatsApp us at{" "}
          <a
            href={`https://wa.me/${brand.whatsappNumber || "923001234567"}`}
            className="underline font-medium"
          >
            {brand.phone || "0300-1234567"}
          </a>{" "}
          with your measurements and we'll recommend your perfect size.
        </p>
      </div>
    </div>
  );
}
