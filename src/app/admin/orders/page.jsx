"use client";
import { useEffect, useState } from "react";
import {
  AdminAuthProvider,
  useAdminAuth,
} from "../../../components/admin/AdminAuthProvider";
import AdminLayout from "../../../components/admin/AdminLayout";
import { useRouter } from "next/navigation";
import {
  Search,
  MessageCircle,
  FileText,
  X,
  Save,
  Package,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const hdr = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("lef_admin_token")}`,
});
const STATUSES = [
  "placed",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
];
const STATUS_CLR = {
  placed: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-600",
  processing: "bg-indigo-100 text-indigo-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
  returned: "bg-orange-100 text-orange-700",
};

function OrderModal({ order, onClose, onSave }) {
  const [status, setStatus] = useState(order.orderStatus);
  const [tracking, setTracking] = useState(order.trackingNumber || "");
  const [courier, setCourier] = useState(order.courier || "");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const inp =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#C4622D] bg-white";

  const save = async () => {
    setSaving(true);
    await fetch(`${API}/admin/orders/${order._id}/status`, {
      method: "PATCH",
      headers: hdr(),
      body: JSON.stringify({ status, trackingNumber: tracking, courier, note }),
    });
    setSaving(false);
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
          <div>
            <h2 className="font-bold text-gray-900">{order.orderNumber}</h2>
            <p className="text-xs text-gray-400">
              {order.customer?.name} · {order.customer?.phone}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`${API}/admin/orders/${
                order._id
              }/invoice?token=${localStorage.getItem("lef_admin_token")}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-gray-600"
            >
              <FileText size={12} /> Invoice
            </a>
            <button onClick={onClose}>
              <X size={18} className="text-gray-400" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Items
            </p>
            {order.items?.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt=""
                    className="w-10 h-12 object-cover rounded flex-shrink-0"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {item.size} · {item.color} · Qty {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold">
                  Rs.{" "}
                  {((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>Rs. {(order.pricing?.subtotal || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>
                {order.pricing?.shippingCost === 0
                  ? "Free"
                  : "Rs. " +
                    (order.pricing?.shippingCost || 0).toLocaleString()}
              </span>
            </div>
            {order.pricing?.discount > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Discount</span>
                <span className="text-green-600">
                  -Rs. {order.pricing.discount.toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>Rs. {(order.pricing?.total || 0).toLocaleString()}</span>
            </div>
          </div>
          {order.shippingAddress && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Ship To
              </p>
              <p className="text-sm text-gray-700">
                {order.shippingAddress.street}, {order.shippingAddress.city}
              </p>
            </div>
          )}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Update Status
            </p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`py-2 px-3 rounded-lg text-xs font-medium capitalize border transition-all ${
                    status === s
                      ? "bg-[#C4622D] border-[#C4622D] text-white"
                      : "border-gray-200 text-gray-600 hover:border-[#C4622D]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">
                  Tracking Number
                </label>
                <input
                  value={tracking}
                  onChange={(e) => setTracking(e.target.value)}
                  placeholder="TCS-XXXXXX"
                  className={inp}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">
                  Courier
                </label>
                <select
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  className={inp}
                >
                  <option value="">Select courier</option>
                  {[
                    "TCS",
                    "Leopards",
                    "BlueEx",
                    "M&P",
                    "PostEx",
                    "Call Courier",
                    "Trax",
                  ].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">
                Internal Note
              </label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Customer called, urgent"
                className={inp}
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <a
              href={`https://wa.me/${order.customer?.phone?.replace(
                /\D/g,
                ""
              )}?text=${encodeURIComponent(
                `Assalamu Alaikum ${order.customer?.name}! Your order ${order.orderNumber} is confirmed and will be dispatched shortly. Thank you for shopping with Libaas-e-Farda! 🧡`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20b858] text-white px-4 py-2 rounded-lg text-xs font-medium"
            >
              <MessageCircle size={13} /> Confirm via WhatsApp
            </a>
            {tracking && (
              <a
                href={`https://wa.me/${order.customer?.phone?.replace(
                  /\D/g,
                  ""
                )}?text=${encodeURIComponent(
                  `Assalamu Alaikum ${order.customer?.name}! Your order ${
                    order.orderNumber
                  } has been dispatched. Tracking: ${tracking}${
                    courier ? " via " + courier : ""
                  }. Track at: libaas-e-farda.com/orders 📦`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-medium"
              >
                <Package size={13} /> Send Tracking via WhatsApp
              </a>
            )}
          </div>
          {order.statusHistory?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                History
              </p>
              <div className="space-y-2">
                {[...order.statusHistory]
                  .reverse()
                  .slice(0, 5)
                  .map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C4622D] mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-semibold capitalize">
                          {h.status}
                        </span>
                        {h.note && (
                          <span className="text-gray-400"> · {h.note}</span>
                        )}
                        <p className="text-gray-400">
                          {new Date(h.date).toLocaleString("en-PK")}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t bg-gray-50 flex gap-3 flex-shrink-0">
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 bg-[#C4622D] hover:bg-[#b54e22] text-white px-5 py-2.5 rounded-lg text-sm font-medium disabled:opacity-60"
          >
            <Save size={14} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={onClose}
            className="px-5 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function OrdersContent() {
  const { admin, loading: authLoading } = useAdminAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !admin) router.push("/admin/login");
  }, [admin, authLoading]);

  const load = async () => {
    setLoading(true);
    const p = new URLSearchParams({ page, limit: 20 });
    if (status) p.set("status", status);
    if (search) p.set("search", search);
    const data = await fetch(`${API}/admin/orders?${p}`, {
      headers: hdr(),
    }).then((r) => r.json());
    setOrders(data.orders || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  useEffect(() => {
    if (admin) load();
  }, [admin, page, status]);
  useEffect(() => {
    const t = setTimeout(() => {
      if (admin) {
        setPage(1);
        load();
      }
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500">{total} total orders</p>
      </div>
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C4622D]"
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#C4622D] bg-white"
        >
          <option value="">All Status</option>
          {STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                {[
                  "Order",
                  "Customer",
                  "Items",
                  "Total",
                  "Payment",
                  "Status",
                  "Date",
                  "",
                ].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-gray-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr
                    key={o._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelected(o)}
                  >
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-[#C4622D]">
                      {o.orderNumber}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">
                        {o.customer?.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {o.customer?.phone}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {o.items?.length || 0} items
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      Rs. {(o.pricing?.total || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 uppercase">
                      {o.paymentMethod}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize ${
                          STATUS_CLR[o.orderStatus] ||
                          "bg-gray-100 text-gray-500"
                        }`}
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
                    <td className="px-4 py-3 text-gray-300 text-xs">→</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {total > 20 && (
          <div className="flex justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">Page {page}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page * 20 >= total}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      {selected && (
        <OrderModal
          order={selected}
          onClose={() => setSelected(null)}
          onSave={load}
        />
      )}
    </AdminLayout>
  );
}

export default function AdminOrders() {
  return (
    <AdminAuthProvider>
      <OrdersContent />
    </AdminAuthProvider>
  );
}
