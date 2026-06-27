"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSettingsStore } from "../../store/settingsStore";

const defaultSlides = [
  {
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=90",
    tag: "New Collection — Summer 2026",
    title: "Dress the Woman\nYou're Becoming.",
    subtitle: "Modest. Modern. Unmistakably yours.",
    ctaText: "Explore the Collection",
    ctaLink: "/shop",
    align: "left",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const { settings, fetch } = useSettingsStore();

  useEffect(() => {
    fetch();
    setLoaded(true);
  }, []);

  const slides =
    settings?.heroSlides
      ?.filter((s) => s.isActive)
      ?.sort((a, b) => a.order - b.order) || defaultSlides;
  const slide = slides[current] || defaultSlides[0];
  const isRight = slide.align === "right";

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(
      () => setCurrent((c) => (c + 1) % slides.length),
      6000
    );
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <section className="relative h-[85vh] min-h-[600px] max-h-[900px] overflow-hidden">
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img src={s.image} alt="" className="w-full h-full object-cover" />
          <div
            className={`absolute inset-0 ${
              s.align === "right"
                ? "bg-gradient-to-l from-charcoal/80 via-charcoal/30 to-transparent"
                : "bg-gradient-to-r from-charcoal/80 via-charcoal/30 to-transparent"
            }`}
          />
        </div>
      ))}

      <div
        className={`absolute inset-0 flex items-end pb-16 md:pb-20 ${
          isRight ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`max-w-7xl w-full mx-auto px-6 sm:px-10 ${
            isRight ? "text-right" : "text-left"
          }`}
        >
          <div
            className={`max-w-lg ${isRight ? "ml-auto" : ""} ${
              loaded ? "animate-fade-up" : "opacity-0"
            }`}
            style={{ animationDelay: "0.1s", animationFillMode: "both" }}
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-terracotta-300 mb-5">
              {slide.tag}
            </p>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-light text-ivory-100 leading-[1.05] whitespace-pre-line mb-5">
              {slide.title}
            </h1>
            <p className="font-body text-sm md:text-base text-ivory-300 tracking-wider mb-8">
              {slide.subtitle}
            </p>
            <Link
              href={slide.ctaLink || "/shop"}
              className="inline-flex items-center gap-3 bg-ivory-100 text-charcoal px-8 py-4 font-body text-xs tracking-widest uppercase font-medium hover:bg-terracotta-500 hover:text-ivory-100 transition-all duration-300 group"
            >
              {slide.ctaText}
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 ${
                i === current
                  ? "w-8 h-0.5 bg-ivory-100"
                  : "w-2 h-0.5 bg-ivory-100/40"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
