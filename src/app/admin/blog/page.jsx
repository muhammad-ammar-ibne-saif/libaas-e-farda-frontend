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
  Edit2,
  Trash2,
  X,
  Save,
  Eye,
  EyeOff,
  FileText,
  Image as ImageIcon,
  Tag,
  Bold,
  Italic,
  List,
  Link,
  Heading,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const hdr = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("lef_admin_token")}`,
});
const inp =
  "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#C4622D] transition-colors bg-white";

const emptyPost = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  category: "Style",
  tags: [],
  author: "Libaas-e-Farda",
  status: "draft",
  isFeatured: false,
  seo: { title: "", description: "" },
};

const CATEGORIES = [
  "Style",
  "Fashion",
  "Culture",
  "Behind the Scenes",
  "Care Guide",
  "Lookbook",
  "News",
];

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-");
}

// Simple rich text toolbar
function Toolbar({ textareaRef, onInsert }) {
  const wrap = (before, after, placeholder) => {
    const el = textareaRef.current;
    if (!el) return;
    const s = el.selectionStart;
    const e = el.selectionEnd;
    const sel = el.value.substring(s, e) || placeholder;
    const val =
      el.value.substring(0, s) + before + sel + after + el.value.substring(e);
    onInsert(val);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(s + before.length, s + before.length + sel.length);
    }, 0);
  };

  const tools = [
    {
      icon: Heading,
      label: "H2",
      action: () => wrap("\n## ", "\n", "Heading"),
    },
    { icon: Bold, label: "Bold", action: () => wrap("**", "**", "bold text") },
    {
      icon: Italic,
      label: "Italic",
      action: () => wrap("_", "_", "italic text"),
    },
    {
      icon: List,
      label: "List",
      action: () => wrap("\n- ", "\n", "List item"),
    },
    {
      icon: Link,
      label: "Link",
      action: () => wrap("[", "](https://)", "link text"),
    },
    {
      label: "IMG",
      action: () => wrap("![", "](https://image-url.com)", "alt text"),
    },
    {
      label: "HR",
      action: () =>
        onInsert((textareaRef.current?.value || "") + "\n\n---\n\n"),
    },
  ];

  return (
    <div className="flex gap-1 p-2 bg-gray-50 border border-b-0 border-gray-200 rounded-t-lg flex-wrap">
      {tools.map((t, i) => (
        <button
          key={i}
          type="button"
          onClick={t.action}
          title={t.label}
          className="px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-900 rounded transition-colors"
        >
          {t.icon ? <t.icon size={13} /> : t.label}
        </button>
      ))}
      <span className="text-xs text-gray-400 ml-auto self-center">
        Markdown supported
      </span>
    </div>
  );
}

// Convert markdown to HTML for preview/storage
function markdownToHtml(md) {
  if (!md) return "";
  return md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    .replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1"/>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
    .replace(/^---$/gm, "<hr/>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[h|u|l|i|p])/gm, "<p>")
    .replace(/(?<![>])$/gm, "</p>")
    .replace(/<p><\/p>/g, "")
    .replace(/<p>(<[huli])/g, "$1")
    .replace(/(<\/[huli][^>]*>)<\/p>/g, "$1");
}

function PostEditor({ post, onClose, onSave }) {
  const [form, setForm] = useState(
    post ? { ...emptyPost, ...post, tags: post.tags || [] } : { ...emptyPost }
  );
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState("content");
  const textareaRef = useRef(null);

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const updSeo = (k, v) =>
    setForm((f) => ({ ...f, seo: { ...f.seo, [k]: v } }));

  // Auto-generate slug from title
  const handleTitleChange = (v) => {
    upd("title", v);
    if (!post) upd("slug", slugify(v));
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) upd("tags", [...form.tags, t]);
    setTagInput("");
  };

  const save = async (status) => {
    if (!form.title.trim()) return setError("Title is required");
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        status: status || form.status,
        content: markdownToHtml(form.content),
        contentRaw: form.content,
      };
      const url = post ? `${API}/admin/blog/${post._id}` : `${API}/admin/blog`;
      const method = post ? "PUT" : "POST";
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

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 flex-shrink-0">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
        >
          <X size={16} /> Close
        </button>
        <h2 className="font-bold text-gray-900 text-sm flex-1">
          {post ? "Edit Post" : "New Blog Post"}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs hover:bg-gray-50"
          >
            {preview ? <EyeOff size={13} /> : <Eye size={13} />}{" "}
            {preview ? "Edit" : "Preview"}
          </button>
          <button
            onClick={() => save("draft")}
            disabled={saving}
            className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs hover:bg-gray-50 disabled:opacity-60"
          >
            Save Draft
          </button>
          <button
            onClick={() => save("published")}
            disabled={saving}
            className="flex items-center gap-1.5 bg-[#C4622D] hover:bg-[#b54e22] text-white px-5 py-2 rounded-lg text-xs font-medium disabled:opacity-60"
          >
            <Eye size={13} /> {saving ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-b border-red-200 text-red-600 text-xs px-6 py-2">
          {error}
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Main editor */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-8 space-y-5">
            {/* Title */}
            <input
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Post title..."
              className="w-full text-3xl font-display font-light text-gray-900 border-0 outline-none bg-transparent placeholder-gray-300"
            />

            {/* Slug */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>URL: /blog/</span>
              <input
                value={form.slug}
                onChange={(e) => upd("slug", e.target.value)}
                className="border-b border-gray-200 outline-none text-gray-600 font-mono bg-transparent flex-1"
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-gray-200">
              {["content", "excerpt", "cover", "seo"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2 text-xs font-medium capitalize transition-colors ${
                    tab === t
                      ? "text-[#C4622D] border-b-2 border-[#C4622D]"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {tab === "content" &&
              (preview ? (
                <div
                  className="prose prose-sm max-w-none font-body text-gray-800 leading-relaxed min-h-64 border border-gray-100 rounded-xl p-6 bg-white"
                  dangerouslySetInnerHTML={{
                    __html:
                      markdownToHtml(form.content) ||
                      '<p class="text-gray-300">Nothing to preview yet...</p>',
                  }}
                />
              ) : (
                <div>
                  <Toolbar
                    textareaRef={textareaRef}
                    onInsert={(v) => upd("content", v)}
                  />
                  <textarea
                    ref={textareaRef}
                    value={form.content}
                    onChange={(e) => upd("content", e.target.value)}
                    placeholder="Write your post in Markdown...&#10;&#10;## Section Heading&#10;&#10;Your paragraph text here. **Bold** and _italic_ supported.&#10;&#10;- List item one&#10;- List item two"
                    className="w-full min-h-[500px] border border-gray-200 rounded-b-lg px-4 py-4 text-sm font-mono text-gray-700 outline-none focus:border-[#C4622D] resize-none leading-relaxed"
                  />
                </div>
              ))}

            {tab === "excerpt" && (
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                  Excerpt / Summary
                </label>
                <textarea
                  rows={4}
                  value={form.excerpt}
                  onChange={(e) => upd("excerpt", e.target.value)}
                  placeholder="A short summary shown on the blog listing page..."
                  className={`${inp} resize-none`}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {form.excerpt.length}/200 chars
                </p>
              </div>
            )}

            {tab === "cover" && (
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                  Cover Image URL
                </label>
                <input
                  value={form.coverImage}
                  onChange={(e) => upd("coverImage", e.target.value)}
                  placeholder="https://..."
                  className={inp}
                />
                {form.coverImage && (
                  <img
                    src={form.coverImage}
                    alt=""
                    className="w-full h-48 object-cover rounded-xl mt-3"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
              </div>
            )}

            {tab === "seo" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                    SEO Title
                  </label>
                  <input
                    value={form.seo?.title || ""}
                    onChange={(e) => updSeo("title", e.target.value)}
                    placeholder="Defaults to post title"
                    className={inp}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {(form.seo?.title || "").length}/60
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                    SEO Description
                  </label>
                  <textarea
                    rows={3}
                    value={form.seo?.description || ""}
                    onChange={(e) => updSeo("description", e.target.value)}
                    placeholder="Defaults to excerpt"
                    className={`${inp} resize-none`}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {(form.seo?.description || "").length}/160
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-72 bg-white border-l border-gray-200 p-5 overflow-y-auto flex-shrink-0 space-y-5">
          {/* Status */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => upd("status", e.target.value)}
              className={inp}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => upd("category", e.target.value)}
              className={inp}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Author */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
              Author
            </label>
            <input
              value={form.author}
              onChange={(e) => upd("author", e.target.value)}
              className={inp}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                placeholder="Add tag + Enter"
                className={`${inp} flex-1 py-2 text-xs`}
              />
              <button
                onClick={addTag}
                type="button"
                className="px-3 bg-gray-100 rounded-lg text-xs hover:bg-gray-200"
              >
                <Plus size={12} />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {form.tags.map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1 bg-gray-100 text-gray-600 text-[10px] px-2 py-1 rounded-full"
                >
                  {t}
                  <button
                    onClick={() =>
                      upd(
                        "tags",
                        form.tags.filter((x) => x !== t)
                      )
                    }
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Featured */}
          <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-xl">
            <div
              onClick={() => upd("isFeatured", !form.isFeatured)}
              className={`w-10 h-5 rounded-full transition-colors relative ${
                form.isFeatured ? "bg-[#C4622D]" : "bg-gray-200"
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  form.isFeatured ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-800">
                Featured Post
              </p>
              <p className="text-[10px] text-gray-400">
                Show prominently on blog page
              </p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

function BlogContent() {
  const { admin, loading: authLoading } = useAdminAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !admin) router.push("/admin/login");
  }, [admin, authLoading]);
  useEffect(() => {
    if (admin) loadPosts();
  }, [admin, filter]);

  const loadPosts = async () => {
    setLoading(true);
    const params = filter !== "all" ? `status=${filter}` : "";
    const data = await fetch(`${API}/admin/blog?${params}&limit=50`, {
      headers: hdr(),
    }).then((r) => r.json());
    setPosts(data.posts || []);
    setLoading(false);
  };

  const deletePost = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return;
    await fetch(`${API}/admin/blog/${id}`, {
      method: "DELETE",
      headers: hdr(),
    });
    loadPosts();
  };

  const togglePublish = async (post) => {
    const newStatus = post.status === "published" ? "draft" : "published";
    await fetch(`${API}/admin/blog/${post._id}`, {
      method: "PUT",
      headers: hdr(),
      body: JSON.stringify({ ...post, status: newStatus }),
    });
    loadPosts();
  };

  const filtered = posts.filter(
    (p) => !search || p.title.toLowerCase().includes(search.toLowerCase())
  );
  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.filter((p) => p.status === "draft").length;

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Blog</h1>
          <p className="text-sm text-gray-500">
            {published} published · {drafts} drafts
          </p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 bg-[#C4622D] hover:bg-[#b54e22] text-white px-4 py-2.5 rounded-lg text-sm font-medium"
        >
          <Plus size={16} /> New Post
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="w-full pl-4 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C4622D]"
          />
        </div>
        {["all", "published", "draft"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              filter === f
                ? "bg-[#C4622D] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-7 h-7 border-2 border-[#C4622D] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-20 text-center">
          <FileText size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium mb-1">No posts yet</p>
          <p className="text-gray-400 text-sm mb-5">
            Share your brand story and style tips with your customers
          </p>
          <button
            onClick={() => setAdding(true)}
            className="bg-[#C4622D] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#b54e22]"
          >
            Write First Post
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                {["Post", "Category", "Author", "Status", "Date", ""].map(
                  (h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((post) => (
                <tr
                  key={post._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {post.coverImage ? (
                        <img
                          src={post.coverImage}
                          alt=""
                          className="w-10 h-10 object-cover rounded flex-shrink-0"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                          <FileText size={14} className="text-gray-300" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">
                          {post.title}
                        </p>
                        <p className="text-xs text-gray-400 font-mono">
                          /blog/{post.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {post.category}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {post.author}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePublish(post)}
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                        post.status === "published"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {post.status === "published" ? "Published" : "Draft"}
                    </button>
                    {post.isFeatured && (
                      <span className="ml-1 text-[10px] bg-[#C4622D]/10 text-[#C4622D] px-2 py-0.5 rounded-full font-semibold">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString("en-PK", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditing(post)}
                        className="p-1.5 text-gray-400 hover:text-[#C4622D] transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => deletePost(post._id, post.title)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {adding && (
        <PostEditor onClose={() => setAdding(false)} onSave={loadPosts} />
      )}
      {editing && (
        <PostEditor
          post={editing}
          onClose={() => setEditing(null)}
          onSave={loadPosts}
        />
      )}
    </AdminLayout>
  );
}

export default function AdminBlog() {
  return (
    <AdminAuthProvider>
      <BlogContent />
    </AdminAuthProvider>
  );
}
