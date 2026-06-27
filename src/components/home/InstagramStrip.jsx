"use client";
import { useEffect } from "react";
import { useSettingsStore } from "../../store/settingsStore";
import { Share2 } from "lucide-react";

export default function InstagramStrip() {
  const { settings, fetch } = useSettingsStore();
  useEffect(() => {
    fetch();
  }, []);

  const ig = settings?.instagramSection;
  const brand = settings?.brand || {};
  const handle = brand.instagramHandle || "libaasefarda";

  if (ig && ig.isActive === false) return null;

  const images = ig?.images?.filter(Boolean) || [];
  const hasImages = images.length > 0;

  return (
    <section className="py-16 overflow-hidden">
      <div className="text-center mb-10">
        <a
          href={`https://instagram.com/${handle}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 font-body text-xs tracking-[0.3em] uppercase text-charcoal hover:text-terracotta-500 transition-colors mb-2"
        >
          <Share2 size={14} />@{handle}
        </a>
        <p className="font-display text-3xl text-charcoal">
          Wear it. Share it.
        </p>
        <p className="font-body text-sm text-charcoal-light mt-2">
          Tag us on Instagram to be featured here
        </p>
      </div>

      {hasImages ? (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-1">
          {images.slice(0, 6).map((src, i) => (
            <a
              key={i}
              href={`https://instagram.com/${handle}`}
              target="_blank"
              rel="noreferrer"
              className="relative aspect-square overflow-hidden group"
            >
              <img
                src={src}
                alt={`@${handle} post ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => (e.target.style.opacity = "0.3")}
              />
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/40 transition-all duration-300 flex items-center justify-center">
                <Share2
                  size={20}
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto text-center px-6">
          <div className="bg-ivory-50 border-2 border-dashed border-ivory-300 rounded-xl p-12">
            <Share2 size={32} className="text-ivory-300 mx-auto mb-3" />
            <p className="font-body text-sm text-charcoal-light mb-2">
              Instagram photos not configured yet
            </p>
            <p className="font-body text-xs text-charcoal-light">
              Go to Admin → Settings to add your Instagram photos
            </p>
            <a
              href={`https://instagram.com/${handle}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 mt-4 font-body text-xs text-terracotta-500 hover:underline"
            >
              <Share2 size={12} /> Follow @{handle}
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
