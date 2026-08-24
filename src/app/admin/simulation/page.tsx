"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import {
  Power,
  PowerOff,
  RefreshCw,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Play,
  SkipForward,
} from "lucide-react";

interface ServiceHealth {
  department: string;
  status: string;
  latency: number;
  totalRequests: number;
  failedRequests: number;
  uptimePercent: number;
}

export default function SimulationPage() {
  const router = useRouter();
  const [health, setHealth] = useState<ServiceHealth[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

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

  const toggleService = async (department: string, currentStatus: string) => {
    setToggling(department);
    const newStatus = currentStatus === "online" ? "offline" : "online";
    try {
      await fetch("/api/integrations/health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ department, status: newStatus }),
      });
      await fetchHealth();
    } catch {
    } finally {
      setToggling(null);
    }
  };

  const DEMO_STEPS = [
    { title: "The Problem", desc: "6 Government Services, 5 Departments, Multiple Portals" },
    { title: "Citizen Request", desc: "I want to open a restaurant in Pune" },
    { title: "AI Discovery", desc: "Intent detected → 6 services found → Dependencies resolved" },
    { title: "Unified Journey", desc: "Service journey created with dependency-aware workflow" },
    { title: "Interoperability", desc: "Requests traveling through Integration Gateway" },
    { title: "Failure Simulation", desc: "Service goes offline → Retry → Recovery" },
    { title: "Impact", desc: "Before ONEGOV vs With ONEGOV" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Simulation Controls
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Control external service availability for demonstration
            </p>
          </div>
        </div>

        {/* Service Status Grid */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            External Service Status
          </h2>
          <div className="space-y-3">
            {health.map((h) => (
              <div
                key={h.department}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
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
                      Latency: {h.latency}ms • Requests: {h.totalRequests} •
                      Failed: {h.failedRequests}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      h.status === "online"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {h.status === "online" ? "ONLINE" : "OFFLINE"}
                  </span>
                  <button
                    onClick={() => toggleService(h.department, h.status)}
                    disabled={toggling === h.department}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      h.status === "online"
                        ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                        : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                    } disabled:opacity-50`}
                  >
                    {toggling === h.department ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : h.status === "online" ? (
                      "Take Offline"
                    ) : (
                      "Bring Online"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SIH Demo Mode */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">SIH Demo Mode</h2>
              <p className="text-sm text-blue-200 mt-1">
                Guided 5-minute demonstration for judges
              </p>
            </div>
            <button
              onClick={() => {
                setDemoMode(!demoMode);
                setDemoStep(0);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-900 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              {demoMode ? (
                <>
                  <SkipForward className="w-4 h-4" />
                  Exit Demo
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start SIH Demo
                </>
              )}
            </button>
          </div>

          {demoMode && (
            <div className="space-y-3">
              {DEMO_STEPS.map((step, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    i === demoStep
                      ? "bg-white/20"
                      : i < demoStep
                        ? "bg-white/10"
                        : "bg-white/5"
                  }`}
                >
                  {i < demoStep ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  ) : i === demoStep ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-white/30 shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-xs text-blue-200">{step.desc}</p>
                  </div>
                </div>
              ))}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setDemoStep(Math.max(0, demoStep - 1))}
                  disabled={demoStep === 0}
                  className="px-3 py-1.5 bg-white/10 rounded text-sm disabled:opacity-30"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setDemoStep(
                      Math.min(DEMO_STEPS.length - 1, demoStep + 1)
                    )
                  }
                  disabled={demoStep === DEMO_STEPS.length - 1}
                  className="px-3 py-1.5 bg-white/20 rounded text-sm disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <button
            onClick={async () => {
              for (const h of health) {
                if (h.status !== "online") {
                  await toggleService(h.department, h.status);
                }
              }
            }}
            className="p-4 bg-white rounded-xl border border-gray-200 text-left hover:border-blue-300 transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-blue-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">
              Restore All Services
            </p>
            <p className="text-xs text-gray-500">
              Bring all services back online
            </p>
          </button>

          <button
            onClick={async () => {
              for (const h of health) {
                if (h.status === "online") {
                  await toggleService(h.department, h.status);
                }
              }
            }}
            className="p-4 bg-white rounded-xl border border-gray-200 text-left hover:border-red-300 transition-colors"
          >
            <PowerOff className="w-5 h-5 text-red-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">
              Offline All Services
            </p>
            <p className="text-xs text-gray-500">
              Simulate total system failure
            </p>
          </button>

          <button
            onClick={async () => {
              const halfIdx = Math.floor(health.length / 2);
              for (let i = 0; i < health.length; i++) {
                if (i >= halfIdx && health[i].status === "online") {
                  await toggleService(health[i].department, health[i].status);
                }
              }
            }}
            className="p-4 bg-white rounded-xl border border-gray-200 text-left hover:border-amber-300 transition-colors"
          >
            <AlertTriangle className="w-5 h-5 text-amber-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">
              Partial Outage
            </p>
            <p className="text-xs text-gray-500">
              Take half of services offline
            </p>
          </button>
        </div>
      </main>
    </div>
  );
}
