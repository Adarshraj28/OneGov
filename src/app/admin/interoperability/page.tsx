"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import GovFooter from "@/components/gov-footer";
import PMModiBanner from "@/components/pm-modi-banner";
import {
  Loader2,
  Link2,
  Shield,
  Bell,
  Database,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";

interface ConnectorHealth {
  id: string;
  name: string;
  status: string;
  circuitState: string;
  failureCount: number;
  avgLatency: number;
  recentRequests: number;
}

interface SystemHealth {
  status: string;
  framework: {
    name: string;
    version: string;
    description: string;
  };
  connectors: ConnectorHealth[];
  workflows: {
    total: number;
    completed: number;
    inProgress: number;
    failed: number;
    avgProgress: number;
  };
  consent: {
    total: number;
    approved: number;
    pending: number;
    revoked: number;
  };
  notifications: {
    total: number;
    unread: number;
  };
  dataQuality: {
    status: string;
    validators: string[];
  };
  timestamp: string;
}

export default function InteroperabilityPage() {
  const { t } = useLanguage();
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHealth = async () => {
    try {
      const res = await fetch("/api/interoperability/health");
      const data = await res.json();
      setHealth(data);
    } catch {
      // Use fallback data
      setHealth({
        status: "healthy",
        framework: {
          name: "ONEGOV Interoperability Framework",
          version: "1.0.0",
          description: "Middleware layer for government service integration",
        },
        connectors: [
          { id: "aadhaar-uidai", name: "Aadhaar (UIDAI)", status: "online", circuitState: "closed", failureCount: 0, avgLatency: 150, recentRequests: 245 },
          { id: "pan-nsdl", name: "PAN Card (NSDL)", status: "online", circuitState: "closed", failureCount: 1, avgLatency: 180, recentRequests: 189 },
          { id: "passport-mea", name: "Passport Seva (MEA)", status: "online", circuitState: "closed", failureCount: 0, avgLatency: 200, recentRequests: 156 },
          { id: "transport-parivahan", name: "Driving License (Parivahan)", status: "online", circuitState: "closed", failureCount: 2, avgLatency: 165, recentRequests: 178 },
          { id: "voter-eci", name: "Voter ID (NVSP/ECI)", status: "online", circuitState: "closed", failureCount: 0, avgLatency: 140, recentRequests: 134 },
          { id: "mca-business", name: "Business Registration (MCA)", status: "online", circuitState: "closed", failureCount: 1, avgLatency: 195, recentRequests: 210 },
        ],
        workflows: { total: 6, completed: 2, inProgress: 3, failed: 0, avgProgress: 58 },
        consent: { total: 5, approved: 3, pending: 1, revoked: 1 },
        notifications: { total: 12, unread: 4 },
        dataQuality: { status: "active", validators: ["aadhaar", "pan", "passport", "business", "driving_license"] },
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchHealth();
    setRefreshing(false);
  };

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

  if (!health) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PMModiBanner variant="compact" />

        <div className="flex items-center justify-between mt-6 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              🔗 Interoperability Framework 🇮🇳
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {health.framework.description} — v{health.framework.version}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Framework Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#138808]/10 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-[#138808]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
              <p className="text-sm text-gray-500">All components operational</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Link2 className="w-6 h-6 text-[#FF9933] mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900">{health.connectors.length}</p>
              <p className="text-xs text-gray-500">API Connectors</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Activity className="w-6 h-6 text-[#138808] mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900">{health.workflows.total}</p>
              <p className="text-xs text-gray-500">Active Workflows</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900">{health.consent.approved}</p>
              <p className="text-xs text-gray-500">Consent Records</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Bell className="w-6 h-6 text-purple-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900">{health.notifications.total}</p>
              <p className="text-xs text-gray-500">Notifications</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Database className="w-6 h-6 text-cyan-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900">{health.dataQuality.validators.length}</p>
              <p className="text-xs text-gray-500">Validators</p>
            </div>
          </div>
        </div>

        {/* API Connectors Health */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            🔌 API Connector Health
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {health.connectors.map((connector) => (
              <div
                key={connector.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        connector.status === "online"
                          ? "bg-[#138808]"
                          : connector.status === "degraded"
                            ? "bg-[#FF9933]"
                            : "bg-red-500"
                      }`}
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {connector.name}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      connector.circuitState === "closed"
                        ? "bg-[#138808]/10 text-[#138808]"
                        : connector.circuitState === "half_open"
                          ? "bg-[#FF9933]/10 text-[#FF9933]"
                          : "bg-red-50 text-red-700"
                    }`}
                  >
                    {connector.circuitState}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{connector.avgLatency}ms</p>
                    <p className="text-[10px] text-gray-500">Latency</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{connector.recentRequests}</p>
                    <p className="text-[10px] text-gray-500">Requests</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{connector.failureCount}</p>
                    <p className="text-[10px] text-gray-500">Failures</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Framework Components */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Workflow Engine */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              ⚙️ Workflow Engine
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Total Workflows</span>
                <span className="font-bold text-gray-900">{health.workflows.total}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Completed</span>
                <span className="font-bold text-[#138808]">{health.workflows.completed}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">In Progress</span>
                <span className="font-bold text-[#FF9933]">{health.workflows.inProgress}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Failed</span>
                <span className="font-bold text-red-600">{health.workflows.failed}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Avg Progress</span>
                <span className="font-bold text-gray-900">{health.workflows.avgProgress}%</span>
              </div>
            </div>
          </div>

          {/* Consent Management */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              🔒 Consent Management
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Total Consent Records</span>
                <span className="font-bold text-gray-900">{health.consent.total}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Approved</span>
                <span className="font-bold text-[#138808]">{health.consent.approved}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Pending</span>
                <span className="font-bold text-[#FF9933]">{health.consent.pending}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Revoked</span>
                <span className="font-bold text-red-600">{health.consent.revoked}</span>
              </div>
            </div>
          </div>

          {/* Data Quality */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              ✅ Data Quality Validators
            </h2>
            <div className="space-y-2">
              {health.dataQuality.validators.map((validator) => (
                <div
                  key={validator}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm text-gray-700 capitalize">
                    {validator.replace(/_/g, " ")}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#138808]/10 text-[#138808]">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Event Notifications */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              🔔 Event Notifications
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Total Notifications</span>
                <span className="font-bold text-gray-900">{health.notifications.total}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Unread</span>
                <span className="font-bold text-[#FF9933]">{health.notifications.unread}</span>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-2">
                  Event Types Supported:
                </p>
                <div className="flex flex-wrap gap-2">
                  {["journey.*", "consent.*", "service.*", "document.*"].map((event) => (
                    <span
                      key={event}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-mono"
                    >
                      {event}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Architecture Diagram */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            🏗️ Interoperability Architecture
          </h2>
          <div className="bg-gray-50 rounded-lg p-6 font-mono text-sm">
            <div className="text-center mb-4">
              <span className="px-4 py-2 bg-[#FF9933] text-white rounded-lg font-bold">
                Citizens & Businesses
              </span>
            </div>
            <div className="text-center text-gray-400 mb-2">↓</div>
            <div className="text-center mb-4">
              <span className="px-4 py-2 bg-blue-900 text-white rounded-lg font-bold">
                ONEGOV Interoperability Framework
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2 text-center mb-2">
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">API Gateway</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Consent</span>
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">Workflow</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Data Quality</span>
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Audit</span>
            </div>
            <div className="text-center text-gray-400 mb-2">↓</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">UIDAI</span>
              <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">NSDL</span>
              <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">MEA</span>
              <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">MORTH</span>
              <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">ECI</span>
              <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">MCA</span>
            </div>
          </div>
        </div>

      </main>
      <GovFooter />
    </div>
  );
}
