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
  Users,
  X,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Eye,
  Trash2,
  MessageCircle,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const h = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("lef_admin_token")}`,
});

function CustomerModal({ customerId, onClose }) {
  const [data, setData] = useState(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API}/admin/customers/${customerId}`, { headers: h() })
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setNotes(d.customer?.notes || "");
      });
  }, [customerId]);

  const saveNotes = async () => {
    setSaving(true);
    await fetch(`${API}/admin/customers/${customerId}`, {
      method: "PATCH",
      headers: h(),
      body: JSON.stringify({ notes }),
    });
    setSaving(false);
  };

  if (!data)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-2xl p-8">
          <div className="w-8 h-8 border-2 border-[#C4622D] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );

  const { customer, orders } = data;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
          <h2 className="font-bold text-gray-900">{customer.name}</h2>
          <button onClick={onClose}>
            <X size={18} className="text-gray-400" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {/* Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Contact
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Mail size={14} className="text-gray-400" />
                {customer.email}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone size={14} className="text-gray-400" />
                {customer.phone || "—"}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Stats
              </p>
              <div className="flex items-center gap-2 text-sm">
                <ShoppingBag size={14} className="text-gray-400" />
                {orders?.length || 0} orders
              </div>
              <div className="text-sm text-[#C4622D] font-semibold">
                Rs.{" "}
                {orders
                  ?.reduce((s, o) => s + (o.pricing?.total || 0), 0)
                  .toLocaleString() || 0}{" "}
                total spent
              </div>
              <p className="text-xs text-gray-400">
                Since {new Date(customer.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Admin notes */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
              Admin Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Private notes about this customer..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#C4622D] resize-none"
            />
            <button
              onClick={saveNotes}
              disabled={saving}
              className="mt-2 px-4 py-2 bg-[#C4622D] text-white rounded-lg text-xs font-medium hover:bg-[#b54e22] transition-colors disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Notes"}
            </button>
          </div>

          {/* Orders */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Order History
            </p>
            {orders?.length > 0 ? (
              <div className="space-y-2">
                {orders.map((o) => (
                  <div
                    key={o._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm"
                  >
                    <span className="font-mono text-[#C4622D] font-semibold">
                      {o.orderNumber}
                    </span>
                    <span className="text-gray-500">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        o.orderStatus === "delivered"
                          ? "bg-green-100 text-green-700"
                          : o.orderStatus === "shipped"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {o.orderStatus}
                    </span>
                    <span className="font-semibold">
                      Rs. {o.pricing?.total?.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No orders yet</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t">
            <a
              href={`mailto:${customer.email}`}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50"
            >
              <Mail size={13} /> Email Customer
            </a>
            {customer.phone && (
              <a
                href={`https://wa.me/${customer.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg text-xs font-medium hover:bg-[#20b858]"
              >
                <MessageCircle size={13} /> WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomersContent() {
  const { admin, loading: authLoading } = useAdminAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const router = useRouter();

  const fetchCustomers = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (search) params.set("search", search);
    const data = await fetch(`${API}/admin/customers?${params}`, {
      headers: h(),
    }).then((r) => r.json());
    setCustomers(data.customers || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && !admin) router.push("/admin/login");
  }, [admin, authLoading]);
  useEffect(() => {
    if (admin) fetchCustomers();
  }, [admin, page]);
  useEffect(() => {
    const t = setTimeout(() => {
      if (admin) fetchCustomers();
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const deleteCustomer = async (id, name) => {
    if (!confirm(`Delete customer "${name}"?`)) return;
    await fetch(`${API}/admin/customers/${id}`, {
      method: "DELETE",
      headers: h(),
    });
    fetchCustomers();
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500">{total} registered customers</p>
        </div>
      </div>

      <div className="relative mb-5">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email or phone..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C4622D]"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                {["Customer", "Email", "Phone", "Orders", "Joined", ""].map(
                  (h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-400">
                    Loading customers...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-400">
                    <Users size={32} className="mx-auto mb-2 text-gray-200" />
                    No customers yet
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr
                    key={c._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#C4622D]/10 flex items-center justify-center text-[#C4622D] font-semibold text-xs">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">
                          {c.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{c.email}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {c.phone || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {c.totalOrders || 0}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelected(c._id)}
                          className="p-1.5 text-gray-400 hover:text-[#C4622D] transition-colors"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => deleteCustomer(c._id, c.name)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {total > 20 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">{total} total</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page * 20 >= total}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <CustomerModal
          customerId={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </AdminLayout>
  );
}

export default function AdminCustomers() {
  return (
    <AdminAuthProvider>
      <CustomersContent />
    </AdminAuthProvider>
  );
}
