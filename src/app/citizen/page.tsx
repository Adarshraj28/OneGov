"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import PMModiBanner from "@/components/pm-modi-banner";
import {
  ArrowRight,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
  Fingerprint,
  CreditCard,
  BookOpen,
  Car,
  Vote,
  Baby,
  IndianRupee,
  Home,
  UtensilsCrossed,
  ScrollText,
} from "lucide-react";
import { OFFICIAL_GOV_SERVICES } from "@/lib/mock-data";
import { useLanguage } from "@/lib/language-context";

interface Journey {
  id: string;
  intent: string;
  status: string;
  progress: number;
  createdAt: string;
  steps: { status: string }[];
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Fingerprint,
  CreditCard,
  BookOpen,
  Car,
  Vote,
  Baby,
  IndianRupee,
  Home,
  UtensilsCrossed,
  ScrollText,
};

export default function CitizenHome() {
  const router = useRouter();
  const { t } = useLanguage();
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

    for (let i = 0; i < t.processSteps.length; i++) {
      setProcessStep(i);
      setProcessDone((prev) => prev.slice(0, i));
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
    }
    setProcessDone(t.processSteps.map((_, i) => i));

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

  const statusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-[#138808]" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-[#FF9933]" />;
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
        {/* PM Modi Hero Banner */}
        <PMModiBanner variant="hero" />

        {/* Hero Section */}
        <div className="text-center mt-10 mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            {t.heroTitle}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.heroSubtitle}
          </p>
          <div className="flex justify-center gap-1 mt-4">
            <span className="w-8 h-1 rounded-full bg-[#FF9933]" />
            <span className="w-8 h-1 rounded-full bg-gray-300" />
            <span className="w-8 h-1 rounded-full bg-[#138808]" />
          </div>
        </div>

        {/* AI Request Box */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {t.whatToDo}
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={request}
                    onChange={(e) => setRequest(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933]"
                    disabled={processing}
                  />
                </div>
                <button
                  type="submit"
                  disabled={processing || !request.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-[#FF9933] to-[#e88a2d] text-white rounded-lg font-medium hover:from-[#e88a2d] hover:to-[#FF9933] transition-all disabled:opacity-50 flex items-center gap-2 shadow-md"
                >
                  {processing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">
                    {processing ? t.processing : t.discover}
                  </span>
                </button>
              </div>

              {!processing && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {t.quickRequests.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setRequest(q)}
                      className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full hover:bg-[#FF9933]/10 hover:text-[#FF9933] transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </form>

          {processing && (
            <div className="mt-4 bg-white rounded-xl border border-gray-200 p-6">
              <div className="space-y-3">
                {t.processSteps.map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {processDone.includes(i) ? (
                      <CheckCircle2 className="w-5 h-5 text-[#138808] shrink-0" />
                    ) : processStep === i ? (
                      <Loader2 className="w-5 h-5 text-[#FF9933] animate-spin shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-200 shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        processDone.includes(i)
                          ? "text-[#138808]"
                          : processStep === i
                            ? "text-[#FF9933] font-medium"
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
              <div className="w-10 h-10 bg-[#FF9933]/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#FF9933]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
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
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                <p className="text-xs text-gray-500">{t.pending}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Journeys */}
        {journeys.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {t.recentJourneys}
              </h2>
              <button
                onClick={() => router.push("/citizen/journey")}
                className="text-sm text-[#FF9933] hover:text-[#e88a2d] font-medium"
              >
                {t.viewAll} →
              </button>
            </div>
            <div className="space-y-3">
              {journeys.map((journey) => (
                <button
                  key={journey.id}
                  onClick={() => router.push(`/citizen/journey/${journey.id}`)}
                  className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-[#FF9933] hover:bg-[#FF9933]/5 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    {statusIcon(journey.status)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {journey.intent}
                      </p>
                      <p className="text-xs text-gray-500">
                        {journey.steps?.length || 0} {t.servicesCount} •{" "}
                        {new Date(journey.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#FF9933] to-[#138808] h-2 rounded-full transition-all"
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

        {/* Official Government Services Grid */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {t.officialGovServices}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {t.govServicesSubtitle}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {OFFICIAL_GOV_SERVICES.map((service) => {
              const Icon = ICON_MAP[service.icon] || FileText;
              return (
                <div
                  key={service.name}
                  className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-md hover:border-[#FF9933]/50 transition-all cursor-pointer group"
                >
                  <div
                    className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center bg-${service.color}-50 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-6 h-6 text-${service.color}-600`} />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{service.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{service.department}</p>
                  <p className="text-[10px] text-gray-400 mt-2 leading-tight">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Government of India Footer Banner */}
        <div className="mt-10 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 rounded-xl p-6 text-center">
          <div className="flex justify-center gap-1 mb-3">
            <span className="w-12 h-1 rounded-full bg-[#FF9933]" />
            <span className="w-12 h-1 rounded-full bg-white" />
            <span className="w-12 h-1 rounded-full bg-[#138808]" />
          </div>
          <p className="text-white font-semibold text-lg">
            🇮🇳 {t.govFooter}
          </p>
          <p className="text-blue-200 text-sm mt-2">
            {t.govFooterSub}
          </p>
          <p className="text-blue-300 text-xs mt-1">
            {t.sihPrototype}
          </p>
        </div>
      </main>
    </div>
  );
}
