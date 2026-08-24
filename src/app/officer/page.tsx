"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import PMModiBanner from "@/components/pm-modi-banner";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
  Loader2,
  Users,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";

interface Journey {
  id: string;
  intent: string;
  status: string;
  progress: number;
  createdAt: string;
  user: { name: string; email: string };
  steps: { status: string; service: { name: string; department: string } }[];
}

export default function OfficerDashboard() {
  const router = useRouter();
  const { t } = useLanguage();
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    blocked: 0,
  });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user || data.user.role === "citizen") {
          router.push("/login");
        }
      })
      .catch(() => router.push("/login"));

    fetch("/api/journeys")
      .then((r) => r.json())
      .then((data) => {
        const j = data.journeys || [];
        setJourneys(j.slice(0, 20));
        setStats({
          total: j.length,
          completed: j.filter((x: Journey) => x.status === "completed").length,
          inProgress: j.filter((x: Journey) => x.status === "in_progress").length,
          blocked: j.filter((x: Journey) => x.status === "failed").length,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 text-[#FF9933] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PMModiBanner variant="compact" />

        <h1 className="text-2xl font-bold text-gray-900 mb-2 mt-6">
          {t.officerDashboard} 🇮🇳
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {t.officerSubtitle}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF9933]/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#FF9933]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500">{t.totalApplications}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#138808]/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#138808]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                <p className="text-xs text-gray-500">{t.completed}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF9933]/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#FF9933]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                <p className="text-xs text-gray-500">{t.inProgress}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.blocked}</p>
                <p className="text-xs text-gray-500">{t.blocked}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {t.recentApplications}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t.citizenLabel}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t.request}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t.services}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t.progress}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t.status}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {journeys.map((j) => (
                  <tr key={j.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {j.user?.name || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{j.intent}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(j.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">
                        {j.steps?.length || 0} {t.servicesCount}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-[#FF9933] to-[#138808] h-2 rounded-full"
                            style={{ width: `${j.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{j.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          j.status === "completed"
                            ? "bg-[#138808]/10 text-[#138808]"
                            : j.status === "in_progress"
                              ? "bg-[#FF9933]/10 text-[#FF9933]"
                              : j.status === "failed"
                                ? "bg-red-50 text-red-700"
                                : "bg-gray-50 text-gray-700"
                        }`}
                      >
                        {j.status.replace(/_/g, " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
