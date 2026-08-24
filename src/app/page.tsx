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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 bg-blue-900 rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold">OG</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          ONE<span className="text-blue-900">GOV</span>
        </h1>
        <p className="text-sm text-gray-500 mt-2">Loading...</p>
      </div>
    </div>
  );
}
