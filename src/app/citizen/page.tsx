"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import {
  ArrowRight,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building2,
  Landmark,
  Utensils,
  Flame,
  Receipt,
  Search,
} from "lucide-react";

const PROCESSING_STEPS = [
  "Understanding your request...",
  "Analyzing intent and location...",
  "Discovering required government services...",
  "Checking service dependencies...",
  "Building your unified service journey...",
  "Preparing service timeline...",
];

interface Journey {
  id: string;
  intent: string;
  status: string;
  progress: number;
  createdAt: string;
  steps: { status: string }[];
}

export default function CitizenHome() {
  const router = useRouter();
  const [request, setRequest] = useState("");
  const [processing, setProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);
  const [processDone, setProcessDone] = useState<number[]>([]);
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, pending: 0 });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user) router.push("/login");
      })
      .catch(() => router.push("/login"));

    fetch("/api/journeys")
      .then((r) => r.json())
      .then((data) => {
        const j = data.journeys || [];
        setJourneys(j.slice(0, 5));
        setStats({
          total: j.length,
          completed: j.filter((x: Journey) => x.status === "completed").length,
          inProgress: j.filter((x: Journey) => x.status === "in_progress").length,
          pending: j.filter((x: Journey) => x.status === "created").length,
        });
      })
      .catch(() => {});
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request.trim()) return;

    setProcessing(true);
    setProcessStep(0);
    setProcessDone([]);

    // Simulate processing steps
    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      setProcessStep(i);
      setProcessDone((prev) => prev.slice(0, i));
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
    }
    setProcessDone(PROCESSING_STEPS.map((_, i) => i));

    // Actually create the journey
    try {
      const res = await fetch("/api/journeys/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent: request }),
      });

      const data = await res.json();
      if (data.success) {
        setTimeout(() => {
          router.push(`/citizen/journey/${data.journey.id}`);
        }, 800);
      }
    } catch {
      setProcessing(false);
    }
  };

  const quickRequests = [
    "I want to open a restaurant in Pune",
    "I want to start a business in Mumbai",
    "I need to register a property",
    "I want to apply for a government scheme",
  ];

  const statusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Government services, connected around you.
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tell us what you need. ONEGOV discovers the required services and
            guides you through one unified journey.
          </p>
        </div>

        {/* AI Request Box */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                What do you want to do?
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={request}
                    onChange={(e) => setRequest(e.target.value)}
                    placeholder='e.g., "I want to open a restaurant in Pune"'
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={processing}
                  />
                </div>
                <button
                  type="submit"
                  disabled={processing || !request.trim()}
                  className="px-6 py-3 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {processing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">
                    {processing ? "Processing..." : "Discover"}
                  </span>
                </button>
              </div>

              {/* Quick suggestions */}
              {!processing && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {quickRequests.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setRequest(q)}
                      className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </form>

          {/* Processing Animation */}
          {processing && (
            <div className="mt-4 bg-white rounded-xl border border-gray-200 p-6">
              <div className="space-y-3">
                {PROCESSING_STEPS.map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {processDone.includes(i) ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    ) : processStep === i ? (
                      <Loader2 className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-200 shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        processDone.includes(i)
                          ? "text-green-700"
                          : processStep === i
                            ? "text-blue-700 font-medium"
                            : "text-gray-400"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500">Total Journeys</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                <p className="text-xs text-gray-500">In Progress</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Journeys */}
        {journeys.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Service Journeys
              </h2>
              <button
                onClick={() => router.push("/citizen/journey")}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View All →
              </button>
            </div>
            <div className="space-y-3">
              {journeys.map((journey) => (
                <button
                  key={journey.id}
                  onClick={() => router.push(`/citizen/journey/${journey.id}`)}
                  className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    {statusIcon(journey.status)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {journey.intent}
                      </p>
                      <p className="text-xs text-gray-500">
                        {journey.steps?.length || 0} services •{" "}
                        {new Date(journey.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${journey.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-10 text-right">
                      {journey.progress}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Service Categories */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Integrated Government Services
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: Building2, name: "Business Registration", dept: "MCA", color: "blue" },
              { icon: Receipt, name: "Tax Registration", dept: "ITD", color: "purple" },
              { icon: Utensils, name: "Food License", dept: "FSSAI", color: "green" },
              { icon: Landmark, name: "Municipal Services", dept: "Municipal", color: "cyan" },
              { icon: Flame, name: "Fire Safety", dept: "Fire Dept", color: "red" },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.name}
                  className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-md transition-shadow"
                >
                  <div
                    className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center bg-${cat.color}-50`}
                  >
                    <Icon className={`w-6 h-6 text-${cat.color}-600`} />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{cat.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{cat.dept}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
