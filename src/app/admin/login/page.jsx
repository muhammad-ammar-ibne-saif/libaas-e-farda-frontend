"use client";
import { useState } from "react";
import BrandLogo from "../../../components/ui/BrandLogo";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        }/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("lef_admin_token", data.token);
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError(
        "Cannot connect to server. Make sure the backend is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1C1C1E] flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8">
        <BrandLogo size="lg" color="#C4622D" className="justify-center mb-2" />
        <div className="text-gray-500 text-[11px] tracking-[0.3em] uppercase mt-1">
          Admin Panel
        </div>
      </div>

      <div className="w-full max-w-sm bg-[#2C2C2E] rounded-2xl p-8 shadow-2xl">
        <div className="w-12 h-12 bg-[#C4622D]/20 rounded-xl flex items-center justify-center mx-auto mb-6">
          <Lock size={20} className="text-[#C4622D]" />
        </div>
        <h1 className="text-white text-xl font-semibold text-center mb-6">
          Sign In
        </h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-[#3A3A3C] text-white border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C4622D] transition-colors"
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-[#3A3A3C] text-white border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm outline-none focus:border-[#C4622D] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C4622D] hover:bg-[#b54e22] text-white py-3 rounded-xl text-sm font-semibold tracking-widest uppercase transition-colors disabled:opacity-60 mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>

      <p className="text-gray-600 text-xs mt-8">
        {process.env.NEXT_PUBLIC_BRAND_NAME} © {new Date().getFullYear()}
      </p>
    </div>
  );
}
