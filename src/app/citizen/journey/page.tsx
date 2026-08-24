"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  Plus,
  FileText,
} from "lucide-react";

interface Journey {
  id: string;
  intent: string;
  status: string;
  progress: number;
  createdAt: string;
  steps: { status: string; service: { name: string } }[];
}

export default function CitizenJourneysPage() {
  const router = useRouter();
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/journeys")
      .then((r) => r.json())
      .then((data) => setJourneys(data.journeys || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "in_progress":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "failed":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const statusLabel = (status: string) => {
    const labels: Record<string, string> = {
      created: "Created",
      in_progress: "In Progress",
      completed: "Completed",
      failed: "Failed",
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Service Journeys</h1>
          <button
            onClick={() => router.push("/citizen")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Request
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        ) : journeys.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No journeys yet. Start your first request!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {journeys.map((journey) => (
              <button
                key={journey.id}
                onClick={() => router.push(`/citizen/journey/${journey.id}`)}
                className="w-full text-left bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {statusIcon(journey.status)}
                    <div>
                      <p className="font-medium text-gray-900">{journey.intent}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {journey.steps?.length || 0} services •{" "}
                        {new Date(journey.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Progress</p>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${journey.progress}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-500 w-12 text-right">
                      {journey.progress}%
                    </span>
                  </div>
                </div>

                {/* Step preview */}
                <div className="flex gap-1 mt-3">
                  {journey.steps?.slice(0, 8).map((step, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${
                        step.status === "approved" || step.status === "completed"
                          ? "bg-green-500"
                          : step.status === "in_progress" || step.status === "submitted"
                            ? "bg-blue-500"
                            : step.status === "failed"
                              ? "bg-red-400"
                              : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
