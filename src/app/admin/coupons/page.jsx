"use client";
import { useEffect, useState } from "react";
import {
  AdminAuthProvider,
  useAdminAuth,
} from "../../../components/admin/AdminAuthProvider";
import AdminLayout from "../../../components/admin/AdminLayout";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Tag,
  Copy,
  CheckCheck,
  Save,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const hdr = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("lef_admin_token")}`,
});
const inp =
  "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#C4622D] transition-colors bg-white";

const empty = {
  code: "",
  type: "percentage",
  value: "",
  minOrder: "",
  maxUses: "",
  isActive: true,
  expiresAt: "",
};

function CouponForm({ coupon, onClose, onSave }) {
  const [form, setForm] = useState(
    coupon
      ? {
          code: coupon.code || "",
          type: coupon.type || "percentage",
          value: coupon.discount ?? coupon.value ?? "",
          minOrder: coupon.minOrder || "",
          maxUses: coupon.usageLimit || "",
          isActive: coupon.isActive !== false,
          expiresAt: coupon.expiresAt ? coupon.expiresAt.substring(0, 10) : "",
        }
      : { ...empty }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.code.trim()) return setError("Coupon code is required");
    if (!form.value) return setError("Discount value is required");
    setSaving(true);
    setError("");
    try {
      const payload = {
        code: form.code.toUpperCase().trim(),
        type: form.type,
        discount: Number(form.value),
        value: Number(form.value), // backwards compat with model
        minOrder: Number(form.minOrder) || 0,
        usageLimit: Number(form.maxUses) || 0,
        isActive: form.isActive,
        expiresAt: form.expiresAt || undefined,
      };
      const url = coupon
        ? `${API}/admin/coupons/${coupon._id}`
        : `${API}/admin/coupons`;
      const method = coupon ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: hdr(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        onSave();
        onClose();
      } else setError(data.message || "Failed to save coupon");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-bold text-gray-900">
            {coupon ? "Edit Coupon" : "Create Coupon"}
          </h2>
          <button onClick={onClose}>
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
              Coupon Code *
            </label>
            <input
              value={form.code}
              onChange={(e) => upd("code", e.target.value.toUpperCase())}
              placeholder="e.g. WELCOME10"
              className={`${inp} font-mono uppercase`}
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Customers type this at checkout
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                Discount Type
              </label>
              <select
                value={form.type}
                onChange={(e) => upd("type", e.target.value)}
                className={inp}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (Rs.)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                Discount Value * {form.type === "percentage" ? "(%)" : "(Rs.)"}
              </label>
              <input
                type="number"
                min={1}
                max={form.type === "percentage" ? 100 : undefined}
                value={form.value}
                onChange={(e) => upd("value", e.target.value)}
                placeholder={form.type === "percentage" ? "10" : "500"}
                className={inp}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                Min Order (Rs.)
              </label>
              <input
                type="number"
                min={0}
                value={form.minOrder}
                onChange={(e) => upd("minOrder", e.target.value)}
                placeholder="0 = no minimum"
                className={inp}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                Max Uses
              </label>
              <input
                type="number"
                min={0}
                value={form.maxUses}
                onChange={(e) => upd("maxUses", e.target.value)}
                placeholder="0 = unlimited"
                className={inp}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
              Expiry Date
            </label>
            <input
              type="date"
              value={form.expiresAt}
              onChange={(e) => upd("expiresAt", e.target.value)}
              className={inp}
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-xl">
            <div
              onClick={() => upd("isActive", !form.isActive)}
              className={`w-10 h-5 rounded-full transition-colors relative ${
                form.isActive ? "bg-[#C4622D]" : "bg-gray-200"
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  form.isActive ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </div>
            <span className="text-sm text-gray-700 font-medium">
              {form.isActive
                ? "Active — customers can use this"
                : "Inactive — coupon is disabled"}
            </span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 bg-[#C4622D] hover:bg-[#b54e22] text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-60"
            >
              <Save size={14} />{" "}
              {saving ? "Saving..." : coupon ? "Save Changes" : "Create Coupon"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CouponsContent() {
  const { admin, loading: authLoading } = useAdminAuth();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [copied, setCopied] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !admin) router.push("/admin/login");
  }, [admin, authLoading]);
  useEffect(() => {
    if (admin) fetchCoupons();
  }, [admin]);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/coupons`, { headers: hdr() });
      const data = await res.json();
      setCoupons(data.coupons || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const deleteCoupon = async (id, code) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    await fetch(`${API}/admin/coupons/${id}`, {
      method: "DELETE",
      headers: hdr(),
    });
    fetchCoupons();
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(""), 2000);
  };

  const toggleActive = async (coupon) => {
    await fetch(`${API}/admin/coupons/${coupon._id}`, {
      method: "PUT",
      headers: hdr(),
      body: JSON.stringify({ ...coupon, isActive: !coupon.isActive }),
    });
    fetchCoupons();
  };

  const isExpired = (c) => c.expiresAt && new Date(c.expiresAt) < new Date();

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Coupons</h1>
          <p className="text-sm text-gray-500">
            {coupons.length} coupons ·{" "}
            {coupons.filter((c) => c.isActive && !isExpired(c)).length} active
          </p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 bg-[#C4622D] hover:bg-[#b54e22] text-white px-4 py-2.5 rounded-lg text-sm font-medium"
        >
          <Plus size={16} /> New Coupon
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-7 h-7 border-2 border-[#C4622D] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-20 text-center">
          <Tag size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium mb-1">No coupons yet</p>
          <p className="text-gray-400 text-sm mb-5">
            Create discount codes for your customers
          </p>
          <button
            onClick={() => setAdding(true)}
            className="bg-[#C4622D] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#b54e22]"
          >
            Create First Coupon
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {coupons.map((c) => {
            const expired = isExpired(c);
            const used = c.usageCount || 0;
            const limit = c.usageLimit || 0;
            const full = limit > 0 && used >= limit;

            return (
              <div
                key={c._id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-5 flex-wrap"
              >
                {/* Code */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="bg-[#C4622D]/10 px-4 py-2 rounded-lg">
                    <span className="font-mono font-bold text-[#C4622D] text-lg tracking-wider">
                      {c.code}
                    </span>
                  </div>
                  <button
                    onClick={() => copyCode(c.code)}
                    className="text-gray-400 hover:text-[#C4622D] transition-colors p-1"
                  >
                    {copied === c.code ? (
                      <CheckCheck size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-gray-900">
                      {c.type === "percentage"
                        ? `${c.discount || c.value}% off`
                        : `Rs. ${(
                            c.discount || c.value
                          )?.toLocaleString()} off`}
                    </span>
                    {c.minOrder > 0 && (
                      <span className="text-xs text-gray-400">
                        · min Rs. {c.minOrder.toLocaleString()}
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        !c.isActive || expired || full
                          ? "bg-gray-100 text-gray-400"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {!c.isActive
                        ? "Disabled"
                        : expired
                        ? "Expired"
                        : full
                        ? "Maxed Out"
                        : "Active"}
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-400 flex-wrap">
                    <span>
                      Used: {used}
                      {limit > 0 ? ` / ${limit}` : " times"}
                    </span>
                    {c.expiresAt && (
                      <span className={expired ? "text-red-400" : ""}>
                        Expires:{" "}
                        {new Date(c.expiresAt).toLocaleDateString("en-PK", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleActive(c)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      c.isActive
                        ? "bg-green-50 text-green-600 hover:bg-green-100"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {c.isActive ? "Enabled" : "Disabled"}
                  </button>
                  <button
                    onClick={() => setEditing(c)}
                    className="p-2 text-gray-400 hover:text-[#C4622D] transition-colors"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => deleteCoupon(c._id, c.code)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {adding && (
        <CouponForm onClose={() => setAdding(false)} onSave={fetchCoupons} />
      )}
      {editing && (
        <CouponForm
          coupon={editing}
          onClose={() => setEditing(null)}
          onSave={fetchCoupons}
        />
      )}
    </AdminLayout>
  );
}

export default function AdminCoupons() {
  return (
    <AdminAuthProvider>
      <CouponsContent />
    </AdminAuthProvider>
  );
}
