"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Eye,
  Tag,
  Share2,
  Twitter,
  Facebook,
} from "lucide-react";
import { fetchBlogPost, fetchBlogPosts } from "../../../lib/api";

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      try {
        const data = await fetchBlogPost(slug);
        if (!data.success || !data.post) {
          setNotFound(true);
          return;
        }
        setPost(data.post);
        // Load related posts same category
        const rel = await fetchBlogPosts(`limit=3&status=published`);
        if (rel.success)
          setRelated(
            (rel.posts || []).filter((p) => p.slug !== slug).slice(0, 3)
          );
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const share = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(post?.title || "");
    if (platform === "twitter")
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`);
    if (platform === "facebook")
      window.open(`https://facebook.com/sharer/sharer.php?u=${url}`);
    if (platform === "whatsapp")
      window.open(`https://wa.me/?text=${text}%20${url}`);
    if (platform === "copy") {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-terracotta-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (notFound || !post)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 px-6 text-center">
        <p className="font-display text-4xl text-charcoal">Post not found</p>
        <Link href="/blog" className="btn-primary">
          Back to Journal
        </Link>
      </div>
    );

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      {/* Back */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 font-body text-xs text-charcoal-light hover:text-terracotta-500 transition-colors mb-10"
      >
        <ArrowLeft size={13} /> Back to Journal
      </Link>

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <span className="font-body text-xs tracking-widest uppercase text-terracotta-500 font-medium">
            {post.category}
          </span>
          {post.isFeatured && (
            <span className="font-body text-[10px] bg-terracotta-50 text-terracotta-500 px-2 py-0.5 rounded-full font-semibold">
              Featured
            </span>
          )}
        </div>
        <h1 className="font-display text-4xl md:text-5xl text-charcoal font-light leading-tight mb-6">
          {post.title}
        </h1>
        <div className="flex items-center gap-5 font-body text-xs text-charcoal-light flex-wrap">
          <span className="flex items-center gap-1.5">
            <Calendar size={12} />
            {new Date(post.createdAt).toLocaleDateString("en-PK", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye size={12} /> {post.views || 0} views
          </span>
          <span>By {post.author}</span>
        </div>
        {post.tags?.length > 0 && (
          <div className="flex gap-2 mt-4 flex-wrap">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 font-body text-[10px] bg-ivory-200 text-charcoal-light px-2.5 py-1 rounded-full"
              >
                <Tag size={9} /> {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Cover image */}
      {post.coverImage && (
        <div className="aspect-[16/7] overflow-hidden mb-10">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Excerpt */}
      {post.excerpt && (
        <p className="font-body text-base text-charcoal leading-relaxed mb-8 pl-5 border-l-4 border-terracotta-500 italic">
          {post.excerpt}
        </p>
      )}

      {/* Content — renders HTML from blog editor */}
      <div
        className="prose prose-sm max-w-none font-body text-charcoal leading-relaxed
          prose-headings:font-display prose-headings:font-light prose-headings:text-charcoal
          prose-h2:text-2xl prose-h3:text-xl
          prose-a:text-terracotta-500 prose-a:no-underline hover:prose-a:underline
          prose-strong:font-semibold prose-strong:text-charcoal
          prose-img:rounded prose-img:w-full
          prose-ul:list-disc prose-li:text-sm
          prose-blockquote:border-terracotta-500 prose-blockquote:italic prose-blockquote:text-charcoal-light"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Share */}
      <div className="mt-12 pt-8 border-t border-ivory-200">
        <p className="font-body text-xs tracking-widest uppercase text-charcoal-light mb-4">
          Share This Article
        </p>
        <div className="flex gap-3 flex-wrap">
          {[
            {
              platform: "whatsapp",
              label: "WhatsApp",
              bg: "#25D366",
              color: "#fff",
            },
            {
              platform: "twitter",
              label: "Twitter/X",
              bg: "#000",
              color: "#fff",
            },
            {
              platform: "facebook",
              label: "Facebook",
              bg: "#1877f2",
              color: "#fff",
            },
            {
              platform: "copy",
              label: "Copy Link",
              bg: "#f0ece4",
              color: "#2D2D2D",
            },
          ].map((s) => (
            <button
              key={s.platform}
              onClick={() => share(s.platform)}
              className="flex items-center gap-2 px-4 py-2.5 rounded font-body text-xs font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: s.bg, color: s.color }}
            >
              <Share2 size={12} /> {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16 pt-12 border-t border-ivory-200">
          <h2 className="font-display text-2xl text-charcoal mb-8">
            More from the Journal
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {related.map((p) => (
              <Link key={p._id} href={`/blog/${p.slug}`} className="group">
                {p.coverImage && (
                  <div className="aspect-[4/3] overflow-hidden mb-3">
                    <img
                      src={p.coverImage}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <span className="font-body text-[10px] tracking-widest uppercase text-terracotta-500">
                  {p.category}
                </span>
                <h3 className="font-display text-base text-charcoal font-light leading-snug mt-1 group-hover:text-terracotta-500 transition-colors">
                  {p.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
