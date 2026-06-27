"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("lef_cookies_accepted");
    if (!accepted) setTimeout(() => setVisible(true), 2000);
  }, []);

  const accept = () => {
    localStorage.setItem("lef_cookies_accepted", "1");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("lef_cookies_accepted", "0");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] animate-fade-up">
      <div className="max-w-4xl mx-auto m-4 bg-charcoal text-ivory-100 rounded-xl shadow-2xl overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-6 py-5">
          <div className="flex-1">
            <p className="font-body text-sm font-medium text-ivory-100 mb-1">
              We use cookies 🍪
            </p>
            <p className="font-body text-xs text-ivory-400 leading-relaxed">
              We use cookies to improve your experience, analyze traffic, and
              personalize content. By continuing you agree to our{" "}
              <Link href="/" className="text-terracotta-400 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={decline}
              className="font-body text-xs text-ivory-400 hover:text-ivory-100 transition-colors px-4 py-2"
            >
              Decline
            </button>
            <button
              onClick={accept}
              className="font-body text-xs bg-terracotta-500 hover:bg-terracotta-600 text-ivory-100 px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
