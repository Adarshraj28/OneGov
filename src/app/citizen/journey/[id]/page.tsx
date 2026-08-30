"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import GovFooter from "@/components/gov-footer";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  ChevronRight,
  Shield,
  Send,
  ArrowLeft,
  FileText,
  ExternalLink,
  AlertTriangle,
  RotateCw,
  Lock,
  Building2,
  Target,
  ChevronDown,
} from "lucide-react";

interface JourneyStep {
  id: string;
  sequence: number;
  status: string;
  externalApplicationId?: string;
  failureReason?: string;
  retryCount: number;
  service: {
    id: string;
    name: string;
    code: string;
    department: string | { name: string; code: string; id: string };
    description: string;
    estimatedDays: number;
  };
  integrationRequests?: {
    status: string;
    correlationId: string;
    latencyMs: number;
  }[];
}

interface Journey {
  id: string;
  intent: string;
  intentParsed?: string;
  status: string;
  progress: number;
  createdAt: string;
  steps: JourneyStep[];
}

// Citizen-friendly status config
const STATUS_CONFIG: Record<string, { icon: string; label: string; color: string; bgColor: string; borderColor: string }> = {
  pending: { icon: "☐", label: "Not Started", color: "text-gray-500", bgColor: "bg-gray-50", borderColor: "border-gray-200" },
  waiting: { icon: "🔒", label: "Blocked", color: "text-gray-500", bgColor: "bg-gray-50", borderColor: "border-gray-200" },
  in_progress: { icon: "⏳", label: "In Progress", color: "text-[#FF9933]", bgColor: "bg-orange-50", borderColor: "border-orange-200" },
  submitted: { icon: "🏛️", label: "Waiting for Government", color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
  reviewing: { icon: "🏛️", label: "Under Review", color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
  approved: { icon: "🟢", label: "Completed", color: "text-[#138808]", bgColor: "bg-green-50", borderColor: "border-green-200" },
  completed: { icon: "🟢", label: "Completed", color: "text-[#138808]", bgColor: "bg-green-50", borderColor: "border-green-200" },
  rejected: { icon: "❌", label: "Action Required", color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200" },
  failed: { icon: "⚠️", label: "Service Unavailable", color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200" },
};

// Official portal URLs
const OFFICIAL_PORTALS: Record<string, { url: string; name: string }> = {
  business_registration: { url: "https://www.mca.gov.in", name: "MCA Portal" },
  tax_registration: { url: "https://www.gst.gov.in", name: "GST Portal" },
  food_license: { url: "https://www.fssai.gov.in", name: "FSSAI Portal" },
  passport: { url: "https://www.passportindia.gov.in", name: "Passport Seva" },
  driving_license: { url: "https://parivahan.gov.in", name: "Parivahan Portal" },
  aadhaar_update: { url: "https://www.uidai.gov.in", name: "UIDAI Portal" },
  pan_card: { url: "https://www.onlineservices.nsdl.com", name: "NSDL Portal" },
  voter_id: { url: "https://www.nvsp.in", name: "NVSP Portal" },
};

export default function JourneyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [journey, setJourney] = useState<Journey | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [consentStep, setConsentStep] = useState<JourneyStep | null>(null);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [showReadiness, setShowReadiness] = useState(false);

  useEffect(() => {
    fetchJourney();
  }, [id]);

  const fetchJourney = async () => {
    try {
      const res = await fetch(`/api/journeys?id=${id}`);
      const data = await res.json();
      setJourney(data.journey);
    } catch {
      router.push("/citizen");
    } finally {
      setLoading(false);
    }
  };

  const handleShowConsent = (step: JourneyStep) => {
    setConsentStep(step);
  };

  const handleConsentGrant = async () => {
    if (!consentStep) return;
    setSubmitting(consentStep.id);
    setConsentStep(null);

    try {
      const res = await fetch("/api/journeys/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ journeyStepId: consentStep.id }),
      });

      const data = await res.json();
      if (data.success) {
        await fetchJourney();
      } else {
        alert(data.error || "Submission failed");
      }
    } catch {
      alert("Network error");
    } finally {
      setSubmitting(null);
    }
  };

  // Compute step statistics
  const getStepStats = () => {
    if (!journey) return { completed: 0, total: 0, current: null as JourneyStep | null, next: null as JourneyStep | null, blocked: 0, waiting: 0 };
    const completed = journey.steps.filter((s) => s.status === "approved" || s.status === "completed").length;
    const blocked = journey.steps.filter((s) => s.status === "waiting").length;
    const waiting = journey.steps.filter((s) => s.status === "submitted" || s.status === "reviewing").length;
    const current = journey.steps.find((s) => s.status === "in_progress") || null;
    const next = journey.steps.find((s) => s.status === "pending" || s.status === "waiting") || null;
    return { completed, total: journey.steps.length, current, next, blocked, waiting };
  };

  const getDeptName = (dept: string | { name: string; code: string; id: string }) => {
    return typeof dept === "string" ? dept : dept.name;
  };

  const getPortal = (code: string) => {
    return OFFICIAL_PORTALS[code] || null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-[#FF9933] animate-spin" />
        </div>
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-20">
          <p className="text-gray-500">Journey not found</p>
        </div>
      </div>
    );
  }

  const stats = getStepStats();
  const isComplete = journey.status === "completed" || stats.completed === stats.total;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/citizen")}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        {/* Journey Header with Progress */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {isComplete ? "🟢 Journey Complete" : "Service Journey"}
              </h1>
              <p className="text-sm text-gray-600 mt-1">{journey.intent}</p>
              <p className="text-xs text-gray-400 mt-1">
                Journey ID: {journey.id.slice(0, 8).toUpperCase()} • Created{" "}
                {new Date(journey.createdAt).toLocaleDateString()}
              </p>
            </div>
            {journey.status === "completed" ? (
              <span className="px-3 py-1 rounded-full text-xs font-medium text-[#138808] bg-[#138808]/10 border border-[#138808]/20">
                🟢 Completed
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-medium text-[#FF9933] bg-[#FF9933]/10 border border-[#FF9933]/20">
                ⏳ In Progress
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span className="font-medium">
                {stats.completed} of {stats.total} steps completed
              </span>
              <span className="font-bold text-gray-900">{journey.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-[#FF9933] to-[#138808] h-3 rounded-full transition-all duration-500"
                style={{ width: `${journey.progress}%` }}
              />
            </div>
          </div>

          {/* Quick Status Summary */}
          <div className="flex flex-wrap gap-3 mt-4 text-xs">
            {stats.completed > 0 && (
              <span className="flex items-center gap-1 text-[#138808]">
                🟢 {stats.completed} completed
              </span>
            )}
            {stats.waiting > 0 && (
              <span className="flex items-center gap-1 text-blue-600">
                🏛️ {stats.waiting} under review
              </span>
            )}
            {stats.blocked > 0 && (
              <span className="flex items-center gap-1 text-gray-500">
                🔒 {stats.blocked} blocked
              </span>
            )}
            {stats.current && (
              <span className="flex items-center gap-1 text-[#FF9933]">
                ⏳ Current: {stats.current.service.name}
              </span>
            )}
          </div>
        </div>

        {/* Final Readiness Banner (shown when all steps complete) */}
        {isComplete && (
          <div className="bg-gradient-to-r from-[#138808]/5 to-[#138808]/10 rounded-xl border border-[#138808]/20 p-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#138808] rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#138808]">
                  🟢 READY TO PROCEED
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  All government services for your journey have been completed successfully.
                  You are ready to proceed with your business.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Required Banner (when there are rejected/failed steps) */}
        {!isComplete && stats.completed > 0 && stats.completed < stats.total && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-[#FF9933]" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Current Step</p>
                  {stats.current ? (
                    <p className="text-xs text-gray-600">
                      {stats.current.service.name} — {getDeptName(stats.current.service.department)}
                    </p>
                  ) : stats.next ? (
                    <p className="text-xs text-gray-600">
                      {stats.next.service.name} — {getDeptName(stats.next.service.department)}
                    </p>
                  ) : null}
                </div>
              </div>
              <button
                onClick={() => {
                  const stepId = stats.current?.id || stats.next?.id;
                  if (stepId) setExpandedStep(stepId);
                }}
                className="px-4 py-2 bg-gradient-to-r from-[#FF9933] to-[#e88a2d] text-white rounded-lg text-xs font-medium hover:from-[#e88a2d] hover:to-[#FF9933] transition-all shadow-sm"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Service Journey Timeline */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Service Roadmap
          </h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[15px] top-5 bottom-5 w-0.5 bg-gray-200" />

            <div className="space-y-1">
              {journey.steps.map((step) => {
                const config = STATUS_CONFIG[step.status] || STATUS_CONFIG.pending;
                const portal = getPortal(step.service.code);

                return (
                  <div key={step.id}>
                    <div
                      className={`relative flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-colors border border-transparent ${
                        expandedStep === step.id
                          ? `${config.bgColor} ${config.borderColor}`
                          : `hover:bg-gray-50`
                      }`}
                      onClick={() =>
                        setExpandedStep(expandedStep === step.id ? null : step.id)
                      }
                    >
                      {/* Step Status Icon */}
                      <div className="relative z-10 mt-0.5 text-lg shrink-0">
                        {config.icon}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 font-mono">
                            Step {step.sequence}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {step.service.name}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {getDeptName(step.service.department)} • Est.{" "}
                          {step.service.estimatedDays} days
                        </p>

                        {step.externalApplicationId && (
                          <p className="text-xs text-blue-600 mt-1 font-mono">
                            Application: {step.externalApplicationId}
                          </p>
                        )}

                        {step.failureReason && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                            <AlertTriangle className="w-3 h-3" />
                            {step.failureReason}
                          </div>
                        )}
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium border ${config.color} ${config.bgColor} ${config.borderColor}`}
                        >
                          {config.label}
                        </span>
                        <ChevronRight
                          className={`w-4 h-4 text-gray-400 transition-transform ${
                            expandedStep === step.id ? "rotate-90" : ""
                          }`}
                        />
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedStep === step.id && (
                      <div className="ml-12 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-700 mb-3">
                          {step.service.description}
                        </p>

                        {/* Fee & Timeline */}
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="bg-gray-100 rounded-lg p-2.5">
                            <p className="text-[10px] font-medium text-gray-500">Government Fee</p>
                            <p className="text-sm font-bold text-gray-900">
                              {step.service.code === "food_license" ? "₹2,000 — ₹7,500" :
                               step.service.code === "business_registration" ? "₹5,000 — ₹15,000" :
                               step.service.code === "tax_registration" ? "₹0 — ₹1,000" :
                               step.service.code === "passport" ? "₹1,500 — ₹2,000" :
                               step.service.code === "driving_license" ? "₹200 — ₹1,000" :
                               step.service.code === "municipal_permission" ? "₹500 — ₹5,000" :
                               step.service.code === "fire_safety" ? "₹1,000 — ₹3,000" :
                               step.service.code === "aadhaar_update" ? "₹50" :
                               step.service.code === "pan_card" ? "₹107 — ₹1,020" :
                               step.service.code === "voter_id" ? "Free" :
                               "₹0 — ₹5,000"}
                            </p>
                            <p className="text-[9px] text-gray-400">May vary by state/category</p>
                          </div>
                          <div className="bg-gray-100 rounded-lg p-2.5">
                            <p className="text-[10px] font-medium text-gray-500">Estimated Time</p>
                            <p className="text-sm font-bold text-gray-900">
                              ~{step.service.estimatedDays} working days
                            </p>
                            <p className="text-[9px] text-gray-400">From submission date</p>
                          </div>
                        </div>

                        {/* Required Documents */}
                        <div className="mb-3">
                          <p className="text-xs font-medium text-gray-500 mb-1">
                            📄 Required Documents
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {["Identity proof", "Address proof", "Business plan"].map(
                              (doc) => (
                                <span
                                  key={doc}
                                  className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full border border-gray-200"
                                >
                                  {doc}
                                </span>
                              )
                            )}
                          </div>
                        </div>

                        {/* Official Portal Link */}
                        {portal && (
                          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-blue-600" />
                              <div>
                                <p className="text-xs font-medium text-blue-800">
                                  Official Government Portal
                                </p>
                                <p className="text-[10px] text-blue-600">
                                  Application will continue on the official government portal
                                </p>
                              </div>
                            </div>
                            <a
                              href={portal.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 bg-blue-900 text-white rounded-md text-xs font-medium hover:bg-blue-800 transition-colors"
                            >
                              Continue to {portal.name}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}

                        {/* Action buttons */}
                        {step.status === "in_progress" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShowConsent(step);
                            }}
                            disabled={submitting === step.id}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF9933] to-[#e88a2d] text-white rounded-lg text-sm font-medium hover:from-[#e88a2d] hover:to-[#FF9933] transition-all disabled:opacity-50 shadow-sm"
                          >
                            {submitting === step.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                            Submit Application
                          </button>
                        )}

                        {step.status === "failed" && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShowConsent(step);
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
                            >
                              <RotateCw className="w-4 h-4" />
                              Retry Submission
                            </button>
                            {step.retryCount > 0 && (
                              <span className="text-xs text-gray-500">
                                Attempt {step.retryCount} of 3
                              </span>
                            )}
                          </div>
                        )}

                        {step.status === "waiting" && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Lock className="w-3 h-3" />
                            This step is blocked by prerequisite steps. Complete them first.
                          </div>
                        )}

                        {(step.status === "submitted" || step.status === "reviewing") && (
                          <div className="flex items-center gap-2 text-xs text-blue-600">
                            <Clock className="w-3 h-3" />
                            Application submitted. Waiting for government processing.
                            {step.externalApplicationId && (
                              <span className="font-mono text-blue-500">
                                ({step.externalApplicationId})
                              </span>
                            )}
                          </div>
                        )}

                        {/* Integration details */}
                        {step.integrationRequests &&
                          step.integrationRequests.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-xs font-medium text-gray-500 mb-2">
                                Integration Details
                              </p>
                              {step.integrationRequests.map((req, ri) => (
                                <div
                                  key={ri}
                                  className="flex items-center gap-2 text-xs text-gray-600"
                                >
                                  <span className="font-mono text-gray-400">
                                    {req.correlationId.slice(0, 8)}
                                  </span>
                                  <span
                                    className={
                                      req.status === "success"
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }
                                  >
                                    {req.status === "success" ? "200 OK" : "Failed"}
                                  </span>
                                  <span className="text-gray-400">
                                    {req.latencyMs}ms
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <GovFooter />

      {/* Consent Modal */}
      {consentStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Data Sharing Consent
                </h3>
                <p className="text-xs text-gray-500">
                  {getDeptName(consentStep.service.department)}
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-xs font-medium text-green-800 mb-2">
                  ✅ Data that will be shared:
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Name", "Address", "City", "State", "Business Name", "Business Type"].map(
                    (field) => (
                      <span
                        key={field}
                        className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        {field}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-xs font-medium text-red-800 mb-2">
                  🔒 Data that will NOT be shared:
                </p>
                <div className="flex flex-wrap gap-2">
                  {["PAN Number", "Aadhaar Number", "GST Number", "Other Documents"].map(
                    (field) => (
                      <span
                        key={field}
                        className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full"
                      >
                        <AlertCircle className="w-3 h-3" />
                        {field}
                      </span>
                    )
                  )}
                </div>
              </div>

              <p className="text-xs text-gray-500">
                This consent is recorded in the audit log for accountability. You
                can revoke this consent at any time.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setConsentStep(null)}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConsentGrant}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#FF9933] to-[#e88a2d] text-white rounded-lg text-sm font-medium hover:from-[#e88a2d] hover:to-[#FF9933] transition-all shadow-md"
              >
                Allow & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
