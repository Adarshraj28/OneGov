"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import GovFooter from "@/components/gov-footer";
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  Shield,
  Eye,
  Trash2,
  Download,
  Search,
  FolderOpen,
  X,
  Camera,
  CreditCard,
  Fingerprint,
  Building2,
  MapPin,
  FingerprintIcon,
  Smartphone,
  ArrowRight,
  BadgeCheck,
  Link2,
  RefreshCw,
  User,
  Calendar,
  Users,
} from "lucide-react";

interface Document {
  id: string;
  type: string;
  name: string;
  fileName: string;
  fileSize: string;
  verificationStatus: "verified" | "pending" | "rejected" | "uploaded" | "aadhaar_verified";
  category: string;
  uploadedAt: string;
  extractedData?: Record<string, string>;
  usedIn?: string[];
  source: "aadhaar" | "uploaded" | "government" | "extracted";
  aadhaarLinked?: boolean;
}

interface AadhaarStatus {
  aadhaarVerified: boolean;
  verifiedAt: string | null;
  aadhaarNumber: string | null;
  extractedFields: Record<string, string> | null;
}

const CATEGORY_ICONS: Record<string, typeof FileText> = {
  identity: Fingerprint,
  address: MapPin,
  business: Building2,
  financial: CreditCard,
  other: FileText,
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  identity: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  address: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  business: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  financial: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  other: { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" },
};

const SOURCE_CONFIG = {
  aadhaar: { label: "Aadhaar Verified", color: "text-green-700", bg: "bg-green-50", border: "border-green-200", icon: Shield },
  government: { label: "Government Issued", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", icon: BadgeCheck },
  uploaded: { label: "Uploaded", color: "text-gray-700", bg: "bg-gray-50", border: "border-gray-200", icon: Upload },
  extracted: { label: "Auto-Extracted", color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200", icon: Link2 },
};

const DOC_TYPES = [
  { type: "aadhaar", name: "Aadhaar Card", category: "identity", requiredFor: ["All government services"], aadhaarSource: true },
  { type: "pan", name: "PAN Card", category: "identity", requiredFor: ["GST", "Business Registration"], aadhaarSource: false },
  { type: "address_proof", name: "Address Proof", category: "address", requiredFor: ["Passport", "Driving License", "Voter ID"], aadhaarSource: false },
  { type: "business_cert", name: "Business Certificate", category: "business", requiredFor: ["FSSAI License", "Municipal Permission"], aadhaarSource: false },
  { type: "photograph", name: "Passport Photo", category: "identity", requiredFor: ["Passport", "Driving License", "Voter ID"], aadhaarSource: false },
  { type: "income_proof", name: "Income Proof", category: "financial", requiredFor: ["Income Certificate", "Subsidies"], aadhaarSource: false },
  { type: "birth_proof", name: "Birth Certificate", category: "identity", requiredFor: ["Passport", "School Admission"], aadhaarSource: false },
  { type: "driving_license", name: "Driving License", category: "identity", requiredFor: ["Vehicle Purchase", "Address Proof"], aadhaarSource: false },
];

export default function CitizenDocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [aadhaarStatus, setAadhaarStatus] = useState<AadhaarStatus | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyStep, setVerifyStep] = useState<"input" | "otp" | "verifying" | "done">("input");
  const [aadhaarInput, setAadhaarInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpHint, setOtpHint] = useState("");
  const [verifyMessage, setVerifyMessage] = useState("");
  const [extractedData, setExtractedData] = useState<Record<string, string> | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  // Load Aadhaar status and documents on mount
  useEffect(() => {
    Promise.all([
      fetch("/api/verify/aadhaar").then((r) => r.json()),
      fetch("/api/auth/profile").then((r) => r.json()),
    ]).then(([verifyData, profileData]) => {
      setAadhaarStatus(verifyData);

      // Build documents from profile data + verification status
      const profile = profileData.user?.profile || {};
      const docs: Document[] = [];

      if (verifyData.aadhaarVerified) {
        docs.push({
          id: "doc-aadhaar",
          type: "aadhaar",
          name: "Aadhaar Card",
          fileName: "aadhaar_verified.xml",
          fileSize: "3.2 KB",
          verificationStatus: "aadhaar_verified",
          category: "identity",
          uploadedAt: verifyData.verifiedAt || new Date().toISOString(),
          extractedData: verifyData.extractedFields || {},
          usedIn: ["Business Registration", "Passport Application", "GST Registration", "PAN Card", "Driving License", "Voter ID"],
          source: "aadhaar",
          aadhaarLinked: true,
        });
      }

      if (profile.panNumber) {
        docs.push({
          id: "doc-pan",
          type: "pan",
          name: "PAN Card",
          fileName: `pan_${profile.panNumber}.xml`,
          fileSize: "1.8 KB",
          verificationStatus: verifyData.aadhaarVerified ? "verified" : "uploaded",
          category: "identity",
          uploadedAt: "2026-08-12T14:30:00Z",
          extractedData: {
            name: profile.name?.toUpperCase() || "",
            pan: profile.panNumber || "",
            dob: profile.dateOfBirth || "",
            fatherName: profile.fatherName?.toUpperCase() || "",
          },
          usedIn: ["GST Registration", "Business Registration", "Food License"],
          source: verifyData.aadhaarVerified ? "extracted" : "uploaded",
          aadhaarLinked: verifyData.aadhaarVerified,
        });
      }

      if (profile.address) {
        docs.push({
          id: "doc-address",
          type: "address_proof",
          name: "Address Proof (from Aadhaar)",
          fileName: "address_aadhaar.xml",
          fileSize: "2.1 KB",
          verificationStatus: verifyData.aadhaarVerified ? "aadhaar_verified" : "uploaded",
          category: "address",
          uploadedAt: verifyData.verifiedAt || "2026-08-15T09:00:00Z",
          extractedData: {
            name: profile.name || "",
            address: profile.address || "",
            city: profile.city || "",
            state: profile.state || "",
            pincode: profile.pincode || "",
          },
          usedIn: ["Passport Application", "Driving License", "Voter ID"],
          source: verifyData.aadhaarVerified ? "aadhaar" : "uploaded",
          aadhaarLinked: verifyData.aadhaarVerified,
        });
      }

      if (profile.voterId) {
        docs.push({
          id: "doc-voter",
          type: "voter_id",
          name: "Voter ID",
          fileName: `voter_${profile.voterId}.xml`,
          fileSize: "1.5 KB",
          verificationStatus: "verified",
          category: "identity",
          uploadedAt: "2026-08-20T10:00:00Z",
          extractedData: { voterId: profile.voterId, name: profile.name || "" },
          usedIn: ["Address Proof"],
          source: "government",
        });
      }

      if (profile.passportNumber) {
        docs.push({
          id: "doc-passport",
          type: "passport",
          name: "Passport",
          fileName: `passport_${profile.passportNumber}.xml`,
          fileSize: "2.8 KB",
          verificationStatus: "verified",
          category: "identity",
          uploadedAt: "2026-08-22T11:00:00Z",
          extractedData: { passport: profile.passportNumber, name: profile.name || "" },
          usedIn: ["International Travel", "Identity Proof"],
          source: "government",
        });
      }

      if (profile.drivingLicense) {
        docs.push({
          id: "doc-dl",
          type: "driving_license",
          name: "Driving License",
          fileName: `dl_${profile.drivingLicense}.xml`,
          fileSize: "2.2 KB",
          verificationStatus: "verified",
          category: "identity",
          uploadedAt: "2026-08-25T14:00:00Z",
          extractedData: { dl: profile.drivingLicense, name: profile.name || "" },
          usedIn: ["Address Proof", "Vehicle Purchase"],
          source: "government",
        });
      }

      if (profile.businessName) {
        docs.push({
          id: "doc-business",
          type: "business_cert",
          name: "Certificate of Incorporation",
          fileName: "incorporation_cert.pdf",
          fileSize: "1.2 MB",
          verificationStatus: "verified",
          category: "business",
          uploadedAt: "2026-08-18T11:00:00Z",
          extractedData: {
            cin: profile.cinNumber || "U56100MH2024PTC123456",
            company: profile.businessName || "",
            type: profile.businessType?.replace(/_/g, " ") || "",
            date: profile.businessRegDate || "",
          },
          usedIn: ["GST Registration", "FSSAI License", "Municipal Permission"],
          source: "uploaded",
        });
      }

      setDocuments(docs);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleVerifyAadhaar = async () => {
    if (verifyStep === "input") {
      setVerifyStep("otp");
      setVerifyMessage("Sending OTP to your registered mobile...");
      // Auto-send OTP
      try {
        const res = await fetch("/api/verify/aadhaar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ step: "send_otp", aadhaarNumber: aadhaarInput }),
        });
        const data = await res.json();
        if (data.success) {
          setVerifyMessage(data.message);
          setOtpHint(data.otpHint);
        } else {
          setVerifyMessage(data.error || "Failed to send OTP");
          setVerifyStep("input");
        }
      } catch {
        setVerifyMessage("Network error");
        setVerifyStep("input");
      }
    }

    if (verifyStep === "otp") {
      setVerifyStep("verifying");
      setVerifyMessage("Verifying OTP and extracting Aadhaar data...");
      try {
        const res = await fetch("/api/verify/aadhaar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ step: "verify_otp", aadhaarNumber: aadhaarInput, otp: otpInput }),
        });
        const data = await res.json();
        if (data.success) {
          setVerifyStep("done");
          setVerifyMessage(data.message);
          setExtractedData(data.extractedData);
          setAadhaarStatus({
            aadhaarVerified: true,
            verifiedAt: new Date().toISOString(),
            aadhaarNumber: aadhaarInput,
            extractedFields: data.profileUpdated,
          });
          // Reload documents
          setTimeout(() => window.location.reload(), 2000);
        } else {
          setVerifyMessage(data.error || "Verification failed");
          setVerifyStep("otp");
        }
      } catch {
        setVerifyMessage("Network error");
        setVerifyStep("otp");
      }
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categoryCounts = {
    all: documents.length,
    identity: documents.filter((d) => d.category === "identity").length,
    address: documents.filter((d) => d.category === "address").length,
    business: documents.filter((d) => d.category === "business").length,
    financial: documents.filter((d) => d.category === "financial").length,
  };

  const handleUpload = (typeName: string) => {
    setUploading(true);
    setTimeout(() => {
      const docType = DOC_TYPES.find((d) => d.type === typeName);
      if (!docType) return;
      const newDoc: Document = {
        id: `doc-${Date.now()}`,
        type: docType.type,
        name: docType.name,
        fileName: `${docType.type}_upload.pdf`,
        fileSize: `${Math.floor(Math.random() * 500 + 100)} KB`,
        verificationStatus: "uploaded",
        category: docType.category,
        uploadedAt: new Date().toISOString(),
        extractedData: { status: "Pending verification" },
        usedIn: docType.requiredFor,
        source: "uploaded",
      };
      setDocuments((prev) => [newDoc, ...prev]);
      setUploading(false);
      setShowUploadModal(false);
    }, 1500);
  };

  const handleDelete = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    setSelectedDoc(null);
  };

  const statusConfig = {
    verified: { icon: CheckCircle2, label: "Verified", color: "text-green-700", bg: "bg-green-50", border: "border-green-200" },
    aadhaar_verified: { icon: Shield, label: "Aadhaar Verified", color: "text-green-700", bg: "bg-green-50", border: "border-green-200" },
    pending: { icon: Clock, label: "Pending", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
    uploaded: { icon: Clock, label: "Uploaded", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
    rejected: { icon: AlertCircle, label: "Rejected", color: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
            <p className="text-sm text-gray-500 mt-1">मेरे दस्तावेज़ — Verify once with Aadhaar, use everywhere</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        </div>

        {/* ═══ Aadhaar Verification Banner ═══ */}
        {aadhaarStatus?.aadhaarVerified ? (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-green-800">🔐 Aadhaar Verified — DigiLocker Style</h3>
                  <span className="text-[10px] px-2 py-0.5 bg-green-200 text-green-800 rounded-full font-bold">
                    <BadgeCheck className="w-3 h-3 inline mr-0.5" />
                    VERIFIED
                  </span>
                </div>
                <p className="text-xs text-green-700 mb-3">
                  Your Aadhaar has been verified via OTP. The following data was automatically extracted and linked to your profile.
                  This data is reused across all government services — no need to re-enter.
                </p>
                {/* Extracted data grid */}
                {aadhaarStatus.extractedFields && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(aadhaarStatus.extractedFields).map(([key, value]) => (
                      <div key={key} className="bg-white rounded-lg p-2 border border-green-200">
                        <p className="text-[9px] text-green-600 uppercase font-medium">{key.replace(/([A-Z])/g, " $1")}</p>
                        <p className="text-xs font-semibold text-gray-900 truncate">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-3 mt-3 text-[10px] text-green-600">
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Data extracted from UIDAI</span>
                  <span>|</span>
                  <span className="flex items-center gap-1"><Link2 className="w-3 h-3" /> Linked to {documents.filter((d) => d.aadhaarLinked).length} documents</span>
                  <span>|</span>
                  <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Last verified: {new Date(aadhaarStatus.verifiedAt!).toLocaleDateString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                <Fingerprint className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-amber-800 mb-1">⚠️ Aadhaar Not Verified</h3>
                <p className="text-xs text-amber-700 mb-3">
                  Verify your Aadhaar to auto-extract your data (name, DOB, address, gender) and reuse it across all services.
                  This is how DigiLocker works — verify once, use everywhere.
                </p>
                <button
                  onClick={() => setShowVerifyModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
                >
                  <Fingerprint className="w-4 h-4" />
                  Verify Aadhaar Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Verification Chain Visualization */}
        {aadhaarStatus?.aadhaarVerified && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <h3 className="text-xs font-semibold text-gray-600 mb-3">📋 Verification Chain</h3>
            <div className="flex items-center gap-2 text-xs overflow-x-auto pb-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-green-700 shrink-0">
                <Shield className="w-3.5 h-3.5" />
                Aadhaar Verified
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-blue-700 shrink-0">
                <Fingerprint className="w-3.5 h-3.5" />
                Data Extracted
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full text-purple-700 shrink-0">
                <Link2 className="w-3.5 h-3.5" />
                Linked to Profile
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF9933]/10 border border-[#FF9933]/20 rounded-full text-[#FF9933] shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Reused Across Services
              </div>
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933]"
            />
          </div>
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            {(["all", "identity", "address", "business", "financial"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedCategory === cat ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {cat === "all" ? `All (${categoryCounts.all})` : cat.charAt(0).toUpperCase() + cat.slice(1) + ` (${categoryCounts[cat]})`}
              </button>
            ))}
          </div>
        </div>

        {/* Documents List */}
        {filteredDocs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No documents found</p>
            <p className="text-xs text-gray-400 mt-1">
              {documents.length === 0 ? "Verify your Aadhaar to auto-populate documents" : "Try a different search or category"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDocs.map((doc) => {
              const catColors = CATEGORY_COLORS[doc.category] || CATEGORY_COLORS.other;
              const CatIcon = CATEGORY_ICONS[doc.category] || FileText;
              const st = statusConfig[doc.verificationStatus];
              const StIcon = st.icon;
              const src = SOURCE_CONFIG[doc.source];
              const SrcIcon = src.icon;

              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md hover:border-[#FF9933]/30 transition-all cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${catColors.bg}`}>
                    <CatIcon className={`w-5 h-5 ${catColors.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                      <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${st.bg} ${st.color} ${st.border}`}>
                        <StIcon className="w-3 h-3" />
                        {st.label}
                      </span>
                      <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${src.bg} ${src.color} ${src.border}`}>
                        <SrcIcon className="w-3 h-3" />
                        {src.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {doc.fileName} • {doc.fileSize} • {new Date(doc.uploadedAt).toLocaleDateString("en-IN")}
                    </p>
                    {doc.usedIn && doc.usedIn.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {doc.usedIn.slice(0, 3).map((service) => (
                          <span key={service} className="text-[9px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                            {service}
                          </span>
                        ))}
                        {doc.usedIn.length > 3 && (
                          <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                            +{doc.usedIn.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Supported Document Types */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Supported Documents</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {DOC_TYPES.map((docType) => {
              const isUploaded = documents.some((d) => d.type === docType.type);
              return (
                <div
                  key={docType.type}
                  className={`bg-white rounded-lg border p-3 transition-colors ${
                    isUploaded ? "border-green-200 bg-green-50/30" : "border-gray-200 hover:border-[#FF9933]/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-gray-700">{docType.name}</p>
                    {isUploaded && <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />}
                  </div>
                  <p className="text-[9px] text-gray-400">{docType.requiredFor.join(", ")}</p>
                  {!isUploaded && (
                    <button
                      onClick={() => handleUpload(docType.type)}
                      disabled={uploading}
                      className="mt-1.5 text-[9px] px-2 py-0.5 bg-blue-900 text-white rounded font-medium hover:bg-blue-800 transition-colors disabled:opacity-50"
                    >
                      {uploading ? "..." : "Add"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* ═══ Aadhaar Verification Modal ═══ */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Aadhaar Verification</h3>
              </div>
              <button onClick={() => { setShowVerifyModal(false); setVerifyStep("input"); setAadhaarInput(""); setOtpInput(""); }} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {verifyStep === "input" && (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Enter your 12-digit Aadhaar number. An OTP will be sent to your registered mobile number.
                </p>
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Aadhaar Number</label>
                  <div className="relative">
                    <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={aadhaarInput}
                      onChange={(e) => setAadhaarInput(e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim())}
                      placeholder="XXXX XXXX XXXX"
                      maxLength={14}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-center text-lg tracking-widest"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Demo: Use 4521 7890 3456 (Adarsh) or 8934 5612 7890 (Priya)</p>
                </div>
                <button
                  onClick={handleVerifyAadhaar}
                  disabled={aadhaarInput.replace(/\s/g, "").length !== 12}
                  className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  Send OTP
                </button>
              </div>
            )}

            {verifyStep === "otp" && (
              <div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-green-800">{verifyMessage}</p>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Enter OTP</label>
                  <input
                    type="text"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                    placeholder="6-digit OTP"
                    maxLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-center text-lg tracking-[0.5em]"
                    autoFocus
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Demo OTP: 123456</p>
                </div>
                <button
                  onClick={handleVerifyAadhaar}
                  disabled={otpInput.length !== 6}
                  className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Verify & Extract Data
                </button>
              </div>
            )}

            {verifyStep === "verifying" && (
              <div className="text-center py-8">
                <Loader2 className="w-10 h-10 text-green-600 animate-spin mx-auto mb-4" />
                <p className="text-sm text-gray-600">{verifyMessage}</p>
              </div>
            )}

            {verifyStep === "done" && (
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-lg font-bold text-green-800 mb-2">Aadhaar Verified!</h4>
                <p className="text-sm text-gray-600 mb-4">{verifyMessage}</p>
                {extractedData && (
                  <div className="bg-gray-50 rounded-lg p-3 text-left mb-4">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Extracted Data:</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {Object.entries(extractedData).filter(([k]) => k !== "photo").map(([key, value]) => (
                        <div key={key} className="text-xs">
                          <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, " $1")}: </span>
                          <span className="font-medium text-gray-900">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <button
                  onClick={() => { setShowVerifyModal(false); window.location.reload(); }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upload Document</h3>
              <button onClick={() => setShowUploadModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-4">
              <Camera className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-600">Drag & drop or click to upload</p>
              <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 5MB</p>
            </div>
            <p className="text-xs text-gray-500 mb-2">Quick upload:</p>
            <div className="grid grid-cols-2 gap-2">
              {DOC_TYPES.filter((d) => !documents.some((doc) => doc.type === d.type)).map((docType) => (
                <button
                  key={docType.type}
                  onClick={() => handleUpload(docType.type)}
                  disabled={uploading}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-xs text-left hover:border-[#FF9933] hover:bg-orange-50 transition-colors disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3 text-gray-400" />}
                  {docType.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Document Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{selectedDoc.name}</h3>
              <button onClick={() => setSelectedDoc(null)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Source & Status */}
            <div className="flex items-center gap-2 mb-4">
              {(() => {
                const src = SOURCE_CONFIG[selectedDoc.source];
                const SrcIcon = src.icon;
                return (
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${src.bg} ${src.color} ${src.border}`}>
                    <SrcIcon className="w-3.5 h-3.5" />
                    {src.label}
                  </span>
                );
              })()}
              {selectedDoc.aadhaarLinked && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                  <Link2 className="w-3.5 h-3.5" />
                  Aadhaar Linked
                </span>
              )}
            </div>

            {/* Extracted Data */}
            {selectedDoc.extractedData && Object.keys(selectedDoc.extractedData).length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">
                  {selectedDoc.source === "aadhaar" ? "Data Extracted from Aadhaar (UIDAI)" : "Extracted Data"}
                </p>
                <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
                  {Object.entries(selectedDoc.extractedData).filter(([, v]) => v && v !== "verified").map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                      <span className="text-gray-900 font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Used In */}
            {selectedDoc.usedIn && selectedDoc.usedIn.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">Used Across Services</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDoc.usedIn.map((service) => (
                    <span key={service} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                <Download className="w-4 h-4" />
                Download
              </button>
              {selectedDoc.source !== "aadhaar" && (
                <button
                  onClick={() => handleDelete(selectedDoc.id)}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <GovFooter />
    </div>
  );
}
