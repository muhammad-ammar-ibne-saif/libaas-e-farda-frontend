"use client";
import { useState, useEffect } from "react";
import { Star, ThumbsUp, MessageSquare, Send } from "lucide-react";
import { fetchReviews, submitReview } from "../../lib/api";

const inp =
  "w-full border border-ivory-300 focus:border-charcoal bg-ivory-50 px-4 py-3 text-sm font-body text-charcoal outline-none transition-colors";

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={22}
            className={`transition-colors ${
              n <= (hover || value)
                ? "text-terracotta-400 fill-terracotta-400"
                : "text-ivory-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    rating: 0,
    title: "",
    comment: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!productId) return;
    fetchReviews(productId)
      .then((d) => {
        if (d.success) {
          setReviews(d.reviews || []);
          setAverage(d.average || 0);
          setTotal(d.total || 0);
        }
      })
      .finally(() => setLoading(false));
  }, [productId]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim()) e.email = "Required";
    if (!form.rating) e.rating = "Please select a rating";
    if (!form.comment.trim()) e.comment = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const data = await submitReview({ ...form, productId });
      if (data.success) {
        setSubmitted(true);
        setShowForm(false);
        setForm({ name: "", email: "", rating: 0, title: "", comment: "" });
      } else {
        alert(data.message || "Could not submit review");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const ratingBars = [5, 4, 3, 2, 1].map((n) => ({
    n,
    count: reviews.filter((r) => r.rating === n).length,
    pct: total
      ? Math.round((reviews.filter((r) => r.rating === n).length / total) * 100)
      : 0,
  }));

  if (loading)
    return (
      <div className="py-10 text-center">
        <div className="w-6 h-6 border-2 border-terracotta-400 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );

  return (
    <div className="mt-16 pt-12 border-t border-ivory-200">
      <h2 className="section-title mb-10">Customer Reviews</h2>

      {/* Summary */}
      {total > 0 && (
        <div className="grid md:grid-cols-3 gap-10 mb-12 pb-10 border-b border-ivory-200">
          {/* Average score */}
          <div className="text-center">
            <div className="font-display text-6xl text-charcoal">
              {average.toFixed(1)}
            </div>
            <div className="flex justify-center gap-0.5 my-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  size={16}
                  className={
                    n <= Math.round(average)
                      ? "text-terracotta-400 fill-terracotta-400"
                      : "text-ivory-200"
                  }
                />
              ))}
            </div>
            <p className="font-body text-xs text-charcoal-light">
              Based on {total} review{total !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Rating bars */}
          <div className="md:col-span-2 space-y-2">
            {ratingBars.map(({ n, count, pct }) => (
              <div key={n} className="flex items-center gap-3">
                <div className="flex gap-0.5 flex-shrink-0">
                  {[...Array(n)].map((_, i) => (
                    <Star
                      key={i}
                      size={11}
                      className="text-terracotta-400 fill-terracotta-400"
                    />
                  ))}
                </div>
                <div className="flex-1 h-2 bg-ivory-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-terracotta-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="font-body text-xs text-charcoal-light w-6 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Write review button */}
      {!showForm && !submitted && (
        <div className="mb-10">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 btn-primary"
          >
            <MessageSquare size={14} /> Write a Review
          </button>
        </div>
      )}

      {/* Success message */}
      {submitted && (
        <div className="mb-8 bg-sage-50 border border-sage-200 px-5 py-4">
          <p className="font-body text-sm text-sage-600 font-medium">
            ✓ Review submitted!
          </p>
          <p className="font-body text-xs text-sage-500 mt-0.5">
            Your review will appear after admin approval.
          </p>
        </div>
      )}

      {/* Review form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-12 bg-ivory-50 border border-ivory-200 p-6 md:p-8 space-y-5"
        >
          <h3 className="font-display text-2xl text-charcoal">
            Share Your Experience
          </h3>

          <div>
            <label className="block text-xs font-body tracking-wider text-charcoal-light mb-2">
              Your Rating *
            </label>
            <StarPicker
              value={form.rating}
              onChange={(v) => setForm((f) => ({ ...f, rating: v }))}
            />
            {errors.rating && (
              <p className="text-terracotta-500 text-xs mt-1">
                {errors.rating}
              </p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-body tracking-wider text-charcoal-light mb-1.5">
                Name *
              </label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Ayesha Raza"
                className={inp}
              />
              {errors.name && (
                <p className="text-terracotta-500 text-xs mt-1">
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-body tracking-wider text-charcoal-light mb-1.5">
                Email *{" "}
                <span className="text-charcoal-light/50">(not published)</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                placeholder="you@example.com"
                className={inp}
              />
              {errors.email && (
                <p className="text-terracotta-500 text-xs mt-1">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-body tracking-wider text-charcoal-light mb-1.5">
              Review Title{" "}
              <span className="text-charcoal-light/50">(optional)</span>
            </label>
            <input
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="Great quality, perfect fit"
              className={inp}
            />
          </div>

          <div>
            <label className="block text-xs font-body tracking-wider text-charcoal-light mb-1.5">
              Your Review *
            </label>
            <textarea
              value={form.comment}
              onChange={(e) =>
                setForm((f) => ({ ...f, comment: e.target.value }))
              }
              rows={4}
              placeholder="Tell us about the fit, quality, and how you styled it..."
              className={`${inp} resize-none`}
            />
            {errors.comment && (
              <p className="text-terracotta-500 text-xs mt-1">
                {errors.comment}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 btn-primary disabled:opacity-60"
            >
              <Send size={13} />{" "}
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn-outline px-5 py-3 text-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews list */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="pb-6 border-b border-ivory-200 last:border-0"
            >
              <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-body text-sm font-semibold text-charcoal">
                      {review.name}
                    </span>
                    {review.isVerified && (
                      <span className="font-body text-[10px] bg-sage-100 text-sage-600 px-2 py-0.5 rounded-full font-medium">
                        ✓ Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        size={13}
                        className={
                          n <= review.rating
                            ? "text-terracotta-400 fill-terracotta-400"
                            : "text-ivory-200"
                        }
                      />
                    ))}
                  </div>
                </div>
                <p className="font-body text-xs text-charcoal-light">
                  {new Date(review.createdAt).toLocaleDateString("en-PK", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              {review.title && (
                <p className="font-body text-sm font-semibold text-charcoal mb-2">
                  {review.title}
                </p>
              )}
              <p className="font-body text-sm text-charcoal leading-relaxed">
                {review.comment}
              </p>

              {/* Admin reply */}
              {review.adminReply && (
                <div className="mt-4 bg-terracotta-50 border border-terracotta-200 rounded p-4">
                  <p className="font-body text-xs font-semibold text-terracotta-600 mb-1">
                    Response from Libaas-e-Farda
                  </p>
                  <p className="font-body text-sm text-charcoal">
                    {review.adminReply}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Star size={32} className="text-ivory-300 mx-auto mb-3" />
          <p className="font-display text-2xl text-charcoal mb-2">
            No reviews yet
          </p>
          <p className="font-body text-sm text-charcoal-light">
            Be the first to review this piece.
          </p>
        </div>
      )}
    </div>
  );
}
