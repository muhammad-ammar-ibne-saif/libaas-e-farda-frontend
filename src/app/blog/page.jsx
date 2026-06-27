"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchBlogPosts } from "../../lib/api";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts("limit=12&status=published")
      .then((d) => {
        if (d.success) setPosts(d.posts || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-terracotta-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-14">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-terracotta-500 mb-3">
          Stories & Style
        </p>
        <h1 className="section-title">The Farda Journal</h1>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-display text-3xl text-charcoal mb-3">
            No posts yet
          </p>
          <p className="font-body text-sm text-charcoal-light">
            Check back soon for style guides and brand stories.
          </p>
        </div>
      ) : (
        <>
          {/* Featured */}
          {posts[0] && (
            <Link
              href={`/blog/${posts[0].slug}`}
              className="grid md:grid-cols-2 gap-8 mb-16 group cursor-pointer"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={
                    posts[0].coverImage ||
                    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80"
                  }
                  alt={posts[0].title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-body text-xs tracking-widest uppercase text-terracotta-500 mb-3">
                  {posts[0].category}
                </span>
                <h2 className="font-display text-3xl md:text-4xl text-charcoal font-light leading-tight mb-4">
                  {posts[0].title}
                </h2>
                <p className="font-body text-sm text-charcoal-light leading-relaxed mb-6">
                  {posts[0].excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-body text-xs text-charcoal-light">
                    {new Date(posts[0].createdAt).toLocaleDateString("en-PK", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase text-charcoal hover:text-terracotta-500 transition-colors border-b border-charcoal pb-0.5">
                    Read More <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Grid */}
          {posts.length > 1 && (
            <div className="grid md:grid-cols-3 gap-8">
              {posts.slice(1).map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[4/3] overflow-hidden mb-4">
                    <img
                      src={
                        post.coverImage ||
                        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80"
                      }
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <span className="font-body text-xs tracking-widest uppercase text-terracotta-500 mb-2 block">
                    {post.category}
                  </span>
                  <h3 className="font-display text-xl text-charcoal font-light leading-snug mb-3 group-hover:text-terracotta-500 transition-colors">
                    {post.title}
                  </h3>
                  <p className="font-body text-xs text-charcoal-light leading-relaxed mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <span className="font-body text-xs text-charcoal-light">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
