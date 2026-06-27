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
  ChevronDown,
  ChevronRight,
  Tag,
  Palette,
  ToggleLeft,
  Type,
  Hash,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const h = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("lef_admin_token")}`,
});
const inp =
  "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#C4622D] transition-colors bg-white";

const TYPE_INFO = {
  select: {
    label: "Dropdown Select",
    icon: ChevronDown,
    desc: "Customer picks from a list (e.g. fabric type, fit)",
  },
  color: {
    label: "Colour Picker",
    icon: Palette,
    desc: "Shows colour circles (e.g. size, colour)",
  },
  swatch: {
    label: "Image Swatch",
    icon: Tag,
    desc: "Shows small images (e.g. pattern, print)",
  },
  text: {
    label: "Text Input",
    icon: Type,
    desc: "Free text (e.g. custom note, engraving)",
  },
  boolean: {
    label: "Yes/No Toggle",
    icon: ToggleLeft,
    desc: "On/off option (e.g. gift wrap, deal)",
  },
  number: {
    label: "Number",
    icon: Hash,
    desc: "Numeric value (e.g. quantity limit, discount %)",
  },
};

const emptyAttr = {
  name: "",
  type: "select",
  isRequired: false,
  isVisible: true,
  isFilterable: true,
  isVariant: true,
  description: "",
  values: [],
};
const emptyValue = {
  label: "",
  value: "",
  color: "#C4622D",
  image: "",
  isActive: true,
};

function AttributeModal({ attribute, onClose, onSave }) {
  const [form, setForm] = useState(
    attribute ? { ...attribute, values: attribute.values || [] } : emptyAttr
  );
  const [newVal, setNewVal] = useState({ ...emptyValue });
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("info");

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const addValue = () => {
    if (!newVal.label.trim()) return;
    const val = {
      ...newVal,
      value: newVal.value || newVal.label.toLowerCase().replace(/\s+/g, "-"),
      order: form.values.length,
    };
    setForm((f) => ({ ...f, values: [...f.values, val] }));
    setNewVal({ ...emptyValue });
  };

  const removeValue = (i) =>
    setForm((f) => ({ ...f, values: f.values.filter((_, j) => j !== i) }));
  const updateValue = (i, k, v) =>
    setForm((f) => {
      const vals = [...f.values];
      vals[i] = { ...vals[i], [k]: v };
      return { ...f, values: vals };
    });

  const save = async () => {
    if (!form.name.trim()) return alert("Name is required");
    setSaving(true);
    try {
      const url = attribute
        ? `${API}/admin/attributes/${attribute._id}`
        : `${API}/admin/attributes`;
      const method = attribute ? "PUT" : "POST";
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

  const typeInfo = TYPE_INFO[form.type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
          <h2 className="font-bold text-gray-900">
            {attribute ? "Edit Attribute" : "New Attribute"}
          </h2>
          <button onClick={onClose}>
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4 flex-shrink-0">
          {["info", "values", "settings"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-xs font-medium rounded-lg capitalize transition-colors ${
                tab === t
                  ? "bg-[#C4622D] text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {t === "values" ? `Values (${form.values.length})` : t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* INFO TAB */}
          {tab === "info" && (
            <>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Attribute Name *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="e.g. Colour, Size, Deal, Fabric"
                  className={inp}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                  Type
                </label>
                <div className="grid sm:grid-cols-2 gap-2">
                  {Object.entries(TYPE_INFO).map(([type, info]) => (
                    <button
                      key={type}
                      onClick={() => update("type", type)}
                      className={`flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                        form.type === type
                          ? "border-[#C4622D] bg-[#C4622D]/5"
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <info.icon
                        size={16}
                        className={
                          form.type === type
                            ? "text-[#C4622D] flex-shrink-0 mt-0.5"
                            : "text-gray-400 flex-shrink-0 mt-0.5"
                        }
                      />
                      <div>
                        <p
                          className={`text-xs font-semibold ${
                            form.type === type
                              ? "text-[#C4622D]"
                              : "text-gray-700"
                          }`}
                        >
                          {info.label}
                        </p>
                        <p className="text-[10px] text-gray-400 leading-tight mt-0.5">
                          {info.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
                {typeInfo && (
                  <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg px-4 py-2.5 text-xs text-blue-700">
                    <strong>{typeInfo.label}:</strong> {typeInfo.desc}
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Description{" "}
                  <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <input
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Internal notes about this attribute"
                  className={inp}
                />
              </div>
            </>
          )}

          {/* VALUES TAB */}
          {tab === "values" && (
            <>
              <p className="text-xs text-gray-400">
                {form.type === "color" &&
                  "Add colour options with their hex codes. These will show as colour circles on product pages."}
                {form.type === "select" &&
                  "Add options for customers to choose from in a dropdown menu."}
                {form.type === "swatch" && "Add swatch options with images."}
                {form.type === "boolean" &&
                  "This type has no values — it shows as a Yes/No toggle."}
                {form.type === "text" &&
                  "This type has no predefined values — customers type their own."}
                {form.type === "number" &&
                  "Optionally add preset number values."}
              </p>

              {/* Add new value */}
              {!["boolean", "text"].includes(form.type) && (
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Add Value
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">
                        Display Label *
                      </label>
                      <input
                        value={newVal.label}
                        onChange={(e) =>
                          setNewVal((v) => ({ ...v, label: e.target.value }))
                        }
                        placeholder={
                          form.type === "color"
                            ? "e.g. Forest Green"
                            : "e.g. Option Name"
                        }
                        className={inp}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">
                        Value (slug)
                      </label>
                      <input
                        value={newVal.value}
                        onChange={(e) =>
                          setNewVal((v) => ({ ...v, value: e.target.value }))
                        }
                        placeholder="auto-generated from label"
                        className={inp}
                      />
                    </div>
                    {form.type === "color" && (
                      <>
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">
                            Hex Color
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={newVal.color}
                              onChange={(e) =>
                                setNewVal((v) => ({
                                  ...v,
                                  color: e.target.value,
                                }))
                              }
                              className="w-10 h-10 rounded-lg border border-gray-200 p-0.5 cursor-pointer flex-shrink-0"
                            />
                            <input
                              value={newVal.color}
                              onChange={(e) =>
                                setNewVal((v) => ({
                                  ...v,
                                  color: e.target.value,
                                }))
                              }
                              className={inp}
                            />
                          </div>
                        </div>
                      </>
                    )}
                    {form.type === "swatch" && (
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">
                          Image URL
                        </label>
                        <input
                          value={newVal.image}
                          onChange={(e) =>
                            setNewVal((v) => ({ ...v, image: e.target.value }))
                          }
                          placeholder="https://..."
                          className={inp}
                        />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={addValue}
                    className="flex items-center gap-2 bg-[#C4622D] text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-[#b54e22]"
                  >
                    <Plus size={13} /> Add Value
                  </button>
                </div>
              )}

              {/* Existing values */}
              {form.values.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Values ({form.values.length})
                  </p>
                  {form.values.map((val, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl"
                    >
                      {/* Color preview */}
                      {form.type === "color" && (
                        <div
                          className="w-8 h-8 rounded-full border-2 border-gray-200 flex-shrink-0"
                          style={{ backgroundColor: val.color }}
                        />
                      )}
                      {form.type === "swatch" && val.image && (
                        <img
                          src={val.image}
                          alt=""
                          className="w-8 h-8 object-cover rounded flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <input
                          value={val.label}
                          onChange={(e) =>
                            updateValue(i, "label", e.target.value)
                          }
                          className="border border-gray-100 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-[#C4622D]"
                        />
                        {form.type === "color" && (
                          <div className="flex gap-1">
                            <input
                              type="color"
                              value={val.color || "#000"}
                              onChange={(e) =>
                                updateValue(i, "color", e.target.value)
                              }
                              className="w-9 h-9 rounded-lg border border-gray-200 p-0.5 cursor-pointer"
                            />
                            <input
                              value={val.color || ""}
                              onChange={(e) =>
                                updateValue(i, "color", e.target.value)
                              }
                              className="flex-1 border border-gray-100 rounded-lg px-2.5 py-1.5 text-xs font-mono outline-none focus:border-[#C4622D]"
                            />
                          </div>
                        )}
                      </div>
                      <div
                        onClick={() =>
                          updateValue(i, "isActive", !val.isActive)
                        }
                        className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                          val.isActive ? "bg-[#C4622D]" : "bg-gray-200"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${
                            val.isActive ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </div>
                      <button
                        onClick={() => removeValue(i)}
                        className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {form.values.length === 0 &&
                !["boolean", "text"].includes(form.type) && (
                  <div className="text-center py-8 text-gray-300">
                    <Tag size={24} className="mx-auto mb-2" />
                    <p className="text-sm">
                      No values yet — add your first one above
                    </p>
                  </div>
                )}
            </>
          )}

          {/* SETTINGS TAB */}
          {tab === "settings" && (
            <div className="space-y-3">
              {[
                {
                  key: "isRequired",
                  label: "Required",
                  sub: "Customers must select this before adding to cart",
                },
                {
                  key: "isVisible",
                  label: "Visible",
                  sub: "Show on product page",
                },
                {
                  key: "isFilterable",
                  label: "Filterable",
                  sub: "Appear as a filter option in shop page",
                },
                {
                  key: "isVariant",
                  label: "Creates Variant",
                  sub: "Each value is a separate product variant",
                },
              ].map(({ key, label, sub }) => (
                <label
                  key={key}
                  className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 rounded-xl"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
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
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={form.order || 0}
                  onChange={(e) => update("order", Number(e.target.value))}
                  className={inp}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 px-6 py-4 border-t bg-gray-50 flex-shrink-0">
          <button
            onClick={save}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 bg-[#C4622D] hover:bg-[#b54e22] text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-60"
          >
            <Save size={14} /> {saving ? "Saving..." : "Save Attribute"}
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

function AttributesContent() {
  const { admin, loading: authLoading } = useAdminAuth();
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [expanded, setExpanded] = useState({});
  const router = useRouter();

  const fetchAttributes = async () => {
    setLoading(true);
    const data = await fetch(`${API}/admin/attributes`, { headers: h() }).then(
      (r) => r.json()
    );
    setAttributes(data.attributes || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && !admin) router.push("/admin/login");
  }, [admin, authLoading]);
  useEffect(() => {
    if (admin) fetchAttributes();
  }, [admin]);

  const deleteAttribute = async (id, name) => {
    if (!confirm(`Delete attribute "${name}"?`)) return;
    await fetch(`${API}/admin/attributes/${id}`, {
      method: "DELETE",
      headers: h(),
    });
    fetchAttributes();
  };

  const typeColors = {
    select: "bg-blue-100 text-blue-700",
    color: "bg-pink-100 text-pink-700",
    swatch: "bg-purple-100 text-purple-700",
    text: "bg-gray-100 text-gray-600",
    boolean: "bg-green-100 text-green-700",
    number: "bg-yellow-100 text-yellow-700",
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Attributes</h1>
          <p className="text-sm text-gray-500">
            Define product attributes like Size, Colour, Deals, Fabric —
            anything you need
          </p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 bg-[#C4622D] hover:bg-[#b54e22] text-white px-4 py-2.5 rounded-lg text-sm font-medium"
        >
          <Plus size={16} /> New Attribute
        </button>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 mb-5 flex items-start gap-3">
        <span className="text-blue-500 text-lg flex-shrink-0">ℹ️</span>
        <p className="text-xs text-blue-700">
          Attributes define what options a product has. <strong>Size</strong>{" "}
          and <strong>Colour</strong> are the most common — but you can add
          custom ones like <strong>Deal</strong> (boolean: yes/no),{" "}
          <strong>Fabric</strong> (select: Cotton, Lawn, Chiffon), or{" "}
          <strong>Discount %</strong> (number).
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-7 h-7 border-2 border-[#C4622D] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : attributes.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 py-20 text-center shadow-sm">
          <Tag size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium mb-1">No attributes yet</p>
          <p className="text-gray-400 text-sm mb-5">
            Create Size, Colour, and other attributes to assign to products
          </p>
          <button
            onClick={() => setAdding(true)}
            className="bg-[#C4622D] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#b54e22]"
          >
            Create Your First Attribute
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {attributes.map((attr) => {
            const isExpanded = expanded[attr._id];
            const TypeIcon = TYPE_INFO[attr.type]?.icon || Tag;
            return (
              <div
                key={attr._id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="w-9 h-9 bg-[#C4622D]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TypeIcon size={16} className="text-[#C4622D]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900">
                        {attr.name}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                          typeColors[attr.type]
                        }`}
                      >
                        {TYPE_INFO[attr.type]?.label || attr.type}
                      </span>
                      {attr.isRequired && (
                        <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">
                          Required
                        </span>
                      )}
                      {attr.isFilterable && (
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-semibold">
                          Filterable
                        </span>
                      )}
                      {attr.isVariant && (
                        <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-semibold">
                          Variant
                        </span>
                      )}
                    </div>
                    {attr.description && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {attr.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {attr.values?.length > 0 && (
                      <button
                        onClick={() =>
                          setExpanded((e) => ({
                            ...e,
                            [attr._id]: !e[attr._id],
                          }))
                        }
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 px-2 py-1.5 rounded-lg hover:bg-gray-50"
                      >
                        <span>{attr.values.length} values</span>
                        {isExpanded ? (
                          <ChevronDown size={13} />
                        ) : (
                          <ChevronRight size={13} />
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => setEditing(attr)}
                      className="p-1.5 text-gray-400 hover:text-[#C4622D] transition-colors"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => deleteAttribute(attr._id, attr.name)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Values preview */}
                {isExpanded && attr.values?.length > 0 && (
                  <div className="px-5 pb-4 pt-0 border-t border-gray-50">
                    <div className="flex flex-wrap gap-2 mt-3">
                      {attr.values
                        .filter((v) => v.isActive !== false)
                        .map((val, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5"
                          >
                            {attr.type === "color" && (
                              <div
                                className="w-4 h-4 rounded-full border border-gray-200 flex-shrink-0"
                                style={{ backgroundColor: val.color }}
                              />
                            )}
                            {attr.type === "swatch" && val.image && (
                              <img
                                src={val.image}
                                alt=""
                                className="w-5 h-5 object-cover rounded"
                              />
                            )}
                            <span className="text-xs font-medium text-gray-700">
                              {val.label}
                            </span>
                            {val.color && attr.type === "color" && (
                              <code className="text-[9px] text-gray-400 font-mono">
                                {val.color}
                              </code>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {adding && (
        <AttributeModal
          onClose={() => setAdding(false)}
          onSave={fetchAttributes}
        />
      )}
      {editing && (
        <AttributeModal
          attribute={editing}
          onClose={() => setEditing(null)}
          onSave={fetchAttributes}
        />
      )}
    </AdminLayout>
  );
}

export default function AdminAttributes() {
  return (
    <AdminAuthProvider>
      <AttributesContent />
    </AdminAuthProvider>
  );
}
