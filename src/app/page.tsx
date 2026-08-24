"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
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
        } else {
          router.push("/login");
        }
      })
      .catch(() => router.push("/login"));
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {/* Tricolor top bar */}
      <div className="fixed top-0 left-0 right-0 flex h-1.5">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-[#FF9933] via-white to-[#138808] rounded-2xl p-0.5 mx-auto mb-4">
          <div className="w-full h-full bg-blue-900 rounded-2xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">OG</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          ONE<span className="text-[#FF9933]">GOV</span>
        </h1>
        <p className="text-sm text-gray-500 mt-2">Government Services, Connected Around You</p>
        <div className="flex justify-center gap-1 mt-4">
          <span className="w-6 h-1 rounded-full bg-[#FF9933] animate-pulse" />
          <span className="w-6 h-1 rounded-full bg-gray-300 animate-pulse" style={{ animationDelay: "0.2s" }} />
          <span className="w-6 h-1 rounded-full bg-[#138808] animate-pulse" style={{ animationDelay: "0.4s" }} />
        </div>
        <p className="text-xs text-gray-400 mt-3">🇮🇳 Digital India Initiative</p>
      </div>

      {/* Tricolor bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 flex h-1.5">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>
    </div>
  );
}
