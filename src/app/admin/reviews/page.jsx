"use client";
import { useEffect, useState } from "react";
import {
  AdminAuthProvider,
  useAdminAuth,
} from "../../../components/admin/AdminAuthProvider";
import AdminLayout from "../../../components/admin/AdminLayout";
import { useRouter } from "next/navigation";
import {
  Star,
  Check,
  Trash2,
  MessageSquare,
  X,
  Clock,
  CheckCircle,
  Megaphone,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const h = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("lef_admin_token")}`,
});

function ReplyModal({ review, onClose, onSave }) {
  const [reply, setReply] = useState(review.adminReply || "");
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    await fetch(`${API}/admin/reviews/${review._id}/reply`, {
      method: "PATCH",
      headers: h(),
      body: JSON.stringify({ reply }),
    });
    setSaving(false);
    onSave();
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900">Reply to Review</h3>
          <button onClick={onClose}>
            <X size={18} className="text-gray-400" />
          </button>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex gap-0.5 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={
                  i < review.rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-200"
                }
              />
            ))}
          </div>
          <p className="text-sm font-medium text-gray-700">{review.name}</p>
          <p className="text-sm text-gray-500 mt-1 italic">
            "{review.comment}"
          </p>
        </div>
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={4}
          placeholder="Write your response as Libaas-e-Farda..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#C4622D] resize-none mb-3"
        />
        <div className="flex gap-3">
          <button
            onClick={save}
            disabled={saving}
            className="flex-1 bg-[#C4622D] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#b54e22] disabled:opacity-60"
          >
            {saving ? "Saving..." : "Post Reply"}
          </button>
          <button
            onClick={onClose}
            className="px-5 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function ReviewsContent() {
  const { admin, loading: authLoading } = useAdminAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [total, setTotal] = useState(0);
  const [replying, setReplying] = useState(null);
  const [publishing, setPublishing] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !admin) router.push("/admin/login");
  }, [admin, authLoading]);

  const fetchReviews = async () => {
    setLoading(true);
    const data = await fetch(`${API}/admin/reviews?status=${filter}&limit=50`, {
      headers: h(),
    }).then((r) => r.json());
    setReviews(data.reviews || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  useEffect(() => {
    if (admin) fetchReviews();
  }, [admin, filter]);

  const approve = async (id) => {
    await fetch(`${API}/admin/reviews/${id}/approve`, {
      method: "PATCH",
      headers: h(),
    });
    fetchReviews();
  };

  const reject = async (id) => {
    if (!confirm("Reject and delete this review?")) return;
    await fetch(`${API}/admin/reviews/${id}`, {
      method: "DELETE",
      headers: h(),
    });
    fetchReviews();
  };

  const publishTestimonial = async (review) => {
    setPublishing(review._id);
    try {
      const res = await fetch(
        `${API}/admin/reviews/${review._id}/publish-testimonial`,
        { method: "POST", headers: h() }
      );
      const data = await res.json();
      alert(data.message || "Published!");
    } catch (e) {
      alert(e.message);
    } finally {
      setPublishing("");
    }
  };

  const FILTERS = [
    { k: "pending", l: "Pending", color: "bg-yellow-100 text-yellow-700" },
    { k: "approved", l: "Approved", color: "bg-green-100 text-green-700" },
    { k: "all", l: "All", color: "bg-gray-100 text-gray-600" },
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Reviews</h1>
        <p className="text-sm text-gray-500">
          Moderate customer reviews before they appear on the website
        </p>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 mb-5 text-xs text-blue-700 flex items-start gap-2">
        <Megaphone size={14} className="flex-shrink-0 mt-0.5" />
        <span>
          <strong>Workflow:</strong> Customer submits review → appears here as
          Pending → you Approve → shows on product page. You can also{" "}
          <strong>Publish as Testimonial</strong> to feature it in the homepage
          slider.
        </span>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f.k}
            onClick={() => setFilter(f.k)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              filter === f.k
                ? f.color + " ring-2 ring-offset-1 ring-[#C4622D]"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {f.l} {filter === f.k && total > 0 && `(${total})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-7 h-7 border-2 border-[#C4622D] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-20 text-center">
          <CheckCircle size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No {filter} reviews</p>
          <p className="text-gray-400 text-sm mt-1">
            {filter === "pending"
              ? "All reviews are moderated."
              : "No reviews in this category."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className={`bg-white rounded-xl border shadow-sm p-5 ${
                !review.isApproved ? "border-yellow-200" : "border-gray-100"
              }`}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-gray-900">
                      {review.name}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        review.isApproved
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {review.isApproved ? "✓ Approved" : "⏳ Pending"}
                    </span>
                    {review.isVerified && (
                      <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-semibold">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={
                          i < review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-200"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">
                    {review.product?.name && (
                      <span className="font-medium text-gray-600">
                        {review.product.name} ·{" "}
                      </span>
                    )}
                    {new Date(review.createdAt).toLocaleDateString("en-PK", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {/* Approve / already approved */}
                  {!review.isApproved ? (
                    <button
                      onClick={() => approve(review._id)}
                      className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors"
                    >
                      <Check size={13} /> Approve & Publish
                    </button>
                  ) : (
                    <button
                      onClick={() => publishTestimonial(review)}
                      disabled={publishing === review._id}
                      className="flex items-center gap-1.5 bg-[#C4622D] hover:bg-[#b54e22] text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-60"
                    >
                      <Megaphone size={13} />{" "}
                      {publishing === review._id
                        ? "Publishing..."
                        : "Add to Homepage Slider"}
                    </button>
                  )}
                  <button
                    onClick={() => setReplying(review)}
                    className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:border-[#C4622D] hover:text-[#C4622D] px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                  >
                    <MessageSquare size={13} />{" "}
                    {review.adminReply ? "Edit Reply" : "Reply"}
                  </button>
                  <button
                    onClick={() => reject(review._id)}
                    className="flex items-center gap-1.5 border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>

              {review.title && (
                <p className="font-semibold text-gray-800 text-sm mb-1">
                  {review.title}
                </p>
              )}
              <p className="text-sm text-gray-600 leading-relaxed">
                {review.comment}
              </p>

              {review.adminReply && (
                <div className="mt-3 bg-[#C4622D]/5 border border-[#C4622D]/20 rounded-lg px-4 py-3">
                  <p className="text-[10px] font-semibold text-[#C4622D] mb-1">
                    Your Reply
                  </p>
                  <p className="text-xs text-gray-600">{review.adminReply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {replying && (
        <ReplyModal
          review={replying}
          onClose={() => setReplying(null)}
          onSave={fetchReviews}
        />
      )}
    </AdminLayout>
  );
}

export default function AdminReviews() {
  return (
    <AdminAuthProvider>
      <ReviewsContent />
    </AdminAuthProvider>
  );
}
