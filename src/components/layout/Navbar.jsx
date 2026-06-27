"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCartStore, useWishlistStore } from "../../store/cartStore";
import {
  ShoppingBag,
  Search,
  Heart,
  Menu,
  X,
  ChevronDown,
  User,
} from "lucide-react";
import CartDrawer from "../../components/cart/CartDrawer";
import SearchModal from "../../components/ui/SearchModal";
import { useRouter } from "next/navigation";
import { useSettingsStore } from "../../store/settingsStore";
import BrandLogo from "../../components/ui/BrandLogo";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileSubOpen, setMobileSubOpen] = useState(null);
  const [dynCategories, setDynCategories] = useState([]);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);
  const closeTimer = useRef(null);
  const router = useRouter();

  const count = useCartStore((s) => s.count());
  const openCart = useCartStore((s) => s.openCart);
  const { settings, fetch } = useSettingsStore();

  // Only show count after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    window
      .fetch(`${API_URL}/categories?showInNav=true`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.categories?.length)
          setDynCategories(
            d.categories.filter((c) => c.isActive && c.showInNav)
          );
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setActiveDropdown(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDropdownEnter = (label) => {
    clearTimeout(closeTimer.current);
    setActiveDropdown(label);
  };
  const handleDropdownLeave = () => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 250);
  };
  const handleNavClick = (href) => {
    setMobileOpen(false);
    setActiveDropdown(null);
    router.push(href);
  };

  const announcement = settings?.announcement;
  const theme = settings?.theme || {};

  // Build nav links
  const rawNavLinks = settings?.navLinks || [];
  const hasNavLinks =
    rawNavLinks.filter((l) => l.isActive !== false).length > 0;

  let navLinks;
  if (hasNavLinks) {
    navLinks = rawNavLinks
      .filter((l) => l.isActive !== false)
      .map((link) => {
        if (
          (link.label === "Collections" || link.label === "Shop") &&
          dynCategories.length > 0
        ) {
          return {
            ...link,
            children: [
              { label: "All Pieces", href: "/shop", isActive: true },
              ...dynCategories.map((c) => ({
                label: c.name,
                href: `/shop?category=${c.slug}`,
                isActive: true,
              })),
            ],
          };
        }
        return link;
      });
  } else {
    navLinks = [
      {
        label: "New Arrivals",
        href: "/shop?filter=new",
        isActive: true,
        children: [],
      },
      {
        label: "Collections",
        href: "/shop",
        isActive: true,
        children:
          dynCategories.length > 0
            ? [
                { label: "All Pieces", href: "/shop", isActive: true },
                ...dynCategories.map((c) => ({
                  label: c.name,
                  href: `/shop?category=${c.slug}`,
                  isActive: true,
                })),
              ]
            : [{ label: "All Pieces", href: "/shop", isActive: true }],
      },
      { label: "Our Story", href: "/about", isActive: true, children: [] },
      {
        label: "Size Guide",
        href: "/size-guide",
        isActive: true,
        children: [],
      },
    ];
  }

  const navScrollEffect = theme?.navScrollEffect || "blur";
  const scrollStyle = scrolled
    ? {
        backgroundColor:
          navScrollEffect === "blur"
            ? theme?.navScrollBg || "rgba(245,240,232,0.95)"
            : navScrollEffect === "solid"
            ? theme?.navBg || "#F5F0E8"
            : "transparent",
        backdropFilter: navScrollEffect === "blur" ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.06)" : "none",
      }
    : { backgroundColor: theme?.navBg || "#F5F0E8" };

  return (
    <>
      {/* Announcement bar */}
      {(!announcement || announcement.isActive) && (
        <div
          className="overflow-hidden py-2"
          style={{
            backgroundColor: announcement?.bgColor || "#2D2D2D",
            color: announcement?.textColor || "#F5F0E8",
          }}
        >
          <div className="animate-marquee whitespace-nowrap inline-block font-body text-xs tracking-widest uppercase">
            {[1, 2].map((n) => (
              <span key={n}>
                {announcement?.text ||
                  "Free shipping on orders above Rs. 4,000 · COD available nationwide · New arrivals every Friday"}
                &nbsp;·&nbsp;
              </span>
            ))}
          </div>
        </div>
      )}

      <header
        className="sticky top-0 z-50 transition-all duration-500 border-b border-ivory-200"
        style={scrollStyle}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16 md:h-20 relative">
            {/* Desktop nav */}
            <div
              className="hidden md:flex items-center gap-8 flex-1"
              ref={dropdownRef}
            >
              {navLinks.map((link) => {
                const hasChildren =
                  link.children?.filter((c) => c.isActive !== false).length > 0;
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() =>
                      hasChildren && handleDropdownEnter(link.label)
                    }
                    onMouseLeave={() => hasChildren && handleDropdownLeave()}
                  >
                    <button
                      onClick={() => handleNavClick(link.href)}
                      className="flex items-center gap-1 text-xs tracking-widest uppercase font-body font-medium transition-colors py-2"
                      style={{ color: theme?.navTextColor || "#2D2D2D" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color =
                          theme?.navHoverColor || "#C4622D")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color =
                          theme?.navTextColor || "#2D2D2D")
                      }
                    >
                      {link.label}
                      {hasChildren && (
                        <ChevronDown
                          size={12}
                          className={`transition-transform duration-200 ${
                            activeDropdown === link.label ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>

                    {hasChildren && activeDropdown === link.label && (
                      <div
                        className="absolute top-full left-0 w-56 border border-ivory-200 shadow-lg py-2 z-50"
                        style={{ backgroundColor: theme?.navBg || "#F5F0E8" }}
                        onMouseEnter={() => handleDropdownEnter(link.label)}
                        onMouseLeave={handleDropdownLeave}
                      >
                        {link.children
                          .filter((c) => c.isActive !== false)
                          .map((sub) => (
                            <button
                              key={sub.label}
                              onClick={() => handleNavClick(sub.href)}
                              className="block w-full text-left px-5 py-3 text-xs tracking-wider font-body transition-colors"
                              style={{
                                color: theme?.navTextColor || "#2D2D2D",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color =
                                  theme?.navHoverColor || "#C4622D";
                                e.currentTarget.style.backgroundColor =
                                  theme?.backgroundAlt || "#ede4d4";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color =
                                  theme?.navTextColor || "#2D2D2D";
                                e.currentTarget.style.backgroundColor =
                                  "transparent";
                              }}
                            >
                              {sub.label}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Logo */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2 z-10">
              <BrandLogo size="md" color={theme?.primary} />
            </Link>

            {/* Icons */}
            <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-end">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 transition-colors"
                style={{ color: theme?.navTextColor || "#2D2D2D" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color =
                    theme?.navHoverColor || "#C4622D")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color =
                    theme?.navTextColor || "#2D2D2D")
                }
              >
                <Search size={18} />
              </button>
              <Link
                href="/wishlist"
                className="p-2 transition-colors hidden sm:flex"
                style={{ color: theme?.navTextColor || "#2D2D2D" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color =
                    theme?.navHoverColor || "#C4622D")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color =
                    theme?.navTextColor || "#2D2D2D")
                }
              >
                <Heart size={18} />
              </Link>
              <Link
                href="/account"
                className="p-2 transition-colors hidden sm:flex"
                style={{ color: theme?.navTextColor || "#2D2D2D" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color =
                    theme?.navHoverColor || "#C4622D")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color =
                    theme?.navTextColor || "#2D2D2D")
                }
              >
                <User size={18} />
              </Link>

              {/* Cart button — suppressHydrationWarning on count badge */}
              <button
                onClick={openCart}
                className="p-2 transition-colors relative"
                style={{ color: theme?.navTextColor || "#2D2D2D" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color =
                    theme?.navHoverColor || "#C4622D")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color =
                    theme?.navTextColor || "#2D2D2D")
                }
              >
                <ShoppingBag size={18} />
                {mounted && count > 0 && (
                  <span
                    suppressHydrationWarning
                    className="absolute -top-0.5 -right-0.5 text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center leading-none"
                    style={{
                      backgroundColor: theme?.primary || "#C4622D",
                      color: theme?.buttonText || "#F5F0E8",
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>

              <button
                className="md:hidden p-2 transition-colors ml-1"
                style={{ color: theme?.navTextColor || "#2D2D2D" }}
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="md:hidden border-t border-ivory-200 max-h-[80vh] overflow-y-auto"
            style={{ backgroundColor: theme?.navBg || "#F5F0E8" }}
          >
            <div className="px-5 py-4 space-y-0">
              {navLinks.map((link) => {
                const hasChildren =
                  link.children?.filter((c) => c.isActive !== false).length > 0;
                return (
                  <div key={link.label}>
                    {hasChildren ? (
                      <>
                        <button
                          className="flex items-center justify-between w-full py-3.5 text-sm tracking-widest uppercase font-body font-medium border-b border-ivory-200"
                          style={{ color: theme?.navTextColor || "#2D2D2D" }}
                          onClick={() =>
                            setMobileSubOpen(
                              mobileSubOpen === link.label ? null : link.label
                            )
                          }
                        >
                          {link.label}
                          <ChevronDown
                            size={14}
                            className={`transition-transform ${
                              mobileSubOpen === link.label ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {mobileSubOpen === link.label && (
                          <div
                            className="py-2 pl-4 space-y-0"
                            style={{
                              backgroundColor:
                                theme?.backgroundAlt || "#ede4d4",
                            }}
                          >
                            {link.children
                              .filter((c) => c.isActive !== false)
                              .map((sub) => (
                                <button
                                  key={sub.label}
                                  onClick={() => handleNavClick(sub.href)}
                                  className="block w-full text-left py-2.5 text-xs tracking-wider font-body border-b border-ivory-100 last:border-0 transition-colors"
                                  style={{
                                    color: theme?.textSecondary || "#6b6b6b",
                                  }}
                                >
                                  {sub.label}
                                </button>
                              ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() => handleNavClick(link.href)}
                        className="block w-full text-left py-3.5 text-sm tracking-widest uppercase font-body font-medium border-b border-ivory-200"
                        style={{ color: theme?.navTextColor || "#2D2D2D" }}
                      >
                        {link.label}
                      </button>
                    )}
                  </div>
                );
              })}
              <div className="pt-3">
                {[
                  { label: "Account", href: "/account" },
                  { label: "Wishlist", href: "/wishlist" },
                  { label: "Track Order", href: "/orders" },
                  { label: "Contact", href: "/contact" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.href)}
                    className="block w-full text-left py-3.5 text-xs tracking-widest uppercase font-body border-b border-ivory-100"
                    style={{ color: theme?.textLight || "#9a9a9a" }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      <CartDrawer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
