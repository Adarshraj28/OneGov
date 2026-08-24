"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  Shield,
} from "lucide-react";

interface Document {
  id: string;
  type: string;
  name: string;
  verificationStatus: string;
  createdAt: string;
  extractedData: string;
}

export default function CitizenDocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Documents are fetched from the server
    setLoading(false);
  }, []);

  const statusIcon = (status: string) => {
    switch (status) {
      case "verified":
      case "prototype_verified":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "uploaded":
        return <Clock className="w-5 h-5 text-amber-600" />;
      case "rejected":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Document Intelligence:</strong> Upload your documents once.
            ONEGOV will extract and verify relevant information, then reuse it
            across all your service journeys.
          </p>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No documents uploaded yet</p>
            <p className="text-xs text-gray-400">
              Upload your ID, PAN, address proof, and other documents to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {statusIcon(doc.verificationStatus)}
                  <div>
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-500">
                      {doc.type.replace(/_/g, " ").toUpperCase()} •{" "}
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    doc.verificationStatus === "verified" ||
                    doc.verificationStatus === "prototype_verified"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : doc.verificationStatus === "rejected"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {doc.verificationStatus === "prototype_verified"
                    ? "Prototype Verified"
                    : doc.verificationStatus.charAt(0).toUpperCase() +
                      doc.verificationStatus.slice(1)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Document Types Available */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Supported Document Types
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { type: "PAN Card", code: "pan" },
              { type: "Aadhaar Card", code: "aadhaar" },
              { type: "Address Proof", code: "address_proof" },
              { type: "Business Certificate", code: "business_cert" },
              { type: "Property Document", code: "property_doc" },
              { type: "Identity Proof", code: "identity_proof" },
            ].map((doc) => (
              <div
                key={doc.code}
                className="bg-white rounded-lg border border-gray-200 p-4 text-center hover:border-blue-300 transition-colors cursor-pointer"
              >
                <Shield className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">{doc.type}</p>
                <p className="text-xs text-gray-400 mt-1">{doc.code}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
