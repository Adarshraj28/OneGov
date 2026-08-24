"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, Shield } from "lucide-react";
import PMModiBanner from "@/components/pm-modi-banner";

const DEMO_ACCOUNTS = [
  { email: "adarsh@citizen.gov", password: "password123", role: "Citizen", name: "Adarsh Raj" },
  { email: "priya@citizen.gov", password: "password123", role: "Citizen", name: "Priya Sharma" },
  { email: "rajesh@officer.gov", password: "password123", role: "Officer", name: "Dr. Rajesh Kulkarni" },
  { email: "admin@onegov.gov", password: "password123", role: "Admin", name: "System Administrator" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // Redirect based on role
      switch (data.user.role) {
        case "admin":
          router.push("/admin");
          break;
        case "officer":
          router.push("/officer");
          break;
        default:
          router.push("/citizen");
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const quickLogin = (account: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Tricolor top bar */}
      <div className="flex h-1.5">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          {/* Logo */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#FF9933] via-white to-[#138808] rounded-2xl p-0.5 mb-4">
              <div className="w-full h-full bg-blue-900 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              ONE<span className="text-blue-900">GOV</span>
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Government Services, Connected Around You
            </p>
            <div className="flex justify-center gap-1 mt-3">
              <span className="w-8 h-1 rounded-full bg-[#FF9933]" />
              <span className="w-8 h-1 rounded-full bg-gray-300" />
              <span className="w-8 h-1 rounded-full bg-[#138808]" />
            </div>
          </div>

          {/* PM Modi Banner */}
          <PMModiBanner variant="compact" />

          {/* Login Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Sign In
            </h2>

            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] text-sm"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] text-sm"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-[#FF9933] to-[#e88a2d] text-white rounded-lg font-medium hover:from-[#e88a2d] hover:to-[#FF9933] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>

          {/* Demo Accounts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Demo Accounts
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Click any account below to auto-fill credentials.
            </p>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  onClick={() => quickLogin(account)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-200 hover:border-[#FF9933] hover:bg-orange-50 transition-colors text-left"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {account.name}
                    </p>
                    <p className="text-xs text-gray-500">{account.email}</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {account.role}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              SIH 2026 Prototype — Government of Maharashtra
              <br />
              Smart India Hackathon Problem Statement SIH26129
            </p>
            <div className="flex justify-center gap-1 mt-2">
              <span className="w-6 h-1 rounded-full bg-[#FF9933]" />
              <span className="w-6 h-1 rounded-full bg-gray-300" />
              <span className="w-6 h-1 rounded-full bg-[#138808]" />
            </div>
          </div>
        </div>
      </div>

      {/* Tricolor bottom bar */}
      <div className="flex h-1.5">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>
    </div>
  );
}
