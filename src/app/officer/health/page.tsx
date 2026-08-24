"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import { Activity, Loader2, Clock, Zap, AlertTriangle } from "lucide-react";

interface Health {
  department: string;
  status: string;
  latency: number;
  totalRequests: number;
  failedRequests: number;
  uptimePercent: number;
}

export default function OfficerHealthPage() {
  const [health, setHealth] = useState<Health[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchHealth = async () => {
    try {
      const res = await fetch("/api/integrations/health");
      const data = await res.json();
      setHealth(data.health || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const totalRequests = health.reduce((a, h) => a + h.totalRequests, 0);
  const totalFailed = health.reduce((a, h) => a + h.failedRequests, 0);
  const avgLatency = health.length
    ? Math.round(health.reduce((a, h) => a + h.latency, 0) / health.length)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">System Health</h1>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <Activity className="w-5 h-5 text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalRequests.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Total Requests</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <AlertTriangle className="w-5 h-5 text-amber-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalFailed}</p>
            <p className="text-xs text-gray-500">Failed Requests</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <Clock className="w-5 h-5 text-green-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{avgLatency}ms</p>
            <p className="text-xs text-gray-500">Avg Latency</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <Zap className="w-5 h-5 text-purple-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {totalRequests > 0
                ? (((totalRequests - totalFailed) / totalRequests) * 100).toFixed(1)
                : "100.0"}
              %
            </p>
            <p className="text-xs text-gray-500">Success Rate</p>
          </div>
        </div>

        {/* Service Health */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Integration Health Status
            </h2>
            <div className="space-y-3">
              {health.map((h) => (
                <div key={h.department} className="p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          h.status === "online"
                            ? "bg-green-500"
                            : h.status === "degraded"
                              ? "bg-amber-500"
                              : "bg-red-500"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {h.department.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())} API
                        </p>
                        <p className="text-xs text-gray-500">
                          Latency: {h.latency}ms • Requests: {h.totalRequests.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        h.status === "online"
                          ? "bg-green-50 text-green-700"
                          : h.status === "degraded"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                      }`}
                    >
                      {h.status.toUpperCase()}
                    </span>
                  </div>
                  {/* Error bar */}
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        h.failedRequests > 0 ? "bg-red-400" : "bg-green-500"
                      }`}
                      style={{
                        width: `${
                          h.totalRequests > 0
                            ? ((h.totalRequests - h.failedRequests) / h.totalRequests) * 100
                            : 100
                        }%`,
                      }}
                    />
                  </div>
                  {h.failedRequests > 0 && (
                    <p className="text-xs text-red-600 mt-1">
                      {h.failedRequests} failed requests ({(
                        (h.failedRequests / h.totalRequests) *
                        100
                      ).toFixed(1)}% error rate)
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
