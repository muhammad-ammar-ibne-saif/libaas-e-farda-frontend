"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { useSettingsStore } from "../../store/settingsStore";
import BrandLogo from "../../components/ui/BrandLogo";
import { brand as brandConfig } from "../../lib/brand";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { settings, fetch } = useSettingsStore();
  useEffect(() => {
    fetch();
  }, []);

  const brand = settings?.brand || {};
  const theme = settings?.theme || {};
  const columns = settings?.footerColumns || [
    {
      title: "Shop",
      links: [
        { label: "New Arrivals", href: "/shop?filter=new" },
        { label: "Sale", href: "/shop?filter=sale" },
      ],
    },
    {
      title: "Help",
      links: [
        { label: "Track Order", href: "/orders" },
        { label: "FAQs", href: "/faqs" },
        { label: "Returns", href: "/returns" },
      ],
    },
    {
      title: "Brand",
      links: [
        { label: "Our Story", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "/careers" },
      ],
    },
  ];

  const socials = [
    brand.instagramHandle && {
      label: "Instagram",
      href: `https://instagram.com/${brand.instagramHandle}`,
      icon: "📷",
    },
    brand.facebookHandle && {
      label: "Facebook",
      href: `https://facebook.com/${brand.facebookHandle}`,
      icon: "📘",
    },
    brand.tiktokHandle && {
      label: "TikTok",
      href: `https://tiktok.com/@${brand.tiktokHandle}`,
      icon: "🎵",
    },
    brand.youtubeHandle && {
      label: "YouTube",
      href: `https://youtube.com/@${brand.youtubeHandle}`,
      icon: "▶️",
    },
    brand.pinterestHandle && {
      label: "Pinterest",
      href: `https://pinterest.com/${brand.pinterestHandle}`,
      icon: "📌",
    },
  ].filter(Boolean);

  const footerBg = theme?.footerBg || "#2D2D2D";
  const footerText = theme?.footerText || "#F5F0E8";
  const primary = theme?.primary || "#C4622D";

  return (
    <footer
      style={{ backgroundColor: footerBg, color: footerText }}
      className="mt-24"
    >
      {/* Newsletter strip */}
      <div className="border-b" style={{ borderColor: `${footerText}15` }}>
        <div className="max-w-7xl mx-auto px-6 py-14 md:flex items-center justify-between gap-12">
          <div className="mb-8 md:mb-0">
            <BrandLogo size="lg" color={primary} className="mb-3" />
            <p
              className="font-display text-3xl italic font-light"
              style={{ color: footerText }}
            >
              {settings?.about?.storyTitle || brandConfig.tagline}
            </p>
          </div>
          <div className="md:w-[420px]">
            <p
              className="text-xs tracking-widest uppercase mb-4 font-body"
              style={{ color: `${footerText}99` }}
            >
              New arrivals, styling notes & exclusive offers
            </p>
            {subscribed ? (
              <p className="font-body text-sm" style={{ color: primary }}>
                ✓ You're on the list. Welcome to Farda.
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) setSubscribed(true);
                }}
                className="flex gap-0"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 px-4 py-3 text-sm font-body outline-none border-0"
                  style={{
                    backgroundColor: `${footerText}15`,
                    color: footerText,
                  }}
                />
                <button
                  type="submit"
                  className="px-5 py-3 transition-colors"
                  style={{ backgroundColor: primary, color: footerText }}
                >
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main footer columns */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        {columns.map((col, ci) => (
          <div key={ci}>
            <h4
              className="text-xs tracking-widest uppercase font-body font-medium mb-5"
              style={{ color: `${footerText}99` }}
            >
              {col.title}
            </h4>
            <ul className="space-y-3">
              {(col.links || [])
                .filter((l) => l.isActive !== false)
                .map((link, li) => (
                  <li key={li}>
                    <Link
                      href={link.href || "/"}
                      className="text-sm font-body transition-colors"
                      style={{ color: `${footerText}66` }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = primary)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = `${footerText}66`)
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}

        {/* Follow column */}
        <div>
          <h4
            className="text-xs tracking-widest uppercase font-body font-medium mb-5"
            style={{ color: `${footerText}99` }}
          >
            Follow
          </h4>
          <div className="flex flex-wrap gap-2 mb-6">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs font-body border px-3 py-1.5 transition-colors"
                style={{
                  borderColor: `${footerText}20`,
                  color: `${footerText}66`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = primary;
                  e.currentTarget.style.color = primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${footerText}20`;
                  e.currentTarget.style.color = `${footerText}66`;
                }}
              >
                <span>{s.icon}</span> {s.label}
              </a>
            ))}
          </div>
          {brand.whatsappNumber && (
            <a
              href={`https://wa.me/${brand.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-body border px-4 py-2 transition-colors"
              style={{ borderColor: `${primary}40`, color: primary }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = `${primary}15`)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              WhatsApp Us
            </a>
          )}
          <div
            className="mt-4 text-xs font-body leading-relaxed"
            style={{ color: `${footerText}44` }}
          >
            {brand.address && <p>{brand.address}</p>}
            {brand.businessHours && <p>{brand.businessHours}</p>}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t" style={{ borderColor: `${footerText}15` }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs font-body" style={{ color: `${footerText}44` }}>
            © {new Date().getFullYear()} {brandConfig.name}. All rights
            reserved.
          </p>
          <div className="flex gap-5">
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <Link
                key={item}
                href="/"
                className="text-xs font-body transition-colors"
                style={{ color: `${footerText}44` }}
                onMouseEnter={(e) => (e.currentTarget.style.color = primary)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = `${footerText}44`)
                }
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
