"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import { FileText, Loader2, Users } from "lucide-react";

interface Journey {
  id: string;
  intent: string;
  status: string;
  progress: number;
  createdAt: string;
  user: { name: string; email: string };
  steps: { status: string; service: { name: string; department: string } }[];
}

export default function OfficerJourneysPage() {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Service Applications
        </h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {journeys.map((j) => (
              <div
                key={j.id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 cursor-pointer transition-colors"
                onClick={() => router.push(`/citizen/journey/${j.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {j.user?.name || "Unknown"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{j.intent}</p>
                    <div className="flex gap-2 mt-2">
                      {j.steps?.map((step, i) => (
                        <span
                          key={i}
                          className={`text-xs px-2 py-0.5 rounded ${
                            step.status === "approved"
                              ? "bg-green-50 text-green-700"
                              : step.status === "in_progress" || step.status === "submitted"
                                ? "bg-blue-50 text-blue-700"
                                : step.status === "failed"
                                  ? "bg-red-50 text-red-700"
                                  : "bg-gray-50 text-gray-600"
                          }`}
                        >
                          {step.service?.name || `Step ${i + 1}`}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mb-1">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${j.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{j.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
