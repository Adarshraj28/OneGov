"use client";

import { useState } from "react";
import Header from "@/components/header";
import GovFooter from "@/components/gov-footer";
import { Search, FileText, CheckCircle2, Clock, AlertCircle, ExternalLink, Loader2 } from "lucide-react";

// Mock reference data for demo
const MOCK_REFERENCES: Record<string, {
  intent: string;
  status: string;
  createdAt: string;
  steps: {
    name: string;
    status: string;
    department: string;
    externalId?: string;
    completedAt?: string;
  }[];
}> = {
  "BR-2026-MH-10291": {
    intent: "Business Registration — Restaurant Setup",
    status: "completed",
    createdAt: "2026-08-10T10:00:00Z",
    steps: [
      { name: "Business Registration (MCA)", status: "completed", department: "Ministry of Corporate Affairs", externalId: "BR-2026-10291", completedAt: "2026-08-14" },
      { name: "GST Registration", status: "completed", department: "Income Tax Department", externalId: "GST-2026-50421", completedAt: "2026-08-16" },
      { name: "FSSAI Food License", status: "completed", department: "FSSAI", externalId: "FSS-2026-88234", completedAt: "2026-08-20" },
      { name: "Municipal Permission", status: "completed", department: "Municipal Corporation", completedAt: "2026-08-22" },
      { name: "Fire Safety NOC", status: "completed", department: "Fire Department", completedAt: "2026-08-24" },
    ],
  },
  "GS-2026-MH-20418": {
    intent: "Business Registration — Trading Company",
    status: "in_progress",
    createdAt: "2026-08-15T14:30:00Z",
    steps: [
      { name: "Business Registration (MCA)", status: "completed", department: "Ministry of Corporate Affairs", externalId: "BR-2026-20418", completedAt: "2026-08-18" },
      { name: "GST Registration", status: "in_progress", department: "Income Tax Department" },
      { name: "Municipal Permission", status: "waiting", department: "Municipal Corporation" },
    ],
  },
  "PP-2026-MH-30192": {
    intent: "Passport Application",
    status: "in_progress",
    createdAt: "2026-08-20T11:00:00Z",
    steps: [
      { name: "Document Verification", status: "completed", department: "Passport Seva (MEA)", completedAt: "2026-08-21" },
      { name: "Passport Application", status: "in_progress", department: "Passport Seva (MEA)", externalId: "PP-2026-30192" },
      { name: "Police Verification", status: "waiting", department: "Local Police" },
    ],
  },
};

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
    completed: { bg: "bg-green-50 border-green-200", text: "text-green-700", icon: CheckCircle2 },
    in_progress: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", icon: Clock },
    waiting: { bg: "bg-gray-50 border-gray-200", text: "text-gray-500", icon: Clock },
    pending: { bg: "bg-gray-50 border-gray-200", text: "text-gray-500", icon: Clock },
    rejected: { bg: "bg-red-50 border-red-200", text: "text-red-700", icon: AlertCircle },
  };
  const s = styles[status] || styles.pending;
  const Icon = s.icon;
  const labels: Record<string, string> = {
    completed: "Completed ✅",
    in_progress: "In Progress ⏳",
    waiting: "Waiting",
    pending: "Not Started",
    rejected: "Action Required ❌",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${s.bg} ${s.text}`}>
      <Icon className="w-3 h-3" />
      {labels[status] || status}
    </span>
  );
}

export default function TrackPage() {
  const [referenceId, setReferenceId] = useState("");
  const [result, setResult] = useState<typeof MOCK_REFERENCES[string] | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceId.trim()) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const found = MOCK_REFERENCES[referenceId.trim().toUpperCase()];
      setResult(found || null);
      setSearched(true);
      setLoading(false);
    }, 800);
  };

  const completedSteps = result?.steps.filter((s) => s.status === "completed").length || 0;
  const totalSteps = result?.steps.length || 0;
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Track Your Application</h1>
          <p className="text-sm text-gray-500 mt-1">अपने आवेदन की स्थिति जानें — Enter your reference ID to check status</p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
                placeholder="Enter Reference ID (e.g., BR-2026-MH-10291)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Track
            </button>
          </form>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-[10px] text-gray-400">Try:</span>
            {Object.keys(MOCK_REFERENCES).map((ref) => (
              <button
                key={ref}
                onClick={() => { setReferenceId(ref); setSearched(false); setResult(null); }}
                className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-colors"
              >
                {ref}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {searched && !result && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-700 font-medium">No Application Found</p>
            <p className="text-sm text-gray-500 mt-1">
              We couldn&apos;t find an application with reference ID &quot;{referenceId}&quot;.
              Please check the ID and try again.
            </p>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            {/* Application Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{result.intent}</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Reference: <span className="font-mono font-medium text-gray-700">{referenceId}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Submitted: {new Date(result.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
                <StatusBadge status={result.status} />
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>{completedSteps} of {totalSteps} steps completed</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${progress === 100 ? "bg-green-500" : "bg-[#FF9933]"}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Steps Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Application Timeline</h3>
              <div className="space-y-4">
                {result.steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    {/* Timeline dot */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        step.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : step.status === "in_progress"
                            ? "bg-amber-100 text-amber-600"
                            : "bg-gray-100 text-gray-400"
                      }`}>
                        {step.status === "completed" ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : step.status === "in_progress" ? (
                          <Clock className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-medium">{i + 1}</span>
                        )}
                      </div>
                      {i < result.steps.length - 1 && (
                        <div className={`w-0.5 h-8 ${step.status === "completed" ? "bg-green-200" : "bg-gray-200"}`} />
                      )}
                    </div>
                    {/* Content */}
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{step.name}</p>
                        <StatusBadge status={step.status} />
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{step.department}</p>
                      {step.externalId && (
                        <p className="text-xs text-gray-500 mt-1">
                          Application ID: <span className="font-mono text-gray-700">{step.externalId}</span>
                        </p>
                      )}
                      {step.completedAt && (
                        <p className="text-xs text-green-600 mt-0.5">
                          ✅ Completed on {step.completedAt}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Portal Link */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                For the most up-to-date status, you can also check directly on the official government portal.
              </p>
              <a
                href="https://www.india.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-blue-700 hover:underline"
              >
                Continue to Official Portal <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Demo Notice */}
        <div className="mt-8 bg-[#FF9933]/5 border border-[#FF9933]/20 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-700">
            <strong>🧪 Demo Mode:</strong> This is a prototype demonstration for SIH 26129.
            In production, reference IDs would be validated against live government databases.
          </p>
        </div>
      </main>
      <GovFooter />
    </div>
  );
}
