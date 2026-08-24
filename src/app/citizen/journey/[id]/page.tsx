"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
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
  status: string;
  progress: number;
  createdAt: string;
  steps: JourneyStep[];
}

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
        // Refresh journey
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "submitted":
        return <Send className="w-5 h-5 text-blue-600" />;
      case "in_progress":
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      case "failed":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "waiting":
        return <Clock className="w-5 h-5 text-gray-400" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Not Started",
      waiting: "Waiting for Dependencies",
      in_progress: "In Progress",
      submitted: "Submitted to Department",
      reviewing: "Under Review",
      approved: "Approved",
      completed: "Completed",
      rejected: "Rejected",
      failed: "Service Unavailable",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "completed":
        return "text-green-700 bg-green-50 border-green-200";
      case "submitted":
      case "in_progress":
        return "text-blue-700 bg-blue-50 border-blue-200";
      case "failed":
        return "text-red-700 bg-red-50 border-red-200";
      case "waiting":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
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

        {/* Journey Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Service Journey
              </h1>
              <p className="text-sm text-gray-600 mt-1">{journey.intent}</p>
              <p className="text-xs text-gray-400 mt-1">
                Journey ID: {journey.id.slice(0, 8).toUpperCase()} • Created{" "}
                {new Date(journey.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(journey.status)}`}
            >
              {getStatusLabel(journey.status)}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{journey.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${journey.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Service Journey Timeline */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Your Service Journey
          </h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[15px] top-5 bottom-5 w-0.5 bg-gray-200" />

            <div className="space-y-1">
              {journey.steps.map((step, i) => (
                <div key={step.id}>
                  <div
                    className={`relative flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-colors ${
                      expandedStep === step.id
                        ? "bg-gray-50"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      setExpandedStep(
                        expandedStep === step.id ? null : step.id
                      )
                    }
                  >
                    {/* Step Icon */}
                    <div className="relative z-10 mt-0.5">
                      {getStatusIcon(step.status)}
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
                      <p className="text-xs text-gray-500 mt-0.5">                      {typeof step.service.department === 'string' ? step.service.department : step.service.department.name} • Est. {" "}
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
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(step.status)}`}
                      >
                        {getStatusLabel(step.status)}
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

                      {step.service.code && (
                        <div className="mb-3">
                          <p className="text-xs font-medium text-gray-500 mb-1">
                            Service Code
                          </p>
                          <p className="text-xs font-mono text-gray-700">
                            {step.service.code}
                          </p>
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
                          className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-50"
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
              ))}
            </div>
          </div>
        </div>
      </main>

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
                  {typeof consentStep.service.department === 'string' ? consentStep.service.department : consentStep.service.department.name}
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-xs font-medium text-green-800 mb-2">
                  Data that will be shared:
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
                  Data that will NOT be shared:
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
                className="flex-1 px-4 py-2.5 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
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
