"use client";
import { useEffect, useState } from "react";
import {
  AdminAuthProvider,
  useAdminAuth,
} from "../../../components/admin/AdminAuthProvider";
import AdminLayout from "../../../components/admin/AdminLayout";
import { useRouter } from "next/navigation";
import { Save, Check, RefreshCw } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const hdr = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("lef_admin_token")}`,
});

const PRESETS = {
  terracotta: {
    label: "Terracotta",
    primary: "#C4622D",
    background: "#F5F0E8",
    dark: "#2D2D2D",
    secondary: "#8FAF8A",
  },
  midnight: {
    label: "Midnight",
    primary: "#4A6FA5",
    background: "#F0F2F5",
    dark: "#1a1a2e",
    secondary: "#7B9EA6",
  },
  emerald: {
    label: "Emerald",
    primary: "#2D6A4F",
    background: "#F4F9F4",
    dark: "#1b2e1b",
    secondary: "#74C69D",
  },
  rose: {
    label: "Rose",
    primary: "#B5446E",
    background: "#FDF4F7",
    dark: "#2D1A21",
    secondary: "#D4A0B5",
  },
  charcoal: {
    label: "Charcoal",
    primary: "#E0A458",
    background: "#F5F5F5",
    dark: "#1C1C1C",
    secondary: "#A8A8A8",
  },
  purple: {
    label: "Purple",
    primary: "#7B2D8B",
    background: "#F8F4FA",
    dark: "#1D0D22",
    secondary: "#B088C0",
  },
  gold: {
    label: "Gold",
    primary: "#B8860B",
    background: "#FDFAF0",
    dark: "#2B2200",
    secondary: "#D4B483",
  },
  blush: {
    label: "Blush",
    primary: "#D4738A",
    background: "#FDF6F8",
    dark: "#2E1520",
    secondary: "#F0B8C4",
  },
};

const inp =
  "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#C4622D] bg-white";

function ThemeContent() {
  const { admin, loading: authLoading } = useAdminAuth();
  const [theme, setTheme] = useState({ preset: "terracotta" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !admin) router.push("/admin/login");
  }, [admin, authLoading]);

  useEffect(() => {
    if (admin) {
      fetch(`${API}/admin/settings`, { headers: hdr() })
        .then((r) => r.json())
        .then((d) => {
          if (d.success && d.settings?.theme) setTheme(d.settings.theme);
        })
        .finally(() => setLoading(false));
    }
  }, [admin]);

  const applyPreset = (key) => {
    const p = PRESETS[key];
    setTheme((t) => ({
      ...t,
      preset: key,
      primary: p.primary,
      background: p.background,
      dark: p.dark,
      secondary: p.secondary,
    }));
  };

  const upd = (k, v) => setTheme((t) => ({ ...t, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/admin/settings/theme`, {
        method: "PUT",
        headers: hdr(),
        body: JSON.stringify({ theme }),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
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

  const currentPreset = PRESETS[theme.preset] || PRESETS.terracotta;

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Theme</h1>
          <p className="text-sm text-gray-500">
            Customise your store's colours and feel
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            saved
              ? "bg-green-500 text-white"
              : "bg-[#C4622D] hover:bg-[#b54e22] text-white"
          } disabled:opacity-60`}
        >
          {saved ? (
            <>
              <Check size={14} /> Saved!
            </>
          ) : saving ? (
            <>
              <RefreshCw size={14} className="animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save size={14} /> Save Theme
            </>
          )}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Presets */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">
              Colour Presets
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(PRESETS).map(([key, p]) => (
                <button
                  key={key}
                  onClick={() => applyPreset(key)}
                  className={`relative p-3 rounded-xl border-2 transition-all text-left ${
                    theme.preset === key
                      ? "border-[#C4622D] shadow-md"
                      : "border-gray-100 hover:border-gray-300"
                  }`}
                >
                  <div className="flex gap-1 mb-2">
                    <div
                      className="w-5 h-5 rounded-full"
                      style={{ backgroundColor: p.primary }}
                    />
                    <div
                      className="w-5 h-5 rounded-full"
                      style={{ backgroundColor: p.background }}
                    />
                    <div
                      className="w-5 h-5 rounded-full"
                      style={{ backgroundColor: p.dark }}
                    />
                  </div>
                  <p className="text-[10px] font-semibold text-gray-700">
                    {p.label}
                  </p>
                  {theme.preset === key && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-[#C4622D] rounded-full flex items-center justify-center">
                      <Check size={9} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom colours */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">
              Custom Colours
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  k: "primary",
                  l: "Primary Colour",
                  hint: "Buttons, accents, links",
                },
                {
                  k: "background",
                  l: "Background",
                  hint: "Main page background",
                },
                { k: "dark", l: "Dark Colour", hint: "Footer, dark sections" },
                { k: "secondary", l: "Secondary", hint: "Badges, highlights" },
                {
                  k: "navBg",
                  l: "Navbar Background",
                  hint: "Top navigation bar",
                },
                { k: "btnBg", l: "Button Background", hint: "CTA buttons" },
              ].map((f) => (
                <div key={f.k}>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    {f.l}
                  </label>
                  <p className="text-[10px] text-gray-400 mb-1.5">{f.hint}</p>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={theme[f.k] || currentPreset[f.k] || "#000000"}
                      onChange={(e) => upd(f.k, e.target.value)}
                      className="w-10 h-10 rounded-lg border border-gray-200 p-0.5 cursor-pointer flex-shrink-0"
                    />
                    <input
                      value={theme[f.k] || currentPreset[f.k] || ""}
                      onChange={(e) => upd(f.k, e.target.value)}
                      placeholder="e.g. #C4622D"
                      className={inp}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nav & button effects */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">
              Effects
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Navbar Scroll Effect
                </label>
                <select
                  value={theme.navScrollEffect || "blur"}
                  onChange={(e) => upd("navScrollEffect", e.target.value)}
                  className={inp}
                >
                  <option value="blur">Blur (frosted glass)</option>
                  <option value="solid">Solid background</option>
                  <option value="transparent">Stay transparent</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Button Border Radius
                </label>
                <select
                  value={theme.buttonRadius || "0px"}
                  onChange={(e) => upd("buttonRadius", e.target.value)}
                  className={inp}
                >
                  <option value="0px">Sharp (0px)</option>
                  <option value="4px">Slight (4px)</option>
                  <option value="8px">Rounded (8px)</option>
                  <option value="9999px">Pill</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sticky top-6">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">
              Live Preview
            </h3>
            <div className="rounded-xl overflow-hidden border border-gray-100">
              {/* Mini navbar */}
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{
                  backgroundColor: theme.navBg || currentPreset.background,
                }}
              >
                <span
                  className="text-xs font-bold"
                  style={{ color: theme.primary || currentPreset.primary }}
                >
                  لباسِ فردا
                </span>
                <div className="flex gap-2">
                  {["Shop", "About"].map((l) => (
                    <span
                      key={l}
                      className="text-[10px]"
                      style={{ color: theme.dark || currentPreset.dark }}
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>
              {/* Hero */}
              <div
                className="px-4 py-6 text-center"
                style={{
                  backgroundColor: theme.background || currentPreset.background,
                }}
              >
                <p
                  className="text-[10px] mb-1"
                  style={{ color: theme.primary || currentPreset.primary }}
                >
                  NEW ARRIVALS
                </p>
                <p
                  className="text-sm font-light mb-3"
                  style={{ color: theme.dark || currentPreset.dark }}
                >
                  Dress the woman
                  <br />
                  you're becoming.
                </p>
                <button
                  className="text-[10px] px-3 py-1.5 font-medium tracking-wider"
                  style={{
                    backgroundColor:
                      theme.btnBg || theme.dark || currentPreset.dark,
                    color: "#F5F0E8",
                    borderRadius: theme.buttonRadius || "0px",
                  }}
                >
                  SHOP NOW
                </button>
              </div>
              {/* Product card */}
              <div
                className="p-3"
                style={{
                  backgroundColor: theme.background || currentPreset.background,
                }}
              >
                <div className="bg-gray-100 aspect-[3/4] rounded mb-2" />
                <p
                  className="text-[10px] font-medium"
                  style={{ color: theme.dark || currentPreset.dark }}
                >
                  Noor Blazer
                </p>
                <p
                  className="text-[10px]"
                  style={{ color: theme.primary || currentPreset.primary }}
                >
                  Rs. 7,200
                </p>
              </div>
              {/* Footer strip */}
              <div
                className="px-4 py-3 text-center"
                style={{ backgroundColor: theme.dark || currentPreset.dark }}
              >
                <p
                  className="text-[9px]"
                  style={{
                    color: theme.background || currentPreset.background,
                  }}
                >
                  © 2026 Libaas-e-Farda
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                Active Preset
              </p>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full border border-gray-200"
                  style={{
                    backgroundColor: theme.primary || currentPreset.primary,
                  }}
                />
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {PRESETS[theme.preset]?.label || "Terracotta"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function AdminTheme() {
  return (
    <AdminAuthProvider>
      <ThemeContent />
    </AdminAuthProvider>
  );
}
