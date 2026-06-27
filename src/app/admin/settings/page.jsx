"use client";
import { useEffect, useState } from "react";
import {
  AdminAuthProvider,
  useAdminAuth,
} from "../../../components/admin/AdminAuthProvider";
import AdminLayout from "../../../components/admin/AdminLayout";
import { useRouter } from "next/navigation";
import {
  Save,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Megaphone,
  CreditCard,
  MessageSquare,
  Globe,
  Truck,
  Shield,
  BookOpen,
  Users,
  Layout,
  Tag,
  Search,
  ArrowUp,
  ArrowDown,
  LayoutDashboard,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const hdr = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("lef_admin_token")}`,
});
const inp =
  "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#C4622D] transition-colors bg-white";
const tog = (on) =>
  `w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
    on ? "bg-[#C4622D]" : "bg-gray-200"
  }`;
const knb = (on) =>
  `absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
    on ? "translate-x-5" : "translate-x-0.5"
  }`;

function Section({ title, icon: Icon, children, defaultOpen = false, badge }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={17} className="text-[#C4622D]" />}
          <span className="font-semibold text-gray-900 text-sm">{title}</span>
          {badge !== undefined && (
            <span className="bg-[#C4622D]/10 text-[#C4622D] text-[10px] font-bold px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        {open ? (
          <ChevronUp size={15} className="text-gray-400" />
        ) : (
          <ChevronDown size={15} className="text-gray-400" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-6 pt-2 border-t border-gray-50 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

function Sv({ onSave, label, saving, saved }) {
  return (
    <button
      onClick={onSave}
      disabled={saving}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all mt-4 ${
        saved
          ? "bg-green-500 text-white"
          : "bg-[#C4622D] hover:bg-[#b54e22] text-white"
      } disabled:opacity-60`}
    >
      <Save size={13} />
      {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
    </button>
  );
}

function SettingsContent() {
  const { admin, loading: authLoading } = useAdminAuth();
  const [S, setS] = useState(null);
  const [loading, setL] = useState(true);
  const [saving, setSv] = useState("");
  const [saved, setSd] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !admin) router.push("/admin/login");
  }, [admin, authLoading]);
  useEffect(() => {
    if (admin) {
      fetch(`${API}/admin/settings`, { headers: hdr() })
        .then((r) => r.json())
        .then((d) => {
          if (d.success) setS(d.settings);
        })
        .finally(() => setL(false));
    }
  }, [admin]);

  const mark = (s) => {
    setSd(s);
    setTimeout(() => setSd(""), 2500);
  };
  const save = async (section) => {
    setSv(section);
    try {
      const r = await fetch(`${API}/admin/settings`, {
        method: "PUT",
        headers: hdr(),
        body: JSON.stringify({ [section]: S[section] }),
      });
      const d = await r.json();
      if (d.success) {
        setS(d.settings);
        mark(section);
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setSv("");
    }
  };
  const sp = (s) => ({ saving: saving === s, saved: saved === s });

  // Simple field updater
  const upd = (sec, k, v) =>
    setS((s) => ({ ...s, [sec]: { ...(s[sec] || {}), [k]: v } }));

  // Array updaters — all defined as named functions to avoid const-in-JSX issues
  const setArr = (section, newArr) =>
    setS((s) => ({ ...s, [section]: newArr }));
  const addArr = (section, item) =>
    setS((s) => ({ ...s, [section]: [...(s[section] || []), item] }));
  const remArr = (section, i) =>
    setS((s) => ({ ...s, [section]: s[section].filter((_, j) => j !== i) }));
  const updArr = (section, i, k, v) => {
    setS((s) => {
      const arr = [...(s[section] || [])];
      arr[i] = { ...arr[i], [k]: v };
      return { ...s, [section]: arr };
    });
  };
  const moveArr = (section, i, dir) => {
    setS((s) => {
      const arr = [...(s[section] || [])];
      const n = i + dir;
      if (n < 0 || n >= arr.length) return s;
      [arr[i], arr[n]] = [arr[n], arr[i]];
      return { ...s, [section]: arr };
    });
  };

  // Nested deep updaters
  const updAboutStats = (i, k, v) => {
    setS((s) => {
      const arr = [...(s.about?.stats || [])];
      arr[i] = { ...arr[i], [k]: v };
      return { ...s, about: { ...s.about, stats: arr } };
    });
  };
  const remAboutStats = (i) =>
    setS((s) => ({
      ...s,
      about: { ...s.about, stats: s.about.stats.filter((_, j) => j !== i) },
    }));

  const updAboutValues = (i, k, v) => {
    setS((s) => {
      const arr = [...(s.about?.values || [])];
      arr[i] = { ...arr[i], [k]: v };
      return { ...s, about: { ...s.about, values: arr } };
    });
  };
  const remAboutValues = (i) =>
    setS((s) => ({
      ...s,
      about: { ...s.about, values: s.about.values.filter((_, j) => j !== i) },
    }));

  const updFaqCategory = (ci, v) => {
    setS((s) => {
      const faqs = [...(s.faqs || [])];
      faqs[ci] = { ...faqs[ci], category: v };
      return { ...s, faqs };
    });
  };
  const updFaqItem = (ci, ii, k, v) => {
    setS((s) => {
      const faqs = [...(s.faqs || [])];
      faqs[ci] = { ...faqs[ci], items: [...(faqs[ci].items || [])] };
      faqs[ci].items[ii] = { ...faqs[ci].items[ii], [k]: v };
      return { ...s, faqs };
    });
  };
  const remFaqItem = (ci, ii) => {
    setS((s) => {
      const faqs = [...(s.faqs || [])];
      faqs[ci] = {
        ...faqs[ci],
        items: faqs[ci].items.filter((_, j) => j !== ii),
      };
      return { ...s, faqs };
    });
  };
  const addFaqItem = (ci) => {
    setS((s) => {
      const faqs = [...(s.faqs || [])];
      faqs[ci] = {
        ...faqs[ci],
        items: [
          ...(faqs[ci].items || []),
          { question: "", answer: "", isActive: true },
        ],
      };
      return { ...s, faqs };
    });
  };

  const updSizeRow = (i, k, v) => {
    setS((s) => {
      const rows = [...(s.sizeGuide?.rows || [])];
      rows[i] = { ...rows[i], [k]: v };
      return { ...s, sizeGuide: { ...s.sizeGuide, rows } };
    });
  };
  const remSizeRow = (i) =>
    setS((s) => ({
      ...s,
      sizeGuide: {
        ...s.sizeGuide,
        rows: s.sizeGuide.rows.filter((_, j) => j !== i),
      },
    }));

  const updNavChild = (ni, ci, k, v) => {
    setS((s) => {
      const navLinks = [...(s.navLinks || [])];
      navLinks[ni] = {
        ...navLinks[ni],
        children: [...(navLinks[ni].children || [])],
      };
      navLinks[ni].children[ci] = { ...navLinks[ni].children[ci], [k]: v };
      return { ...s, navLinks };
    });
  };
  const remNavChild = (ni, ci) => {
    setS((s) => {
      const navLinks = [...(s.navLinks || [])];
      navLinks[ni] = {
        ...navLinks[ni],
        children: navLinks[ni].children.filter((_, j) => j !== ci),
      };
      return { ...s, navLinks };
    });
  };
  const addNavChild = (ni) => {
    setS((s) => {
      const navLinks = [...(s.navLinks || [])];
      navLinks[ni] = {
        ...navLinks[ni],
        children: [
          ...(navLinks[ni].children || []),
          { label: "", href: "", isActive: true },
        ],
      };
      return { ...s, navLinks };
    });
  };

  const updFooterCol = (ci, v) => {
    setS((s) => {
      const cols = [...(s.footerColumns || [])];
      cols[ci] = { ...cols[ci], title: v };
      return { ...s, footerColumns: cols };
    });
  };
  const updFooterLink = (ci, li, k, v) => {
    setS((s) => {
      const cols = [...(s.footerColumns || [])];
      cols[ci] = { ...cols[ci], links: [...(cols[ci].links || [])] };
      cols[ci].links[li] = { ...cols[ci].links[li], [k]: v };
      return { ...s, footerColumns: cols };
    });
  };
  const remFooterLink = (ci, li) => {
    setS((s) => {
      const cols = [...(s.footerColumns || [])];
      cols[ci] = {
        ...cols[ci],
        links: cols[ci].links.filter((_, j) => j !== li),
      };
      return { ...s, footerColumns: cols };
    });
  };
  const addFooterLink = (ci) => {
    setS((s) => {
      const cols = [...(s.footerColumns || [])];
      cols[ci] = {
        ...cols[ci],
        links: [
          ...(cols[ci].links || []),
          { label: "", href: "/", isActive: true },
        ],
      };
      return { ...s, footerColumns: cols };
    });
  };

  const updCareerJob = (i, k, v) => {
    setS((s) => {
      const jobs = [...(s.careers?.jobs || [])];
      jobs[i] = { ...jobs[i], [k]: v };
      return { ...s, careers: { ...s.careers, jobs } };
    });
  };
  const remCareerJob = (i) =>
    setS((s) => ({
      ...s,
      careers: { ...s.careers, jobs: s.careers.jobs.filter((_, j) => j !== i) },
    }));

  const updPressEntry = (i, k, v) => {
    setS((s) => {
      const entries = [...(s.press?.entries || [])];
      entries[i] = { ...entries[i], [k]: v };
      return { ...s, press: { ...s.press, entries } };
    });
  };
  const remPressEntry = (i) =>
    setS((s) => ({
      ...s,
      press: { ...s.press, entries: s.press.entries.filter((_, j) => j !== i) },
    }));

  if (loading)
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#C4622D] border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  if (!S) return null;

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Site Settings</h1>
        <p className="text-sm text-gray-500">
          Complete control over every part of your store
        </p>
      </div>

      <div className="space-y-3">
        {/* ANNOUNCEMENT */}
        <Section title="Announcement Bar" icon={Megaphone} defaultOpen>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
              Text
            </label>
            <textarea
              rows={2}
              value={S.announcement?.text || ""}
              onChange={(e) => upd("announcement", "text", e.target.value)}
              className={`${inp} resize-none`}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { k: "bgColor", l: "Background" },
              { k: "textColor", l: "Text Color" },
            ].map((f) => (
              <div key={f.k}>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  {f.l}
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={S.announcement?.[f.k] || "#000000"}
                    onChange={(e) => upd("announcement", f.k, e.target.value)}
                    className="w-10 h-10 rounded-lg border border-gray-200 p-0.5 cursor-pointer flex-shrink-0"
                  />
                  <input
                    value={S.announcement?.[f.k] || ""}
                    onChange={(e) => upd("announcement", f.k, e.target.value)}
                    className={inp}
                  />
                </div>
              </div>
            ))}
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className={tog(S.announcement?.isActive)}
              onClick={() =>
                upd("announcement", "isActive", !S.announcement?.isActive)
              }
            >
              <div className={knb(S.announcement?.isActive)} />
            </div>
            <span className="text-sm text-gray-700">Show announcement bar</span>
          </label>
          <Sv onSave={() => save("announcement")} {...sp("announcement")} />
        </Section>

        {/* BRAND */}
        <Section title="Brand & Contact" icon={Globe}>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { k: "whatsappNumber", l: "WhatsApp Number", ph: "923001234567" },
              { k: "email", l: "Email", ph: "hello@libaas-e-farda.com" },
              { k: "phone", l: "Display Phone", ph: "0300-1234567" },
              { k: "address", l: "Address", ph: "Lahore, Pakistan" },
              {
                k: "businessHours",
                l: "Business Hours",
                ph: "Mon–Sat, 10am–7pm PKT",
              },
              { k: "instagramHandle", l: "Instagram", ph: "libaasefarda" },
              { k: "facebookHandle", l: "Facebook", ph: "libaasefarda" },
              { k: "tiktokHandle", l: "TikTok", ph: "libaasefarda" },
              { k: "youtubeHandle", l: "YouTube", ph: "" },
              { k: "pinterestHandle", l: "Pinterest", ph: "" },
            ].map((f) => (
              <div key={f.k}>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  {f.l}
                </label>
                <input
                  value={S.brand?.[f.k] || ""}
                  placeholder={f.ph}
                  onChange={(e) => upd("brand", f.k, e.target.value)}
                  className={inp}
                />
              </div>
            ))}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
              WhatsApp Order Template{" "}
              <span className="font-normal text-gray-400">
                (&#123;product&#125; &#123;size&#125; &#123;color&#125;
                &#123;qty&#125; &#123;price&#125;)
              </span>
            </label>
            <textarea
              rows={5}
              value={S.brand?.whatsappOrderTemplate || ""}
              onChange={(e) =>
                upd("brand", "whatsappOrderTemplate", e.target.value)
              }
              className={`${inp} resize-none font-mono text-xs`}
            />
          </div>
          <Sv onSave={() => save("brand")} {...sp("brand")} />
        </Section>

        {/* SHIPPING */}
        <Section title="Shipping & Returns" icon={Truck}>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                k: "freeShippingThreshold",
                l: "Free Shipping Above (Rs.)",
                num: true,
              },
              { k: "standardCost", l: "Standard Rate (Rs.)", num: true },
              {
                k: "standardLabel",
                l: "Standard Label",
                ph: "Standard (3–5 days)",
              },
              { k: "expressCost", l: "Express Rate (Rs.)", num: true },
              {
                k: "expressLabel",
                l: "Express Label",
                ph: "Express (1–2 days)",
              },
              { k: "sameDayCost", l: "Same-Day Rate (Rs.)", num: true },
              { k: "sameDayCity", l: "Same-Day City", ph: "Lahore" },
              { k: "couriers", l: "Couriers", ph: "TCS, Leopards" },
            ].map((f) => (
              <div key={f.k}>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  {f.l}
                </label>
                <input
                  type={f.num ? "number" : "text"}
                  value={S.shipping?.[f.k] || ""}
                  placeholder={f.ph || ""}
                  onChange={(e) =>
                    upd(
                      "shipping",
                      f.k,
                      f.num ? Number(e.target.value) : e.target.value
                    )
                  }
                  className={inp}
                />
              </div>
            ))}
          </div>
          {["returnPolicy", "shippingPolicy"].map((k) => (
            <div key={k}>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                {k === "returnPolicy" ? "Return Policy" : "Shipping Policy"}{" "}
                Text
              </label>
              <textarea
                rows={3}
                value={S.shipping?.[k] || ""}
                onChange={(e) => upd("shipping", k, e.target.value)}
                className={`${inp} resize-none`}
              />
            </div>
          ))}
          <Sv onSave={() => save("shipping")} {...sp("shipping")} />
        </Section>

        {/* PAYMENT METHODS */}
        <Section
          title="Payment Methods"
          icon={CreditCard}
          badge={S.paymentMethods?.filter((m) => m.isActive).length}
        >
          <div className="space-y-3">
            {(S.paymentMethods || []).map((m, i) => (
              <div
                key={m.key}
                className="border border-gray-100 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-900 text-sm">
                    {m.label}
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      className={tog(m.isActive)}
                      onClick={() =>
                        updArr("paymentMethods", i, "isActive", !m.isActive)
                      }
                    >
                      <div className={knb(m.isActive)} />
                    </div>
                    <span className="text-xs text-gray-400">
                      {m.isActive ? "On" : "Off"}
                    </span>
                  </label>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">
                      Description
                    </label>
                    <input
                      value={m.description || ""}
                      onChange={(e) =>
                        updArr(
                          "paymentMethods",
                          i,
                          "description",
                          e.target.value
                        )
                      }
                      className={inp}
                    />
                  </div>
                  {m.key === "bank" && (
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">
                        Account Details
                      </label>
                      <input
                        value={m.accountDetails || ""}
                        onChange={(e) =>
                          updArr(
                            "paymentMethods",
                            i,
                            "accountDetails",
                            e.target.value
                          )
                        }
                        className={inp}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Sv
            onSave={async () => {
              setSv("paymentMethods");
              try {
                const r = await fetch(`${API}/admin/settings/payment-methods`, {
                  method: "PUT",
                  headers: hdr(),
                  body: JSON.stringify({ paymentMethods: S.paymentMethods }),
                });
                if ((await r.json()).success) mark("paymentMethods");
              } catch (e) {
                alert(e.message);
              } finally {
                setSv("");
              }
            }}
            {...sp("paymentMethods")}
          />
        </Section>

        {/* TRUST BADGES */}
        <Section
          title="Trust Badges"
          icon={Shield}
          badge={S.trustBadges?.filter((b) => b.isActive).length}
        >
          <div className="space-y-3">
            {(S.trustBadges || []).map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-3 border border-gray-100 rounded-xl p-4"
              >
                <div className="flex flex-col gap-0.5 flex-shrink-0">
                  <button
                    onClick={() => moveArr("trustBadges", i, -1)}
                    disabled={i === 0}
                    className="text-gray-300 hover:text-gray-600 disabled:opacity-20"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    onClick={() => moveArr("trustBadges", i, 1)}
                    disabled={i === (S.trustBadges || []).length - 1}
                    className="text-gray-300 hover:text-gray-600 disabled:opacity-20"
                  >
                    <ArrowDown size={12} />
                  </button>
                </div>
                <div className="flex-1 grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">
                      Title
                    </label>
                    <input
                      value={b.title || ""}
                      onChange={(e) =>
                        updArr("trustBadges", i, "title", e.target.value)
                      }
                      className={inp}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">
                      Description
                    </label>
                    <input
                      value={b.description || ""}
                      onChange={(e) =>
                        updArr("trustBadges", i, "description", e.target.value)
                      }
                      className={inp}
                    />
                  </div>
                </div>
                <div
                  onClick={() =>
                    updArr("trustBadges", i, "isActive", !b.isActive)
                  }
                  className={tog(b.isActive)}
                >
                  <div className={knb(b.isActive)} />
                </div>
              </div>
            ))}
          </div>
          <Sv onSave={() => save("trustBadges")} {...sp("trustBadges")} />
        </Section>

        {/* FAQ */}
        <Section
          title="FAQ Content"
          icon={BookOpen}
          badge={(S.faqs || []).reduce((s, c) => s + (c.items?.length || 0), 0)}
        >
          <div className="space-y-5">
            {(S.faqs || []).map((cat, ci) => (
              <div key={ci} className="border border-gray-100 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <input
                    value={cat.category || ""}
                    onChange={(e) => updFaqCategory(ci, e.target.value)}
                    className="font-semibold text-gray-900 border-0 outline-none bg-transparent text-sm flex-1"
                    placeholder="Category name..."
                  />
                  <button
                    onClick={() => remArr("faqs", ci)}
                    className="text-gray-300 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="space-y-3">
                  {(cat.items || []).map((item, ii) => (
                    <div
                      key={ii}
                      className="bg-gray-50 rounded-lg p-3 flex gap-2"
                    >
                      <div className="flex-1 space-y-2">
                        <input
                          value={item.question || ""}
                          onChange={(e) =>
                            updFaqItem(ci, ii, "question", e.target.value)
                          }
                          placeholder="Question"
                          className={`${inp} text-xs py-2`}
                        />
                        <textarea
                          rows={2}
                          value={item.answer || ""}
                          onChange={(e) =>
                            updFaqItem(ci, ii, "answer", e.target.value)
                          }
                          placeholder="Answer"
                          className={`${inp} resize-none text-xs py-2`}
                        />
                      </div>
                      <button
                        onClick={() => remFaqItem(ci, ii)}
                        className="text-gray-300 hover:text-red-500 flex-shrink-0 mt-1"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addFaqItem(ci)}
                    className="flex items-center gap-1.5 text-xs text-[#C4622D] hover:underline"
                  >
                    <Plus size={12} />
                    Add Question
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() =>
              addArr("faqs", { category: "New Category", items: [] })
            }
            className="flex items-center gap-2 text-sm text-[#C4622D] hover:underline"
          >
            <Plus size={14} />
            Add FAQ Category
          </button>
          <Sv onSave={() => save("faqs")} {...sp("faqs")} />
        </Section>

        {/* ABOUT */}
        <Section title="About Page" icon={Users}>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
              Story Title
            </label>
            <input
              value={S.about?.storyTitle || ""}
              onChange={(e) => upd("about", "storyTitle", e.target.value)}
              className={inp}
            />
          </div>
          {["storyParagraph1", "storyParagraph2", "storyParagraph3"].map(
            (k, i) => (
              <div key={k}>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Story Paragraph {i + 1}
                </label>
                <textarea
                  rows={3}
                  value={S.about?.[k] || ""}
                  onChange={(e) => upd("about", k, e.target.value)}
                  className={`${inp} resize-none`}
                />
              </div>
            )
          )}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
              Story Image URL
            </label>
            <input
              value={S.about?.storyImage || ""}
              onChange={(e) => upd("about", "storyImage", e.target.value)}
              className={inp}
            />
            {S.about?.storyImage && (
              <img
                src={S.about.storyImage}
                alt=""
                className="w-full h-24 object-cover rounded-lg mt-2"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            )}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
              Quote Text
            </label>
            <input
              value={S.about?.quoteText || ""}
              onChange={(e) => upd("about", "quoteText", e.target.value)}
              className={inp}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
              Stats
            </label>
            <div className="space-y-2">
              {(S.about?.stats || []).map((st, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={st.number || ""}
                    onChange={(e) => updAboutStats(i, "number", e.target.value)}
                    placeholder="2,000+"
                    className={`${inp} w-32`}
                  />
                  <input
                    value={st.label || ""}
                    onChange={(e) => updAboutStats(i, "label", e.target.value)}
                    placeholder="Women dressed"
                    className={inp}
                  />
                  <button
                    onClick={() => remAboutStats(i)}
                    className="text-gray-300 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() =>
                setS((s) => ({
                  ...s,
                  about: {
                    ...s.about,
                    stats: [
                      ...(s.about?.stats || []),
                      { number: "", label: "" },
                    ],
                  },
                }))
              }
              className="flex items-center gap-1.5 text-xs text-[#C4622D] hover:underline mt-2"
            >
              <Plus size={12} />
              Add Stat
            </button>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
              Values
            </label>
            <div className="space-y-3">
              {(S.about?.values || []).map((v, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex gap-2 mb-2">
                    <input
                      value={v.number || ""}
                      onChange={(e) =>
                        updAboutValues(i, "number", e.target.value)
                      }
                      placeholder="01"
                      className={`${inp} w-16`}
                    />
                    <input
                      value={v.title || ""}
                      onChange={(e) =>
                        updAboutValues(i, "title", e.target.value)
                      }
                      placeholder="Value Title"
                      className={inp}
                    />
                    <button
                      onClick={() => remAboutValues(i)}
                      className="text-gray-300 hover:text-red-500 flex-shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={v.text || ""}
                    onChange={(e) => updAboutValues(i, "text", e.target.value)}
                    placeholder="Description..."
                    className={`${inp} resize-none`}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() =>
                setS((s) => ({
                  ...s,
                  about: {
                    ...s.about,
                    values: [
                      ...(s.about?.values || []),
                      {
                        number: String(
                          (s.about?.values?.length || 0) + 1
                        ).padStart(2, "0"),
                        title: "",
                        text: "",
                      },
                    ],
                  },
                }))
              }
              className="flex items-center gap-1.5 text-xs text-[#C4622D] hover:underline mt-2"
            >
              <Plus size={12} />
              Add Value
            </button>
          </div>
          <Sv onSave={() => save("about")} {...sp("about")} />
        </Section>

        {/* SIZE GUIDE */}
        <Section title="Size Guide" icon={Tag}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                Unit
              </label>
              <select
                value={S.sizeGuide?.unit || "cm"}
                onChange={(e) => upd("sizeGuide", "unit", e.target.value)}
                className={inp}
              >
                <option value="cm">cm</option>
                <option value="inches">inches</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
              Guidance Note
            </label>
            <textarea
              rows={2}
              value={S.sizeGuide?.note || ""}
              onChange={(e) => upd("sizeGuide", "note", e.target.value)}
              className={`${inp} resize-none`}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
              Size Rows
            </label>
            <div className="overflow-x-auto">
              <table className="w-full text-sm mb-3">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-500">
                    {["Size", "Chest", "Waist", "Hips", "UK", "PK", ""].map(
                      (h) => (
                        <th key={h} className="px-2 py-2 text-left font-medium">
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {(S.sizeGuide?.rows || []).map((row, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      {[
                        "size",
                        "chest",
                        "waist",
                        "hips",
                        "ukSize",
                        "pkSize",
                      ].map((k) => (
                        <td key={k} className="px-1 py-1">
                          <input
                            value={row[k] || ""}
                            onChange={(e) => updSizeRow(i, k, e.target.value)}
                            className="border border-gray-100 rounded px-2 py-1.5 text-xs w-full outline-none focus:border-[#C4622D]"
                          />
                        </td>
                      ))}
                      <td className="px-1 py-1">
                        <button
                          onClick={() => remSizeRow(i)}
                          className="text-gray-300 hover:text-red-500"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={() =>
                setS((s) => ({
                  ...s,
                  sizeGuide: {
                    ...s.sizeGuide,
                    rows: [
                      ...(s.sizeGuide?.rows || []),
                      {
                        size: "",
                        chest: "",
                        waist: "",
                        hips: "",
                        ukSize: "",
                        pkSize: "",
                      },
                    ],
                  },
                }))
              }
              className="flex items-center gap-1.5 text-xs text-[#C4622D] hover:underline"
            >
              <Plus size={12} />
              Add Row
            </button>
          </div>
          <Sv onSave={() => save("sizeGuide")} {...sp("sizeGuide")} />
        </Section>

        {/* NAV LINKS */}
        <Section
          title="Navigation Links"
          icon={Layout}
          badge={S.navLinks?.filter((n) => n.isActive).length}
        >
          <div className="space-y-3">
            {(S.navLinks || []).map((nav, i) => (
              <div
                key={i}
                className="border border-gray-100 rounded-xl overflow-hidden"
              >
                <div className="flex items-center gap-3 p-4">
                  <div className="flex flex-col gap-0.5 flex-shrink-0">
                    <button
                      onClick={() => moveArr("navLinks", i, -1)}
                      disabled={i === 0}
                      className="text-gray-200 hover:text-gray-500 disabled:opacity-20"
                    >
                      <ArrowUp size={11} />
                    </button>
                    <button
                      onClick={() => moveArr("navLinks", i, 1)}
                      disabled={i === (S.navLinks || []).length - 1}
                      className="text-gray-200 hover:text-gray-500 disabled:opacity-20"
                    >
                      <ArrowDown size={11} />
                    </button>
                  </div>
                  <input
                    value={nav.label || ""}
                    onChange={(e) =>
                      updArr("navLinks", i, "label", e.target.value)
                    }
                    placeholder="Label"
                    className={`${inp} flex-1`}
                  />
                  <input
                    value={nav.href || ""}
                    onChange={(e) =>
                      updArr("navLinks", i, "href", e.target.value)
                    }
                    placeholder="/shop"
                    className={`${inp} flex-1`}
                  />
                  <div
                    onClick={() =>
                      updArr("navLinks", i, "isActive", !nav.isActive)
                    }
                    className={tog(nav.isActive)}
                  >
                    <div className={knb(nav.isActive)} />
                  </div>
                  <button
                    onClick={() => remArr("navLinks", i)}
                    className="text-gray-300 hover:text-red-500 flex-shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                {(nav.children || []).map((child, ci) => (
                  <div
                    key={ci}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-50 border-t border-gray-100"
                  >
                    <span className="text-gray-300 text-xs flex-shrink-0">
                      ↳
                    </span>
                    <input
                      value={child.label || ""}
                      onChange={(e) =>
                        updNavChild(i, ci, "label", e.target.value)
                      }
                      placeholder="Label"
                      className={`${inp} flex-1 text-xs py-1.5`}
                    />
                    <input
                      value={child.href || ""}
                      onChange={(e) =>
                        updNavChild(i, ci, "href", e.target.value)
                      }
                      placeholder="/shop?category=..."
                      className={`${inp} flex-1 text-xs py-1.5`}
                    />
                    <button
                      onClick={() => remNavChild(i, ci)}
                      className="text-gray-300 hover:text-red-500 flex-shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addNavChild(i)}
                  className="text-[10px] text-gray-400 hover:text-[#C4622D] px-6 py-2 flex items-center gap-1 border-t border-gray-50 w-full"
                >
                  <Plus size={10} />
                  Add dropdown item
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() =>
              addArr("navLinks", {
                label: "",
                href: "/",
                isActive: true,
                order: (S.navLinks || []).length,
                children: [],
              })
            }
            className="flex items-center gap-2 text-sm text-[#C4622D] hover:underline"
          >
            <Plus size={14} />
            Add Nav Item
          </button>
          <Sv onSave={() => save("navLinks")} {...sp("navLinks")} />
        </Section>

        {/* FOOTER */}
        <Section title="Footer Links" icon={Layout}>
          <div className="space-y-5">
            {(S.footerColumns || []).map((col, ci) => (
              <div key={ci} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <input
                    value={col.title || ""}
                    onChange={(e) => updFooterCol(ci, e.target.value)}
                    placeholder="Column title"
                    className="font-semibold text-gray-900 border-0 outline-none bg-transparent text-sm flex-1"
                  />
                  <button
                    onClick={() => remArr("footerColumns", ci)}
                    className="text-gray-300 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="space-y-2">
                  {(col.links || []).map((link, li) => (
                    <div key={li} className="flex items-center gap-2">
                      <input
                        value={link.label || ""}
                        onChange={(e) =>
                          updFooterLink(ci, li, "label", e.target.value)
                        }
                        placeholder="Label"
                        className={`${inp} flex-1 text-xs py-2`}
                      />
                      <input
                        value={link.href || ""}
                        onChange={(e) =>
                          updFooterLink(ci, li, "href", e.target.value)
                        }
                        placeholder="/page"
                        className={`${inp} flex-1 text-xs py-2`}
                      />
                      <button
                        onClick={() => remFooterLink(ci, li)}
                        className="text-gray-300 hover:text-red-500"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addFooterLink(ci)}
                    className="flex items-center gap-1.5 text-xs text-[#C4622D] hover:underline"
                  >
                    <Plus size={11} />
                    Add Link
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() =>
                addArr("footerColumns", { title: "New Column", links: [] })
              }
              className="flex items-center gap-2 text-sm text-[#C4622D] hover:underline"
            >
              <Plus size={14} />
              Add Column
            </button>
          </div>
          <Sv onSave={() => save("footerColumns")} {...sp("footerColumns")} />
        </Section>

        {/* HOME SECTIONS */}
        <Section title="Homepage Sections" icon={LayoutDashboard}>
          <p className="text-xs text-gray-400">
            Reorder and toggle homepage sections.
          </p>
          <div className="space-y-2">
            {(S.homeSections || []).map((sec, i) => (
              <div
                key={sec.key}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
              >
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveArr("homeSections", i, -1)}
                    disabled={i === 0}
                    className="text-gray-300 hover:text-gray-600 disabled:opacity-20"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    onClick={() => moveArr("homeSections", i, 1)}
                    disabled={i === (S.homeSections || []).length - 1}
                    className="text-gray-300 hover:text-gray-600 disabled:opacity-20"
                  >
                    <ArrowDown size={12} />
                  </button>
                </div>
                <span className="text-gray-400 text-sm w-5 text-center">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {sec.label}
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono">
                    {sec.key}
                  </p>
                </div>
                <div
                  onClick={() =>
                    updArr("homeSections", i, "isVisible", !sec.isVisible)
                  }
                  className={tog(sec.isVisible)}
                >
                  <div className={knb(sec.isVisible)} />
                </div>
                <span className="text-xs text-gray-400 w-12">
                  {sec.isVisible ? "Visible" : "Hidden"}
                </span>
              </div>
            ))}
          </div>
          <Sv onSave={() => save("homeSections")} {...sp("homeSections")} />
        </Section>

        {/* SEARCH TAGS */}
        <Section
          title="Search Quick Tags"
          icon={Search}
          badge={S.searchTags?.length}
        >
          <div className="space-y-2">
            {(S.searchTags || []).map((tag, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  value={tag.label || ""}
                  onChange={(e) =>
                    updArr("searchTags", i, "label", e.target.value)
                  }
                  placeholder="Label"
                  className={`${inp} flex-1`}
                />
                <input
                  value={tag.query || ""}
                  onChange={(e) =>
                    updArr("searchTags", i, "query", e.target.value)
                  }
                  placeholder="query value"
                  className={`${inp} flex-1`}
                />
                <button
                  onClick={() => remArr("searchTags", i)}
                  className="text-gray-300 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => addArr("searchTags", { label: "", query: "" })}
            className="flex items-center gap-2 text-sm text-[#C4622D] hover:underline"
          >
            <Plus size={14} />
            Add Tag
          </button>
          <Sv onSave={() => save("searchTags")} {...sp("searchTags")} />
        </Section>

        {/* CAREERS */}
        <Section
          title="Careers Page"
          icon={Users}
          badge={
            S.careers?.jobs?.filter((j) => j.isActive !== false).length || 0
          }
        >
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
              Headline
            </label>
            <textarea
              rows={2}
              value={S.careers?.headline || ""}
              onChange={(e) => upd("careers", "headline", e.target.value)}
              className={`${inp} resize-none`}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
              Jobs
            </label>
            <div className="space-y-3">
              {(S.careers?.jobs || []).map((job, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4">
                  <div className="grid sm:grid-cols-3 gap-3 mb-3">
                    {[
                      { k: "title", ph: "Job Title" },
                      { k: "type", ph: "Full-time" },
                      { k: "location", ph: "Lahore" },
                    ].map((f) => (
                      <div key={f.k}>
                        <input
                          value={job[f.k] || ""}
                          placeholder={f.ph}
                          onChange={(e) => updCareerJob(i, f.k, e.target.value)}
                          className={inp}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <textarea
                      rows={2}
                      value={job.description || ""}
                      onChange={(e) =>
                        updCareerJob(i, "description", e.target.value)
                      }
                      placeholder="Job description..."
                      className={`${inp} resize-none text-xs flex-1`}
                    />
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <div
                        onClick={() =>
                          updCareerJob(
                            i,
                            "isActive",
                            job.isActive === false ? true : false
                          )
                        }
                        className={tog(job.isActive !== false)}
                      >
                        <div className={knb(job.isActive !== false)} />
                      </div>
                      <button
                        onClick={() => remCareerJob(i)}
                        className="text-gray-300 hover:text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() =>
                setS((s) => ({
                  ...s,
                  careers: {
                    ...s.careers,
                    jobs: [
                      ...(s.careers?.jobs || []),
                      {
                        title: "",
                        type: "Full-time",
                        location: "Lahore",
                        description: "",
                        isActive: true,
                      },
                    ],
                  },
                }))
              }
              className="flex items-center gap-2 text-sm text-[#C4622D] hover:underline mt-2"
            >
              <Plus size={14} />
              Add Job
            </button>
          </div>
          <Sv onSave={() => save("careers")} {...sp("careers")} />
        </Section>

        {/* PRESS */}
        <Section
          title="Press Coverage"
          icon={BookOpen}
          badge={S.press?.entries?.length || 0}
        >
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
              Page Headline
            </label>
            <input
              value={S.press?.headline || ""}
              onChange={(e) => upd("press", "headline", e.target.value)}
              className={inp}
            />
          </div>
          <div className="space-y-3">
            {(S.press?.entries || []).map((entry, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4">
                <div className="grid sm:grid-cols-3 gap-3 mb-3">
                  {[
                    { k: "outlet", ph: "Dawn" },
                    { k: "date", ph: "March 2025" },
                    { k: "type", ph: "Feature" },
                  ].map((f) => (
                    <div key={f.k}>
                      <input
                        value={entry[f.k] || ""}
                        placeholder={f.ph}
                        onChange={(e) => updPressEntry(i, f.k, e.target.value)}
                        className={inp}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <input
                    value={entry.headline || ""}
                    onChange={(e) =>
                      updPressEntry(i, "headline", e.target.value)
                    }
                    placeholder="Article headline..."
                    className={`${inp} flex-1`}
                  />
                  <input
                    value={entry.link || ""}
                    onChange={(e) => updPressEntry(i, "link", e.target.value)}
                    placeholder="URL (optional)"
                    className={`${inp} flex-1`}
                  />
                  <button
                    onClick={() => remPressEntry(i)}
                    className="text-gray-300 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() =>
              setS((s) => ({
                ...s,
                press: {
                  ...s.press,
                  entries: [
                    ...(s.press?.entries || []),
                    {
                      outlet: "",
                      date: "",
                      headline: "",
                      type: "Feature",
                      link: "",
                      isActive: true,
                    },
                  ],
                },
              }))
            }
            className="flex items-center gap-2 text-sm text-[#C4622D] hover:underline"
          >
            <Plus size={14} />
            Add Entry
          </button>
          <Sv onSave={() => save("press")} {...sp("press")} />
        </Section>

        {/* SEO */}
        <Section title="SEO Settings" icon={Globe}>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
              Page Title
            </label>
            <input
              value={S.seo?.title || ""}
              onChange={(e) => upd("seo", "title", e.target.value)}
              className={inp}
            />
            <p className="text-xs text-gray-400 mt-1">
              {(S.seo?.title || "").length}/60
            </p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
              Meta Description
            </label>
            <textarea
              rows={2}
              value={S.seo?.description || ""}
              onChange={(e) => upd("seo", "description", e.target.value)}
              className={`${inp} resize-none`}
            />
            <p className="text-xs text-gray-400 mt-1">
              {(S.seo?.description || "").length}/160
            </p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
              Keywords
            </label>
            <input
              value={S.seo?.keywords || ""}
              onChange={(e) => upd("seo", "keywords", e.target.value)}
              className={inp}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
              OG Image URL
            </label>
            <input
              value={S.seo?.ogImage || ""}
              onChange={(e) => upd("seo", "ogImage", e.target.value)}
              className={inp}
            />
          </div>
          <Sv onSave={() => save("seo")} {...sp("seo")} />
        </Section>
      </div>
    </AdminLayout>
  );
}

export default function AdminSettings() {
  return (
    <AdminAuthProvider>
      <SettingsContent />
    </AdminAuthProvider>
  );
}
