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
  Save,
  Eye,
  EyeOff,
  GripVertical,
  ChevronRight,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const h = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("lef_admin_token")}`,
});
const inp =
  "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#C4622D] transition-colors bg-white";

const emptyForm = {
  name: "",
  description: "",
  image: "",
  icon: "",
  showInNav: true,
  showInHome: true,
  isActive: true,
  order: 0,
};

const ICONS = [
  "👗",
  "👔",
  "🧥",
  "👚",
  "👛",
  "🛍",
  "✨",
  "🌸",
  "💎",
  "🎀",
  "👠",
  "🧣",
  "🧤",
  "🧦",
  "👒",
  "💍",
];

function CategoryModal({ category, onClose, onSave }) {
  const [form, setForm] = useState(category ? { ...category } : emptyForm);
  const [saving, setSaving] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name.trim()) return alert("Name is required");
    setSaving(true);
    try {
      const url = category
        ? `${API}/admin/categories/${category._id}`
        : `${API}/admin/categories`;
      const method = category ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: h(),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        onSave();
        onClose();
      } else alert(data.message);
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-bold text-gray-900">
            {category ? "Edit Category" : "New Category"}
          </h2>
          <button onClick={onClose}>
            <X size={18} className="text-gray-400" />
          </button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block font-semibold uppercase tracking-wider">
              Category Name *
            </label>
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. Outerwear"
              className={inp}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block font-semibold uppercase tracking-wider">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={2}
              placeholder="Brief description of this category..."
              className={`${inp} resize-none`}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block font-semibold uppercase tracking-wider">
              Category Image URL
            </label>
            <input
              value={form.image}
              onChange={(e) => update("image", e.target.value)}
              placeholder="https://..."
              className={inp}
            />
            {form.image && (
              <img
                src={form.image}
                alt=""
                className="w-full h-32 object-cover rounded-lg mt-2"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-2 block font-semibold uppercase tracking-wider">
              Icon / Emoji
            </label>
            <div className="grid grid-cols-8 gap-2 mb-2">
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => update("icon", icon)}
                  className={`w-10 h-10 text-xl rounded-lg border-2 transition-all hover:scale-110 ${
                    form.icon === icon
                      ? "border-[#C4622D] bg-[#C4622D]/5"
                      : "border-gray-100"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
            <input
              value={form.icon}
              onChange={(e) => update("icon", e.target.value)}
              placeholder="Or type custom emoji/icon..."
              className={inp}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block font-semibold uppercase tracking-wider">
              Sort Order
            </label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => update("order", Number(e.target.value))}
              className={inp}
            />
          </div>
          {/* Toggles */}
          <div className="space-y-3 pt-2">
            {[
              {
                key: "isActive",
                label: "Category Active",
                sub: "Visible to customers",
              },
              {
                key: "showInNav",
                label: "Show in Navigation",
                sub: "Appears in top nav dropdown",
              },
              {
                key: "showInHome",
                label: "Show on Homepage",
                sub: "Appears in homepage sections",
              },
            ].map(({ key, label, sub }) => (
              <label
                key={key}
                className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 rounded-xl"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
                <div
                  onClick={() => update(key, !form[key])}
                  className={`w-10 h-5 rounded-full transition-colors relative ${
                    form[key] ? "bg-[#C4622D]" : "bg-gray-200"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      form[key] ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </div>
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={save}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 bg-[#C4622D] hover:bg-[#b54e22] text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-60"
          >
            <Save size={14} /> {saving ? "Saving..." : "Save Category"}
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

function CategoriesContent() {
  const { admin, loading: authLoading } = useAdminAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const router = useRouter();

  const fetchCategories = async () => {
    setLoading(true);
    const data = await fetch(`${API}/admin/categories`, { headers: h() }).then(
      (r) => r.json()
    );
    setCategories(data.categories || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && !admin) router.push("/admin/login");
  }, [admin, authLoading]);
  useEffect(() => {
    if (admin) fetchCategories();
  }, [admin]);

  const deleteCategory = async (id, name) => {
    if (
      !confirm(
        `Delete category "${name}"? Products in this category will need to be reassigned.`
      )
    )
      return;
    await fetch(`${API}/admin/categories/${id}`, {
      method: "DELETE",
      headers: h(),
    });
    fetchCategories();
  };

  const toggleActive = async (cat) => {
    await fetch(`${API}/admin/categories/${cat._id}`, {
      method: "PUT",
      headers: h(),
      body: JSON.stringify({ ...cat, isActive: !cat.isActive }),
    });
    fetchCategories();
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500">
            {categories.length} categories — controls shop filters and
            navigation
          </p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 bg-[#C4622D] hover:bg-[#b54e22] text-white px-4 py-2.5 rounded-lg text-sm font-medium"
        >
          <Plus size={16} /> New Category
        </button>
      </div>

      {/* Info banner */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl px-5 py-3 mb-5 flex items-start gap-3">
        <span className="text-orange-500 text-lg flex-shrink-0">💡</span>
        <p className="text-xs text-orange-700">
          Categories control your shop filters, navigation dropdown, and product
          grouping. The <strong>slug</strong> (auto-generated from name) is used
          in URLs like <code>/shop?category=outerwear</code>
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-7 h-7 border-2 border-[#C4622D] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3 text-left font-medium w-8"></th>
                  <th className="px-4 py-3 text-left font-medium">Category</th>
                  <th className="px-4 py-3 text-left font-medium">Slug</th>
                  <th className="px-4 py-3 text-left font-medium">Nav</th>
                  <th className="px-4 py-3 text-left font-medium">Home</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Order</th>
                  <th className="px-4 py-3 text-left font-medium w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-gray-400">
                      No categories yet. Add your first one!
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr
                      key={cat._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-300">
                        <GripVertical size={14} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {cat.image ? (
                            <img
                              src={cat.image}
                              alt=""
                              className="w-8 h-8 object-cover rounded"
                            />
                          ) : (
                            <span className="text-xl w-8 text-center">
                              {cat.icon || "📦"}
                            </span>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">
                              {cat.name}
                            </p>
                            {cat.description && (
                              <p className="text-xs text-gray-400 truncate max-w-[200px]">
                                {cat.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <code className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {cat.slug}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            cat.showInNav
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {cat.showInNav ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            cat.showInHome
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {cat.showInHome ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleActive(cat)}
                          className={`text-[10px] font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                            cat.isActive
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-500 hover:bg-red-200"
                          }`}
                        >
                          {cat.isActive ? "Active" : "Hidden"}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {cat.order}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditing(cat)}
                            className="p-1.5 text-gray-400 hover:text-[#C4622D] transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => deleteCategory(cat._id, cat.name)}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* URL preview */}
      {categories.length > 0 && (
        <div className="mt-5 bg-gray-50 border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            URL Preview — How these appear in shop URLs
          </p>
          <div className="flex flex-wrap gap-2">
            {categories
              .filter((c) => c.isActive)
              .map((cat) => (
                <code
                  key={cat._id}
                  className="text-xs bg-white border border-gray-200 text-[#C4622D] px-3 py-1.5 rounded-lg"
                >
                  /shop?category={cat.slug}
                </code>
              ))}
          </div>
        </div>
      )}

      {adding && (
        <CategoryModal
          onClose={() => setAdding(false)}
          onSave={fetchCategories}
        />
      )}
      {editing && (
        <CategoryModal
          category={editing}
          onClose={() => setEditing(null)}
          onSave={fetchCategories}
        />
      )}
    </AdminLayout>
  );
}

export default function AdminCategories() {
  return (
    <AdminAuthProvider>
      <CategoriesContent />
    </AdminAuthProvider>
  );
}
