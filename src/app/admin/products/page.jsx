"use client";
import { useEffect, useState, useRef } from "react";
import {
  AdminAuthProvider,
  useAdminAuth,
} from "../../../components/admin/AdminAuthProvider";
import AdminLayout from "../../../components/admin/AdminLayout";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Package,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  Star,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const tok = () => localStorage.getItem("lef_admin_token");
const hdr = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${tok()}`,
});
const inp =
  "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#C4622D] bg-white";
const tog = (on) =>
  `w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
    on ? "bg-[#C4622D]" : "bg-gray-200"
  }`;
const knob = (on) =>
  `absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
    on ? "translate-x-5" : "translate-x-0.5"
  }`;

// ── Image Uploader ────────────────────────────────────────────────────────────
function ImageUploader({ images, onImagesChange }) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileRef = useRef(null);

  const uploadFile = async (file) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(`${API}/admin/settings/upload-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${tok()}` },
        body: fd,
      });
      const data = await res.json();
      if (data.success) onImagesChange([...images, data.url]);
      else alert("Upload failed: " + data.message);
    } catch (e) {
      alert("Upload error: " + e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    files.forEach(uploadFile);
  };

  const addUrl = () => {
    if (urlInput.trim()) {
      onImagesChange([...images, urlInput.trim()]);
      setUrlInput("");
    }
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-[#C4622D] hover:bg-[#C4622D]/5 transition-all"
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-5 h-5 border-2 border-[#C4622D] border-t-transparent rounded-full animate-spin" />
            Uploading...
          </div>
        ) : (
          <>
            <Upload size={20} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              Drag & drop images or{" "}
              <span className="text-[#C4622D] font-medium">browse</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              JPG, PNG, WebP · Max 5MB each
            </p>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => Array.from(e.target.files).forEach(uploadFile)}
        />
      </div>

      {/* URL input */}
      <div className="flex gap-2">
        <input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Or paste image URL (https://...)"
          onKeyDown={(e) => e.key === "Enter" && addUrl()}
          className={`${inp} flex-1`}
        />
        <button
          onClick={addUrl}
          type="button"
          className="px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-600 transition-colors"
        >
          Add
        </button>
      </div>

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, i) => (
            <div key={i} className="relative aspect-square group">
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => (e.target.style.opacity = "0.3")}
              />
              <button
                onClick={() => onImagesChange(images.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded font-medium">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Product Form ──────────────────────────────────────────────────────────────
function ProductForm({ product, categories, attributes, onClose, onSave }) {
  const sizeAttr = attributes.find(
    (a) => a.slug === "size" || a.name.toLowerCase() === "size"
  );
  const colorAttr = attributes.find(
    (a) =>
      a.slug === "colour" ||
      a.slug === "color" ||
      a.name.toLowerCase().includes("colour") ||
      a.name.toLowerCase() === "color"
  );

  const [form, setForm] = useState(() => {
    if (product)
      return {
        ...product,
        details: product.details?.join("\n") || "",
        salePrice: product.salePrice || "",
        images: product.images || [],
        sizes: product.sizes || [],
        colors: product.colors || [],
        seo: product.seo || { title: "", description: "" },
      };
    return {
      name: "",
      slug: "",
      description: "",
      details: "",
      category: categories[0]?.slug || "tops",
      price: "",
      salePrice: "",
      stock: 0,
      images: [],
      sizes: [],
      colors: [{ name: "Ivory", hex: "#F5F0E8", image: "" }],
      isFeatured: false,
      isNewArrival: false,
      isActive: true,
      seo: { title: "", description: "" },
    };
  });

  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("basic");
  const [error, setError] = useState("");

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleSize = (s) =>
    upd(
      "sizes",
      form.sizes.includes(s)
        ? form.sizes.filter((x) => x !== s)
        : [...form.sizes, s]
    );

  const addColor = () =>
    upd("colors", [
      ...form.colors,
      { name: "New Color", hex: "#CCCCCC", image: "" },
    ]);
  const updColor = (i, k, v) => {
    const c = [...form.colors];
    c[i] = { ...c[i], [k]: v };
    upd("colors", c);
  };
  const remColor = (i) =>
    upd(
      "colors",
      form.colors.filter((_, j) => j !== i)
    );

  const save = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Name is required");
    if (!form.price) return setError("Price is required");
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        details: form.details.split("\n").filter(Boolean),
        price: Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : null,
        stock: Number(form.stock),
      };
      const url = product
        ? `${API}/admin/products/${product._id}`
        : `${API}/admin/products`;
      const method = product ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: hdr(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        onSave();
        onClose();
      } else setError(data.message || "Save failed");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const tabs = ["basic", "images", "sizes & colors", "seo"];

  return (
    <div className="fixed inset-0 z-50 flex bg-gray-50">
      {/* Left: form */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
          >
            <X size={16} /> Close
          </button>
          <h2 className="font-bold text-gray-900 text-sm">
            {product ? "Edit Product" : "New Product"}
          </h2>
          <button
            onClick={save}
            disabled={saving}
            className="bg-[#C4622D] hover:bg-[#b54e22] text-white px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Product"}
          </button>
        </div>

        {/* Tab nav */}
        <div className="flex gap-1 px-6 pt-4 flex-shrink-0 bg-white border-b border-gray-100">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-xs font-medium rounded-t-lg capitalize transition-colors ${
                tab === t
                  ? "bg-gray-50 text-[#C4622D] border-b-2 border-[#C4622D]"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {error && (
          <div className="mx-6 mt-3 bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* BASIC */}
          {tab === "basic" && (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Product Name *
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => upd("name", e.target.value)}
                    placeholder="e.g. Noor Longline Blazer"
                    className={inp}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => upd("category", e.target.value)}
                    className={`${inp} bg-white`}
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                    {categories.length === 0 && (
                      <option value="tops">Tops & Blouses</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.stock}
                    onChange={(e) => upd("stock", e.target.value)}
                    className={inp}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Regular Price (Rs.) *
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => upd("price", e.target.value)}
                    placeholder="3200"
                    className={inp}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Sale Price (Rs.){" "}
                    <span className="font-normal text-gray-400">optional</span>
                  </label>
                  <input
                    type="number"
                    value={form.salePrice}
                    onChange={(e) => upd("salePrice", e.target.value)}
                    placeholder="Leave blank for no sale"
                    className={inp}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Description *
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => upd("description", e.target.value)}
                  placeholder="Describe the product — fabric, occasion, silhouette..."
                  className={`${inp} resize-none`}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Product Details{" "}
                  <span className="font-normal text-gray-400">
                    (one per line)
                  </span>
                </label>
                <textarea
                  rows={5}
                  value={form.details}
                  onChange={(e) => upd("details", e.target.value)}
                  placeholder={
                    "100% Cotton lawn fabric\nHigh-rise waist\nMachine washable at 30°C"
                  }
                  className={`${inp} resize-none font-mono text-xs`}
                />
              </div>

              {/* Toggles */}
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { k: "isActive", l: "Active", s: "Visible to customers" },
                  { k: "isFeatured", l: "Featured", s: "Show on homepage" },
                  { k: "isNewArrival", l: "New Arrival", s: "Show New badge" },
                ].map(({ k, l, s }) => (
                  <label
                    key={k}
                    className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{l}</p>
                      <p className="text-[10px] text-gray-400">{s}</p>
                    </div>
                    <div
                      onClick={() => upd(k, !form[k])}
                      className={tog(form[k])}
                    >
                      <div className={knob(form[k])} />
                    </div>
                  </label>
                ))}
              </div>
            </>
          )}

          {/* IMAGES */}
          {tab === "images" && (
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-3">
                Product Images
              </label>
              <ImageUploader
                images={form.images}
                onImagesChange={(v) => upd("images", v)}
              />
              <p className="text-xs text-gray-400 mt-2">
                First image is the main display image. Drag to reorder (coming
                soon).
              </p>
            </div>
          )}

          {/* SIZES & COLORS */}
          {tab === "sizes & colors" && (
            <>
              {/* Sizes from attribute system */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-3">
                  Available Sizes
                  {sizeAttr && (
                    <span className="font-normal text-gray-400 ml-2">
                      — from Attributes: {sizeAttr.name}
                    </span>
                  )}
                </label>
                {sizeAttr?.values?.filter((v) => v.isActive).length > 0 ? (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {sizeAttr.values
                        .filter((v) => v.isActive)
                        .map((val) => (
                          <button
                            key={val.value}
                            type="button"
                            onClick={() => toggleSize(val.value)}
                            className={`px-4 py-2 text-xs font-body font-medium border transition-all ${
                              form.sizes.includes(val.value)
                                ? "bg-[#2D2D2D] border-[#2D2D2D] text-white"
                                : "border-gray-200 text-gray-600 hover:border-gray-400"
                            }`}
                          >
                            {val.label}
                          </button>
                        ))}
                    </div>
                    {form.sizes.length > 0 && (
                      <p className="text-xs text-gray-400 mt-2">
                        Selected: {form.sizes.join(", ")}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-700">
                    No Size attribute found. Go to <strong>Attributes</strong>{" "}
                    page and create a Size attribute first.
                  </div>
                )}
              </div>

              {/* Colors */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Colours
                    {colorAttr && (
                      <span className="font-normal text-gray-400 ml-2">
                        — from Attributes: {colorAttr.name}
                      </span>
                    )}
                  </label>
                  <button
                    onClick={addColor}
                    type="button"
                    className="flex items-center gap-1.5 text-xs text-[#C4622D] hover:underline"
                  >
                    <Plus size={12} /> Add Color
                  </button>
                </div>

                {/* Quick add from attributes */}
                {colorAttr?.values?.length > 0 ? (
                  <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-2">
                      Quick add from <strong>{colorAttr.name}</strong>{" "}
                      attribute:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {colorAttr.values
                        .filter((v) => v.isActive)
                        .map((val) => (
                          <button
                            key={val.value}
                            type="button"
                            onClick={() => {
                              if (
                                !form.colors.find((c) => c.name === val.label)
                              ) {
                                upd("colors", [
                                  ...form.colors,
                                  {
                                    name: val.label,
                                    hex: val.color || "#CCCCCC",
                                    image: "",
                                  },
                                ]);
                              }
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs transition-colors ${
                              form.colors.find((c) => c.name === val.label)
                                ? "border-[#C4622D] bg-[#C4622D]/5"
                                : "border-gray-200 hover:border-[#C4622D]"
                            }`}
                          >
                            <div
                              className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0"
                              style={{ backgroundColor: val.color }}
                            />
                            {val.label}
                            {form.colors.find((c) => c.name === val.label) && (
                              <span className="text-[#C4622D]">✓</span>
                            )}
                          </button>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="mb-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-700">
                    No Colour attribute found. Go to <strong>Attributes</strong>{" "}
                    page to create one, then colours will appear here.
                  </div>
                )}

                <div className="space-y-3">
                  {form.colors.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl"
                    >
                      <input
                        type="color"
                        value={c.hex || "#000000"}
                        onChange={(e) => updColor(i, "hex", e.target.value)}
                        className="w-10 h-10 rounded-lg border border-gray-200 p-0.5 cursor-pointer flex-shrink-0"
                      />
                      <input
                        value={c.name}
                        onChange={(e) => updColor(i, "name", e.target.value)}
                        placeholder="Color name"
                        className={`${inp} flex-1`}
                      />
                      <input
                        value={c.image || ""}
                        onChange={(e) => updColor(i, "image", e.target.value)}
                        placeholder="Image URL for this color (optional)"
                        className={`${inp} flex-1`}
                      />
                      <button
                        onClick={() => remColor(i)}
                        type="button"
                        className="text-gray-300 hover:text-red-500 flex-shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* SEO */}
          {tab === "seo" && (
            <>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  SEO Title{" "}
                  <span className="font-normal text-gray-400">
                    (leave blank to use product name)
                  </span>
                </label>
                <input
                  value={form.seo?.title || ""}
                  onChange={(e) =>
                    upd("seo", { ...form.seo, title: e.target.value })
                  }
                  className={inp}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {(form.seo?.title || "").length}/60 chars
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  SEO Description
                </label>
                <textarea
                  rows={3}
                  value={form.seo?.description || ""}
                  onChange={(e) =>
                    upd("seo", { ...form.seo, description: e.target.value })
                  }
                  placeholder="Meta description for Google..."
                  className={`${inp} resize-none`}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {(form.seo?.description || "").length}/160 chars
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  URL Slug
                </label>
                <input
                  value={form.slug || ""}
                  onChange={(e) => upd("slug", e.target.value)}
                  placeholder="auto-generated from name"
                  className={`${inp} font-mono`}
                />
                <p className="text-xs text-gray-400 mt-1">
                  URL: /shop/{form.slug || "(auto)"}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right: quick preview */}
      <div className="w-72 bg-white border-l border-gray-200 p-5 overflow-y-auto hidden lg:block">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Quick Preview
        </p>
        <div className="bg-gray-50 rounded-xl overflow-hidden">
          {form.images[0] ? (
            <img
              src={form.images[0]}
              alt=""
              className="w-full aspect-[3/4] object-cover"
            />
          ) : (
            <div className="w-full aspect-[3/4] flex items-center justify-center text-gray-200">
              <ImageIcon size={32} />
            </div>
          )}
          <div className="p-4">
            <p className="font-semibold text-gray-900 text-sm leading-tight">
              {form.name || "Product Name"}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              {form.salePrice && (
                <span className="text-xs text-gray-400 line-through">
                  Rs. {Number(form.price).toLocaleString()}
                </span>
              )}
              <span className="font-bold text-[#C4622D]">
                Rs. {Number(form.salePrice || form.price || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex gap-1 mt-2 flex-wrap">
              {form.isFeatured && (
                <span className="text-[9px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-semibold">
                  FEATURED
                </span>
              )}
              {form.isNewArrival && (
                <span className="text-[9px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded font-semibold">
                  NEW
                </span>
              )}
              {form.salePrice && (
                <span className="text-[9px] bg-red-100 text-red-500 px-1.5 py-0.5 rounded font-semibold">
                  SALE
                </span>
              )}
            </div>
            {form.sizes.length > 0 && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {form.sizes.map((s) => (
                  <span
                    key={s}
                    className="text-[9px] border border-gray-200 px-1.5 py-0.5 rounded text-gray-500"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stock indicator */}
        <div className="mt-4 p-3 bg-gray-50 rounded-xl">
          <p className="text-xs font-semibold text-gray-600 mb-1">
            Stock Status
          </p>
          <div
            className={`text-xs font-bold ${
              Number(form.stock) > 10
                ? "text-green-600"
                : Number(form.stock) > 0
                ? "text-yellow-600"
                : "text-red-500"
            }`}
          >
            {Number(form.stock) > 10
              ? "✓ In Stock"
              : Number(form.stock) > 0
              ? `⚠ Low Stock (${form.stock})`
              : "✗ Out of Stock"}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Products List ─────────────────────────────────────────────────────────────
function ProductsContent() {
  const { admin, loading: authLoading } = useAdminAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [stockEdit, setStockEdit] = useState(null);
  const [newStock, setNewStock] = useState("");
  const router = useRouter();

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (search) params.set("search", search);
    if (catFilter) params.set("category", catFilter);
    const data = await fetch(`${API}/admin/products?${params}`, {
      headers: hdr(),
    }).then((r) => r.json());
    setProducts(data.products || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && !admin) router.push("/admin/login");
  }, [admin, authLoading]);
  useEffect(() => {
    if (admin) {
      fetch(`${API}/admin/categories`, { headers: hdr() })
        .then((r) => r.json())
        .then((d) => setCategories(d.categories || []));
      fetch(`${API}/admin/attributes`, { headers: hdr() })
        .then((r) => r.json())
        .then((d) => setAttributes(d.attributes || []));
    }
  }, [admin]);
  useEffect(() => {
    if (admin) load();
  }, [admin, page]);
  useEffect(() => {
    const t = setTimeout(() => {
      if (admin) {
        setPage(1);
        load();
      }
    }, 400);
    return () => clearTimeout(t);
  }, [search, catFilter]);

  const deleteProduct = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    await fetch(`${API}/admin/products/${id}`, {
      method: "DELETE",
      headers: hdr(),
    });
    load();
  };

  const saveStock = async () => {
    await fetch(`${API}/admin/products/${stockEdit._id}/stock`, {
      method: "PATCH",
      headers: hdr(),
      body: JSON.stringify({ stock: Number(newStock) }),
    });
    setStockEdit(null);
    load();
  };

  const toggleFeatured = async (p) => {
    await fetch(`${API}/admin/products/${p._id}`, {
      method: "PUT",
      headers: hdr(),
      body: JSON.stringify({ isFeatured: !p.isFeatured }),
    });
    load();
  };

  const lowStock = products.filter((p) => p.stock <= 5 && p.stock > 0).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">
            {total} products
            {lowStock > 0 && (
              <span className="text-yellow-600 ml-2">
                · {lowStock} low stock
              </span>
            )}
            {outOfStock > 0 && (
              <span className="text-red-500 ml-2">
                · {outOfStock} out of stock
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 bg-[#C4622D] hover:bg-[#b54e22] text-white px-4 py-2.5 rounded-lg text-sm font-medium"
        >
          <Plus size={16} /> New Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C4622D]"
          />
        </div>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#C4622D] bg-white"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
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
                  "Product",
                  "Category",
                  "Price",
                  "Stock",
                  "Status",
                  "Featured",
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
                  <td colSpan={7} className="py-16 text-center text-gray-400">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-gray-400">
                    <Package size={32} className="mx-auto mb-2 text-gray-200" />
                    No products yet
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr
                    key={p._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.images?.[0] ? (
                          <img
                            src={p.images[0]}
                            alt=""
                            className="w-10 h-12 object-cover rounded flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                            <ImageIcon size={14} className="text-gray-300" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 leading-tight line-clamp-1">
                            {p.name}
                          </p>
                          <p className="text-xs text-gray-400 font-mono">
                            {p.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs capitalize">
                      {p.category}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        {p.salePrice && (
                          <p className="text-xs text-gray-400 line-through">
                            Rs. {p.price?.toLocaleString()}
                          </p>
                        )}
                        <p className="font-semibold text-gray-900">
                          Rs. {(p.salePrice || p.price)?.toLocaleString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {stockEdit?._id === p._id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={newStock}
                            onChange={(e) => setNewStock(e.target.value)}
                            className="w-16 border border-gray-200 rounded px-2 py-1 text-xs outline-none focus:border-[#C4622D]"
                          />
                          <button
                            onClick={saveStock}
                            className="text-green-600 text-xs font-medium hover:underline"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setStockEdit(null)}
                            className="text-gray-400 text-xs hover:underline"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setStockEdit(p);
                            setNewStock(p.stock);
                          }}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer ${
                            p.stock === 0
                              ? "bg-red-100 text-red-600"
                              : p.stock <= 5
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {p.stock === 0
                            ? "Out of Stock"
                            : `${p.stock} in stock`}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          p.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {p.isActive ? "Active" : "Hidden"}
                      </span>
                      {p.isNewArrival && (
                        <span className="ml-1 text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-semibold">
                          New
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleFeatured(p)}
                        className={`transition-colors ${
                          p.isFeatured
                            ? "text-yellow-400"
                            : "text-gray-200 hover:text-yellow-300"
                        }`}
                      >
                        <Star
                          size={16}
                          fill={p.isFeatured ? "currentColor" : "none"}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditing(p)}
                          className="p-1.5 text-gray-400 hover:text-[#C4622D] transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => deleteProduct(p._id, p.name)}
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
              <span className="px-3 py-1.5 text-xs text-gray-500">
                Page {page}
              </span>
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

      {adding && (
        <ProductForm
          categories={categories}
          attributes={attributes}
          onClose={() => setAdding(false)}
          onSave={load}
        />
      )}
      {editing && (
        <ProductForm
          product={editing}
          categories={categories}
          attributes={attributes}
          onClose={() => setEditing(null)}
          onSave={load}
        />
      )}
    </AdminLayout>
  );
}

export default function AdminProducts() {
  return (
    <AdminAuthProvider>
      <ProductsContent />
    </AdminAuthProvider>
  );
}
