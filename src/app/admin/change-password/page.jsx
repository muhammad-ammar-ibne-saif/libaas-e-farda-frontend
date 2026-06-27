"use client";
import { useState } from "react";
import {
  AdminAuthProvider,
  useAdminAuth,
} from "../../../components/admin/AdminAuthProvider";
import AdminLayout from "../../../components/admin/AdminLayout";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const inp =
  "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#C4622D] transition-colors pr-12";

function ChangePasswordContent() {
  const { admin, loading: authLoading } = useAdminAuth();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  if (!authLoading && !admin) {
    router.push("/admin/login");
    return null;
  }

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (form.newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("lef_admin_token")}`,
        },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else setError(data.message || "Failed to change password");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { k: "currentPassword", l: "Current Password", s: "current" },
    {
      k: "newPassword",
      l: "New Password",
      s: "new",
      hint: "Minimum 8 characters",
    },
    { k: "confirmPassword", l: "Confirm New Password", s: "confirm" },
  ];

  return (
    <AdminLayout>
      <div className="max-w-lg">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">Change Password</h1>
          <p className="text-sm text-gray-500">
            Update your admin account password
          </p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 mb-5 flex items-center gap-3">
            <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-700 font-medium">
              Password changed successfully!
            </p>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-5">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <form onSubmit={submit} className="space-y-4">
            {fields.map((f) => (
              <div key={f.k}>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  {f.l}
                </label>
                <div className="relative">
                  <input
                    type={show[f.s] ? "text" : "password"}
                    value={form[f.k]}
                    onChange={(e) => upd(f.k, e.target.value)}
                    required
                    className={inp}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => ({ ...s, [f.s]: !s[f.s] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {show[f.s] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {f.hint && (
                  <p className="text-xs text-gray-400 mt-1">{f.hint}</p>
                )}
              </div>
            ))}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-[#C4622D] hover:bg-[#b54e22] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
              >
                <Lock size={14} />
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs text-blue-700 font-semibold mb-1">
            Password Requirements
          </p>
          <ul className="text-xs text-blue-600 space-y-0.5">
            <li>· Minimum 8 characters</li>
            <li>· Use a mix of letters, numbers, and symbols</li>
            <li>· Don't reuse old passwords</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function AdminChangePassword() {
  return (
    <AdminAuthProvider>
      <ChangePasswordContent />
    </AdminAuthProvider>
  );
}
