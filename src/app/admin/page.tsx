"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import PMModiBanner from "@/components/pm-modi-banner";
import {
  Users,
  FileText,
  Building2,
  Activity,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";

interface Stats {
  overview: {
    totalUsers: number;
    totalCitizens: number;
    totalOfficers: number;
    totalJourneys: number;
    completedJourneys: number;
    inProgressJourneys: number;
    blockedJourneys: number;
    createdJourneys: number;
    totalServices: number;
    totalDepartments: number;
    totalIntegrations: number;
    failedIntegrations: number;
    successRate: number;
    recoveredAutomatically: number;
  };
  integrationHealth: {
    department: string;
    status: string;
    latency: number;
    totalRequests: number;
    failedRequests: number;
  }[];
  bottlenecks: {
    serviceName: string;
    department: string;
    pendingCount: number;
    avgRetries: number;
  }[];
  recentActivity: {
    id: string;
    action: string;
    resource: string;
    createdAt: string;
    user: { name: string } | null;
  }[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const { t } = useLanguage();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user || data.user.role !== "admin") {
          router.push("/login");
        }
      })
      .catch(() => router.push("/login"));

    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => setStats(data))
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

  if (!stats) return null;

  const o = stats.overview;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PMModiBanner variant="compact" />

        <div className="flex items-center justify-between mb-6 mt-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t.adminDashboard} 🇮🇳
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {t.adminSubtitle}
            </p>
          </div>
          <span className="text-xs bg-[#FF9933]/10 text-[#FF9933] border border-[#FF9933]/20 px-3 py-1 rounded-full font-medium">
            🇮🇳 {t.simulationMetrics}
          </span>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF9933]/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#FF9933]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {o.totalJourneys.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{t.totalJourneys}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#138808]/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#138808]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {o.completedJourneys.toLocaleString()}
                </p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {o.inProgressJourneys.toLocaleString()}
                </p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {o.blockedJourneys.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{t.blocked}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{o.totalUsers}</p>
                <p className="text-xs text-gray-500">{t.totalUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-50 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {o.totalDepartments}
                </p>
                <p className="text-xs text-gray-500">{t.departments}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#138808]/10 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#138808]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {o.successRate}%
                </p>
                <p className="text-xs text-gray-500">{t.successRate}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF9933]/10 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#FF9933]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {o.recoveredAutomatically}
                </p>
                <p className="text-xs text-gray-500">{t.autoRecovered}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Integration Health */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              🏛️ {t.integrationHealth}
            </h2>
            <div className="space-y-3">
              {stats.integrationHealth.map((h) => (
                <div
                  key={h.department}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        h.status === "online"
                          ? "bg-[#138808]"
                          : h.status === "degraded"
                            ? "bg-[#FF9933]"
                            : "bg-red-500"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {h.department.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
                      </p>
                      <p className="text-xs text-gray-500">
                        {h.totalRequests} requests • {h.latency}ms avg
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      h.status === "online"
                        ? "bg-[#138808]/10 text-[#138808]"
                        : h.status === "degraded"
                          ? "bg-[#FF9933]/10 text-[#FF9933]"
                          : "bg-red-50 text-red-700"
                    }`}
                  >
                    {h.status.charAt(0).toUpperCase() + h.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottlenecks */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              ⚠️ {t.bottleneckAnalysis}
            </h2>
            {stats.bottlenecks.length === 0 ? (
              <p className="text-sm text-gray-500">{t.noBottlenecks}</p>
            ) : (
              <div className="space-y-3">
                {stats.bottlenecks.map((b, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {b.serviceName}
                        </p>
                        <p className="text-xs text-gray-500">{b.department}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[#FF9933]">
                          {b.pendingCount} pending
                        </p>
                        {b.avgRetries > 0 && (
                          <p className="text-xs text-gray-500">
                            Avg retries: {b.avgRetries.toFixed(1)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              📊 {t.recentActivity}
            </h2>
            <div className="space-y-2">
              {stats.recentActivity.slice(0, 10).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#FF9933]" />
                    <div>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">
                          {log.user?.name || "System"}
                        </span>{" "}
                        — {log.action.replace(/\./g, " ")}
                      </p>
                      <p className="text-xs text-gray-400">
                        {log.resource}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(log.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Banner */}
        <div className="mt-8 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 rounded-xl p-4 text-center">
          <div className="flex justify-center gap-1 mb-2">
            <span className="w-8 h-1 rounded-full bg-[#FF9933]" />
            <span className="w-8 h-1 rounded-full bg-white" />
            <span className="w-8 h-1 rounded-full bg-[#138808]" />
          </div>
          <p className="text-white text-sm font-medium">
            🇮🇳 {t.digitalIndiaFooter}
          </p>
        </div>
      </main>
    </div>
  );
}
