"use client";
import Image from "next/image";
import { brand } from "../../lib/brand";

/**
 * BrandLogo — shows logo image if configured, falls back to:
 * 1. Urdu name (if set)
 * 2. Brand name as styled text
 *
 * Usage: <BrandLogo />
 * Props:
 *   size   — 'sm' | 'md' | 'lg'  (default 'md')
 *   color  — override text colour
 *   className — extra classes
 */
export default function BrandLogo({ size = "md", color, className = "" }) {
  const logoImage = brand.logoImage;
  const urduName = brand.urduName;
  const brandName = brand.name;
  const logoWidth = brand.logoWidth || 140;
  const logoHeight = brand.logoHeight || 40;

  const sizeMap = {
    sm: { text: "text-lg", sub: "text-[8px]", urdu: "text-base" },
    md: { text: "text-xl", sub: "text-[10px]", urdu: "text-lg" },
    lg: { text: "text-3xl", sub: "text-xs", urdu: "text-2xl" },
  };
  const s = sizeMap[size] || sizeMap.md;

  // ── Image logo ──────────────────────────────────────────────
  if (logoImage) {
    return (
      <div className={`flex items-center ${className}`}>
        <Image
          src={logoImage}
          alt={brandName}
          width={logoWidth}
          height={logoHeight}
          className="object-contain"
          priority
        />
      </div>
    );
  }

  // ── Text logo — urdu + latin ─────────────────────────────────
  return (
    <div className={`text-center ${className}`}>
      {urduName && (
        <div
          className={`font-urdu leading-none ${s.urdu}`}
          style={{ color: color || "var(--color-primary, #C4622D)" }}
        >
          {urduName}
        </div>
      )}
      <div
        className={`font-display tracking-[0.2em] uppercase mt-0.5 whitespace-nowrap font-light ${s.sub}`}
        style={{
          color: color ? `${color}99` : "var(--color-text-secondary, #6b6b6b)",
        }}
      >
        {brandName}
      </div>
    </div>
  );
}
