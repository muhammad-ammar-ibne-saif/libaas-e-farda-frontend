"use client";
import { useEffect, useState } from "react";
import {
  AdminAuthProvider,
  useAdminAuth,
} from "../../../components/admin/AdminAuthProvider";
import AdminLayout from "../../../components/admin/AdminLayout";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  ArrowUp,
  ArrowDown,
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
  returned: "#f97316",
};

function StatCard({ label, value, sub, icon: Icon, color, trend }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center`}
          style={{ backgroundColor: color + "20" }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold ${
              trend >= 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {trend >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function BarChart({ data, valueKey, labelKey, color }) {
  if (!data?.length)
    return (
      <div className="h-48 flex items-center justify-center text-gray-300 text-sm">
        No data yet
      </div>
    );
  const max = Math.max(...data.map((d) => d[valueKey] || 0)) || 1;
  return (
    <div className="flex items-end gap-1 h-48 pt-4">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
          <div className="relative w-full" style={{ height: "160px" }}>
            <div
              className="absolute bottom-0 w-full rounded-t transition-all duration-500 group-hover:opacity-80"
              style={{
                height: `${Math.max(((d[valueKey] || 0) / max) * 100, 2)}%`,
                backgroundColor: color || "#C4622D",
              }}
            />
          </div>
          <span className="text-[9px] text-gray-400 truncate w-full text-center">
            {d[labelKey]}
          </span>
          <span className="text-[9px] text-gray-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
            {d[valueKey]}
          </span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ data }) {
  if (!data?.length)
    return (
      <div className="h-32 flex items-center justify-center text-gray-300 text-sm">
        No data
      </div>
    );
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  let cumulative = 0;
  const segments = data.map((d) => {
    const pct = (d.count / total) * 100;
    const start = cumulative;
    cumulative += pct;
    return { ...d, pct, start };
  });

  const polarToCartesian = (cx, cy, r, angle) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 100 100" className="w-32 h-32 flex-shrink-0">
        {segments.map((seg, i) => {
          if (seg.pct === 0) return null;
          const s = polarToCartesian(50, 50, 40, (seg.start / 100) * 360);
          const e = polarToCartesian(
            50,
            50,
            40,
            ((seg.start + seg.pct) / 100) * 360
          );
          const large = seg.pct > 50 ? 1 : 0;
          return (
            <path
              key={i}
              d={`M 50 50 L ${s.x} ${s.y} A 40 40 0 ${large} 1 ${e.x} ${e.y} Z`}
              fill={STATUS_COLORS[seg._id] || "#94a3b8"}
              opacity={0.85}
            />
          );
        })}
        <circle cx="50" cy="50" r="25" fill="white" />
        <text
          x="50"
          y="54"
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fill="#2D2D2D"
        >
          {total}
        </text>
      </svg>
      <div className="space-y-1.5 flex-1">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: STATUS_COLORS[seg._id] || "#94a3b8" }}
            />
            <span className="text-gray-600 capitalize flex-1">{seg._id}</span>
            <span className="font-semibold text-gray-900">{seg.count}</span>
            <span className="text-gray-400">({seg.pct.toFixed(0)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsContent() {
  const { admin, loading: authLoading } = useAdminAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30");
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !admin) router.push("/admin/login");
  }, [admin, authLoading]);
  useEffect(() => {
    if (admin) loadStats();
  }, [admin, period]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await fetch(`${API}/admin/dashboard?period=${period}`, {
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

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500">
            Performance overview for your store
          </p>
        </div>
        <div className="flex gap-2">
          {[
            { v: "7", l: "7 Days" },
            { v: "30", l: "30 Days" },
            { v: "90", l: "3 Months" },
          ].map((p) => (
            <button
              key={p.v}
              onClick={() => setPeriod(p.v)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                period === p.v
                  ? "bg-[#C4622D] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {p.l}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Revenue"
          value={`Rs. ${(stats?.totalRevenue || 0).toLocaleString()}`}
          icon={TrendingUp}
          color="#C4622D"
        />
        <StatCard
          label="Total Orders"
          value={stats?.totalOrders || 0}
          icon={ShoppingBag}
          color="#3b82f6"
        />
        <StatCard
          label="Total Customers"
          value={stats?.totalCustomers || 0}
          icon={Users}
          color="#10b981"
        />
        <StatCard
          label="Products"
          value={stats?.totalProducts || 0}
          icon={Package}
          color="#8b5cf6"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        {/* Revenue chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4 text-sm">
            Revenue Over Time
          </h3>
          <BarChart
            data={stats?.revenueChart || []}
            valueKey="revenue"
            labelKey="date"
            color="#C4622D"
          />
        </div>
        {/* Order status */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4 text-sm">
            Orders by Status
          </h3>
          <DonutChart data={stats?.ordersByStatus || []} />
        </div>
      </div>

      {/* Top products */}
      {stats?.topProducts?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5">
          <h3 className="font-semibold text-gray-900 mb-4 text-sm">
            Top Selling Products
          </h3>
          <div className="space-y-3">
            {stats.topProducts.map((p, i) => (
              <div key={p._id} className="flex items-center gap-4">
                <span className="text-xs font-bold text-gray-400 w-5">
                  {i + 1}
                </span>
                {p.images?.[0] && (
                  <img
                    src={p.images[0]}
                    alt=""
                    className="w-10 h-12 object-cover rounded flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {p.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {p.soldCount || 0} sold · Rs.{" "}
                    {(p.price || 0).toLocaleString()}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C4622D] rounded-full"
                      style={{
                        width: `${Math.min(
                          ((p.soldCount || 0) /
                            Math.max(
                              ...stats.topProducts.map((x) => x.soldCount || 0),
                              1
                            )) *
                            100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent orders */}
      {stats?.recentOrders?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm">
              Recent Orders
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                  {["Order", "Customer", "Total", "Status", "Date"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recentOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-[#C4622D] font-semibold">
                      {o.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {o.customer?.name}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      Rs. {(o.pricing?.total || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
                        style={{
                          backgroundColor:
                            (STATUS_COLORS[o.orderStatus] || "#94a3b8") + "20",
                          color: STATUS_COLORS[o.orderStatus] || "#64748b",
                        }}
                      >
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(o.createdAt).toLocaleDateString("en-PK", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default function AdminAnalytics() {
  return (
    <AdminAuthProvider>
      <AnalyticsContent />
    </AdminAuthProvider>
  );
}
