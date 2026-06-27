"use client";
import { useEffect, useState } from "react";
import {
  AdminAuthProvider,
  useAdminAuth,
} from "../../../components/admin/AdminAuthProvider";
import AdminLayout from "../../../components/admin/AdminLayout";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag,
  TrendingUp,
  Users,
  Package,
  Star,
  AlertTriangle,
  ChevronRight,
  Clock,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const hdr = () => ({
  Authorization: `Bearer ${localStorage.getItem("lef_admin_token")}`,
});

const STATUS_COLORS = {
  placed: "#f59e0b",
  confirmed: "#3b82f6",
  processing: "#8b5cf6",
  shipped: "#06b6d4",
  delivered: "#10b981",
  cancelled: "#ef4444",
};

function BarChart({ data }) {
  if (!data?.length)
    return (
      <div className="h-32 flex items-center justify-center text-gray-200 text-xs">
        No revenue data yet
      </div>
    );
  const max = Math.max(...data.map((d) => d.revenue || 0)) || 1;
  return (
    <div className="flex items-end gap-1 h-32">
      {data.slice(-14).map((d, i) => (
        <div
          key={i}
          className="flex-1 flex flex-col items-center gap-0.5 group"
        >
          <div className="relative w-full" style={{ height: "100px" }}>
            <div
              className="absolute bottom-0 w-full rounded-t bg-[#C4622D]/70 group-hover:bg-[#C4622D] transition-colors"
              style={{
                height: `${Math.max(((d.revenue || 0) / max) * 100, 2)}%`,
              }}
            />
          </div>
          <span className="text-[8px] text-gray-400 truncate w-full text-center">
            {d.date?.slice(-5)}
          </span>
        </div>
      ))}
    </div>
  );
}

function DashboardContent() {
  const { admin, loading: authLoading } = useAdminAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !admin) router.push("/admin/login");
  }, [admin, authLoading]);
  useEffect(() => {
    if (admin) loadStats();
  }, [admin]);

  const loadStats = async () => {
    try {
      const data = await fetch(`${API}/admin/dashboard`, {
        headers: hdr(),
      }).then((r) => r.json());
      if (data.success) setStats(data.stats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#C4622D] border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );

  const cards = [
    {
      label: "Total Revenue",
      value: `Rs. ${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: "#C4622D",
      href: "/admin/analytics",
    },
    {
      label: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: "#3b82f6",
      href: "/admin/orders",
    },
    {
      label: "Customers",
      value: stats?.totalCustomers || 0,
      icon: Users,
      color: "#10b981",
      href: "/admin/customers",
    },
    {
      label: "Products",
      value: stats?.totalProducts || 0,
      icon: Package,
      color: "#8b5cf6",
      href: "/admin/products",
    },
  ];

  const lowStock = stats?.lowStockProducts || [];
  const pendingRev = stats?.pendingReviews || 0;
  const newOrders = stats?.newOrders || 0;

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          {new Date().toLocaleDateString("en-PK", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Alert banners */}
      <div className="space-y-2 mb-5">
        {newOrders > 0 && (
          <Link
            href="/admin/orders?status=placed"
            className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 hover:bg-blue-100 transition-colors"
          >
            <Clock size={15} className="text-blue-500 flex-shrink-0" />
            <p className="text-sm text-blue-700">
              <strong>
                {newOrders} new order{newOrders > 1 ? "s" : ""}
              </strong>{" "}
              waiting for confirmation
            </p>
            <ChevronRight size={14} className="text-blue-400 ml-auto" />
          </Link>
        )}
        {pendingRev > 0 && (
          <Link
            href="/admin/reviews"
            className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-3 hover:bg-yellow-100 transition-colors"
          >
            <Star size={15} className="text-yellow-500 flex-shrink-0" />
            <p className="text-sm text-yellow-700">
              <strong>
                {pendingRev} review{pendingRev > 1 ? "s" : ""}
              </strong>{" "}
              pending approval
            </p>
            <ChevronRight size={14} className="text-yellow-400 ml-auto" />
          </Link>
        )}
        {lowStock.length > 0 && (
          <Link
            href="/admin/products"
            className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-3 hover:bg-red-100 transition-colors"
          >
            <AlertTriangle size={15} className="text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">
              <strong>
                {lowStock.length} product{lowStock.length > 1 ? "s" : ""}
              </strong>{" "}
              running low on stock
            </p>
            <ChevronRight size={14} className="text-red-400 ml-auto" />
          </Link>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow group"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: c.color + "15" }}
            >
              <c.icon size={17} style={{ color: c.color }} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{c.value}</p>
            <p className="text-xs text-gray-500 mt-0.5 group-hover:text-[#C4622D] transition-colors">
              {c.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        {/* Revenue chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 text-sm">
              Revenue (Last 14 Days)
            </h3>
            <Link
              href="/admin/analytics"
              className="text-xs text-[#C4622D] hover:underline"
            >
              Full Analytics →
            </Link>
          </div>
          <BarChart data={stats?.revenueChart || []} />
        </div>

        {/* Recent orders */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 text-sm">
              Recent Orders
            </h3>
            <Link
              href="/admin/orders"
              className="text-xs text-[#C4622D] hover:underline"
            >
              View All →
            </Link>
          </div>
          {(stats?.recentOrders || []).length === 0 ? (
            <p className="text-gray-300 text-sm text-center py-8">
              No orders yet
            </p>
          ) : (
            <div className="space-y-3">
              {(stats?.recentOrders || []).slice(0, 5).map((o) => (
                <div key={o._id} className="flex items-center gap-3">
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        STATUS_COLORS[o.orderStatus] || "#94a3b8",
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono font-semibold text-gray-700">
                      {o.orderNumber}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {o.customer?.name}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-gray-900 flex-shrink-0">
                    Rs. {(o.pricing?.total || 0).toLocaleString()}
                  </span>
                  <span
                    className="text-[10px] capitalize px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        (STATUS_COLORS[o.orderStatus] || "#94a3b8") + "20",
                      color: STATUS_COLORS[o.orderStatus] || "#64748b",
                    }}
                  >
                    {o.orderStatus}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Top products */}
        {(stats?.topProducts || []).length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 text-sm mb-4">
              Top Products
            </h3>
            <div className="space-y-3">
              {(stats?.topProducts || []).slice(0, 5).map((p, i) => (
                <div key={p._id} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-300 w-4">
                    {i + 1}
                  </span>
                  {p.images?.[0] && (
                    <img
                      src={p.images[0]}
                      alt=""
                      className="w-8 h-10 object-cover rounded flex-shrink-0"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">
                      {p.name}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {p.soldCount || 0} sold
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-gray-700 flex-shrink-0">
                    Rs. {(p.price || 0).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Low stock */}
        {lowStock.length > 0 && (
          <div className="bg-white rounded-xl border border-red-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 text-sm mb-4 flex items-center gap-2">
              <AlertTriangle size={15} className="text-red-500" /> Low Stock
              Alert
            </h3>
            <div className="space-y-3">
              {lowStock.slice(0, 6).map((p) => (
                <div key={p._id} className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      p.stock === 0 ? "bg-red-500" : "bg-yellow-400"
                    }`}
                  />
                  <p className="text-xs text-gray-700 flex-1 truncate">
                    {p.name}
                  </p>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.stock === 0
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/admin/products"
              className="text-xs text-[#C4622D] hover:underline mt-3 block"
            >
              Update stock →
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default function AdminDashboard() {
  return (
    <AdminAuthProvider>
      <DashboardContent />
    </AdminAuthProvider>
  );
}
