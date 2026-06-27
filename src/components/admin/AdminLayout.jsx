"use client";
import Link from "next/link";
import BrandLogo from "../../components/ui/BrandLogo";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "./AdminAuthProvider";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  Settings2,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Users,
  FileText,
  Star,
  Palette,
  BarChart3,
  FolderOpen,
  Sliders,
  Bell,
  KeyRound,
} from "lucide-react";
import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const navGroups = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Store",
    items: [
      {
        label: "Orders",
        href: "/admin/orders",
        icon: ShoppingBag,
        badge: "orders",
      },
      {
        label: "Products",
        href: "/admin/products",
        icon: Package,
        badge: "lowstock",
      },
      { label: "Coupons", href: "/admin/coupons", icon: Tag },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { label: "Categories", href: "/admin/categories", icon: FolderOpen },
      { label: "Attributes", href: "/admin/attributes", icon: Sliders },
    ],
  },
  {
    label: "Customers",
    items: [
      { label: "Customers", href: "/admin/customers", icon: Users },
      {
        label: "Reviews",
        href: "/admin/reviews",
        icon: Star,
        badge: "reviews",
      },
    ],
  },
  {
    label: "Content",
    items: [{ label: "Blog", href: "/admin/blog", icon: FileText }],
  },
  {
    label: "Configure",
    items: [
      { label: "Theme", href: "/admin/theme", icon: Palette },
      { label: "Settings", href: "/admin/settings", icon: Settings2 },
    ],
  },
];

export default function AdminLayout({ children }) {
  const { admin, logout } = useAdminAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [badges, setBadges] = useState({ orders: 0, lowstock: 0, reviews: 0 });

  // Poll for notification badges every 30s
  useEffect(() => {
    const fetchBadges = async () => {
      if (!admin) return;
      try {
        const tok = localStorage.getItem("lef_admin_token");
        const headers = { Authorization: `Bearer ${tok}` };
        const [ordersRes, reviewsRes, productsRes] = await Promise.all([
          fetch(`${API}/admin/orders?status=placed&limit=1`, { headers }),
          fetch(`${API}/admin/reviews?status=pending&limit=1`, { headers }),
          fetch(`${API}/admin/products?limit=1`, { headers }),
        ]);
        const [orders, reviews, products] = await Promise.all([
          ordersRes.json(),
          reviewsRes.json(),
          productsRes.json(),
        ]);
        setBadges({
          orders: orders.total || 0,
          reviews: reviews.total || 0,
          lowstock: (products.products || []).filter(
            (p) => p.stock <= 5 && p.stock > 0
          ).length,
        });
      } catch {}
    };
    fetchBadges();
    const t = setInterval(fetchBadges, 30000);
    return () => clearInterval(t);
  }, [admin]);

  const getBadgeCount = (key) => badges[key] || 0;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-[#1C1C1E] z-30 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-5 py-5 border-b border-white/10">
          <BrandLogo size="sm" color="#C4622D" />
          <div className="text-gray-600 text-[10px] tracking-widest uppercase mt-1.5">
            Admin Panel
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest px-3 mb-1.5">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname.startsWith(item.href);
                  const badgeCount = item.badge ? getBadgeCount(item.badge) : 0;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        active
                          ? "bg-[#C4622D] text-white"
                          : "text-gray-400 hover:bg-white/8 hover:text-white"
                      }`}
                    >
                      <item.icon size={16} />
                      <span className="flex-1">{item.label}</span>
                      {badgeCount > 0 && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
                            active
                              ? "bg-white/30 text-white"
                              : "bg-[#C4622D] text-white"
                          }`}
                        >
                          {badgeCount > 99 ? "99+" : badgeCount}
                        </span>
                      )}
                      {active && badgeCount === 0 && <ChevronRight size={13} />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/8 transition-colors"
          >
            <ExternalLink size={16} /> View Store
          </Link>
          <div className="px-3 py-2 text-[11px] text-gray-600">
            {admin?.name}
          </div>
          <Link
            href="/admin/change-password"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/8 transition-colors"
          >
            <KeyRound size={16} /> Change Password
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            className="lg:hidden p-1.5 text-gray-500"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="text-sm font-semibold text-gray-700 capitalize">
            {pathname.split("/").filter(Boolean).pop()?.replace(/-/g, " ") ||
              "Dashboard"}
          </div>
          <div className="flex items-center gap-3">
            {badges.orders + badges.reviews > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-lg">
                <Bell size={12} />
                {badges.orders > 0 &&
                  `${badges.orders} new order${badges.orders > 1 ? "s" : ""}`}
                {badges.orders > 0 && badges.reviews > 0 && " · "}
                {badges.reviews > 0 &&
                  `${badges.reviews} review${
                    badges.reviews > 1 ? "s" : ""
                  } pending`}
              </div>
            )}
            <div className="text-xs text-gray-400">
              {new Date().toLocaleDateString("en-PK", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
