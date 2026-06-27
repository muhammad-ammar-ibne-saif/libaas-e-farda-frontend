"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useSettingsStore } from "../store/settingsStore";

export default function NotFound() {
  const { settings, fetch } = useSettingsStore();
  useEffect(() => {
    fetch();
  }, []);

  const brand = settings?.brand;

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <div className="font-urdu text-terracotta-200 text-5xl mb-4 select-none">
        لباسِ فردا
      </div>
      <div className="font-display text-[120px] md:text-[160px] font-light text-ivory-200 leading-none select-none">
        404
      </div>
      <h1 className="font-display text-3xl text-charcoal -mt-4 mb-4">
        Page not found
      </h1>
      <p className="font-body text-sm text-charcoal-light mb-8 max-w-sm leading-relaxed">
        The page you're looking for has gone off to find its next chapter.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
        <Link href="/shop" className="btn-outline">
          Browse the Collection
        </Link>
      </div>
      {brand?.whatsappNumber && (
        <a
          href={`https://wa.me/${brand.whatsappNumber}?text=Hi, I got a 404 error on your site and need help.`}
          target="_blank"
          rel="noreferrer"
          className="mt-6 font-body text-xs text-charcoal-light hover:text-terracotta-500 transition-colors underline underline-offset-2"
        >
          Need help? Chat on WhatsApp
        </a>
      )}
    </div>
  );
}
