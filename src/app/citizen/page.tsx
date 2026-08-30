"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import GovFooter from "@/components/gov-footer";
import PMModiBanner from "@/components/pm-modi-banner";
import AIChat from "@/components/ai-chat";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
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
  Shield,
  BadgeCheck,
  ArrowRight,
  Lock,
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
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, pending: 0 });
  const [aadhaarVerified, setAadhaarVerified] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user) router.push("/login");
      })
      .catch(() => router.push("/login"));

    fetch("/api/verify/aadhaar")
      .then((r) => r.json())
      .then((data) => setAadhaarVerified(data.aadhaarVerified || false))
      .catch(() => {});

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

  const handleWorkflowCreated = (workflowId: string) => {
    // Navigate to journey detail when AI creates a workflow
    router.push(`/citizen/journey/${workflowId}`);
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

        {/* Verification Status Bar */}
        {!aadhaarVerified && (
          <div className="max-w-3xl mx-auto mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">Verify your Aadhaar to unlock full functionality</p>
              <p className="text-xs text-amber-600">Auto-extract documents, enable data reuse, and access all government services</p>
            </div>
            <a href="/citizen/documents" className="flex items-center gap-1 px-3 py-2 bg-amber-600 text-white rounded-lg text-xs font-medium hover:bg-amber-700 transition-colors shrink-0">
              Verify Now <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        )}
        {aadhaarVerified && (
          <div className="max-w-3xl mx-auto mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-800 flex items-center gap-2">
                Identity Verified <BadgeCheck className="w-4 h-4" />
              </p>
              <p className="text-xs text-green-600">Aadhaar verified — documents extracted from government portals, data reused across services</p>
            </div>
          </div>
        )}

        {/* AI Chat Interface */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="h-[500px]">
            <AIChat onWorkflowCreated={handleWorkflowCreated} />
          </div>
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
              // Map service names to working action URLs
              const serviceUrls: Record<string, string> = {
                "Aadhaar Card": "https://uidai.gov.in",
                "PAN Card": "https://www.onlineservices.nsdl.com",
                "Passport": "https://www.passportindia.gov.in",
                "Driving License": "https://parivahan.gov.in",
                "Voter ID": "https://www.nvsp.in",
                "Birth Certificate": "/citizen",
                "Income Certificate": "/citizen",
                "Property Registration": "/citizen",
                "Ration Card": "/citizen",
                "Caste Certificate": "/citizen",
              };
              const url = serviceUrls[service.name] || "/citizen";
              const isExternal = url.startsWith("http");
              return (
                <a
                  key={service.name}
                  href={url}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-md hover:border-[#FF9933]/50 transition-all cursor-pointer group block"
                >
                  <div
                    className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center bg-${service.color}-50 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-6 h-6 text-${service.color}-600`} />
                  </div>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-[#FF9933] transition-colors">{service.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{service.department}</p>
                  <p className="text-[10px] text-gray-400 mt-2 leading-tight">{service.description}</p>
                  <span className="inline-block mt-2 text-[10px] text-[#FF9933] font-medium">
                    {isExternal ? "Visit Portal →" : "Start Journey →"}
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Government Trust Banner */}
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
          <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-xs text-blue-300">
            <span>📞 Toll-Free: <strong className="text-white">1800-11-0031</strong></span>
            <span>|</span>
            <a href="/departments" className="hover:text-white transition-colors underline">Department Directory</a>
            <span>|</span>
            <a href="/track" className="hover:text-white transition-colors underline">Track Application</a>
          </div>
          <p className="text-blue-400 text-[10px] mt-2">
            {t.sihPrototype}
          </p>
        </div>
      </main>
      <GovFooter />
    </div>
  );
}
