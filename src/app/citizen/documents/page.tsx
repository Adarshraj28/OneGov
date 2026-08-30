"use client";

import { useState, useEffect, useRef } from "react";
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
  Smartphone,
  ArrowRight,
  BadgeCheck,
  Link2,
  RefreshCw,
  User,
  Calendar,
  Users,
  Lock,
  Unlock,
  Globe,
  ServerCrash,
  Zap,
  ExternalLink,
  CheckCircle,
  BookOpen,
  Car,
  Vote,
  Receipt,
} from "lucide-react";

interface Document {
  id: string;
  type: string;
  name: string;
  fileName: string;
  fileSize: string;
  verificationStatus: "verified" | "pending" | "rejected" | "uploaded" | "aadhaar_verified" | "extracting";
  category: string;
  uploadedAt: string;
  extractedData?: Record<string, string>;
  usedIn?: string[];
  source: "aadhaar" | "uploaded" | "government" | "extracted";
  aadhaarLinked?: boolean;
  portal?: string;
  verificationId?: string;
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
  extracted: { label: "Extracted from Gov Portal", color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200", icon: Globe },
};

const PORTAL_CONFIG: Record<string, { name: string; url: string; icon: typeof FileText; color: string }> = {
  uidai: { name: "UIDAI (Aadhaar)", url: "https://uidai.gov.in", icon: Fingerprint, color: "text-blue-600" },
  nsdl: { name: "NSDL (PAN)", url: "https://www.onlineservices.nsdl.com", icon: CreditCard, color: "text-green-600" },
  mea: { name: "MEA (Passport)", url: "https://www.passportindia.gov.in", icon: BookOpen, color: "text-indigo-600" },
  morth: { name: "Parivahan (DL)", url: "https://parivahan.gov.in", icon: Car, color: "text-orange-600" },
  eci: { name: "ECI (Voter ID)", url: "https://www.nvsp.in", icon: Vote, color: "text-red-600" },
  mca: { name: "MCA (Business)", url: "https://www.mca.gov.in", icon: Building2, color: "text-purple-600" },
  gstn: { name: "GSTN (GST)", url: "https://www.gst.gov.in", icon: Receipt, color: "text-teal-600" },
};

const EXTRACTABLE_DOCS = [
  { portal: "uidai", type: "aadhaar", name: "Aadhaar Card", category: "identity", icon: Fingerprint },
  { portal: "nsdl", type: "pan", name: "PAN Card", category: "identity", icon: CreditCard },
  { portal: "mea", type: "passport", name: "Passport", category: "identity", icon: BookOpen },
  { portal: "morth", type: "driving_license", name: "Driving License", category: "identity", icon: Car },
  { portal: "eci", type: "voter_id", name: "Voter ID", category: "identity", icon: Vote },
  { portal: "mca", type: "business_cert", name: "Certificate of Incorporation", category: "business", icon: Building2 },
  { portal: "gstn", type: "gst", name: "GST Registration", category: "financial", icon: Receipt },
];

function extractDataToDoc(doc: Record<string, string & Record<string, string>> & { type: string }, aadhaarVerified: boolean): Document {
  const portalKey = Object.entries(PORTAL_CONFIG).find(([_, v]) => v.name.toLowerCase().includes(doc.verificationSource?.toLowerCase() || ""))?.[0] || "uidai";
  const docType = EXTRACTABLE_DOCS.find((d) => d.portal === portalKey) || EXTRACTABLE_DOCS[0];
  const cat = CATEGORY_COLORS[docType.category] || CATEGORY_COLORS.other;

  const { type, verificationSource, verificationId, extractedAt, ...extractedData } = doc;

  return {
    id: `doc-${docType.type}-${Date.now()}`,
    type: docType.type,
    name: docType.name,
    fileName: `${docType.type}_extracted.xml`,
    fileSize: `${(JSON.stringify(extractedData).length / 1024).toFixed(1)} KB`,
    verificationStatus: aadhaarVerified ? "aadhaar_verified" : "verified",
    category: docType.category,
    uploadedAt: extractedAt || new Date().toISOString(),
    extractedData: extractedData as Record<string, string>,
    usedIn: docType.type === "aadhaar" ? ["All government services"] :
            docType.type === "pan" ? ["GST Registration", "Business Registration", "Food License"] :
            docType.type === "passport" ? ["International Travel", "Identity Proof"] :
            docType.type === "driving_license" ? ["Address Proof", "Vehicle Purchase"] :
            docType.type === "voter_id" ? ["Address Proof", "Identity Proof"] :
            docType.type === "business_cert" ? ["GST Registration", "FSSAI License"] :
            ["GST Filing", "Business Compliance"],
    source: aadhaarVerified ? "aadhaar" : "extracted",
    aadhaarLinked: aadhaarVerified,
    portal: portalKey,
    verificationId: verificationId,
  };
}

export default function CitizenDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [aadhaarStatus, setAadhaarStatus] = useState<AadhaarStatus | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyStep, setVerifyStep] = useState<"input" | "otp" | "verifying" | "done">("input");
  const [aadhaarInput, setAadhaarInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpHint, setOtpHint] = useState("");
  const [verifyMessage, setVerifyMessage] = useState("");
  const [extractedData, setExtractedData] = useState<Record<string, string> | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [extracting, setExtracting] = useState(false);
  const [extractProgress, setExtractProgress] = useState<string[]>([]);
  const [documentsExtracted, setDocumentsExtracted] = useState(false);
  const [showExtractModal, setShowExtractModal] = useState(false);

  useEffect(() => {
    fetchAadhaarStatus();
  }, []);

  const fetchAadhaarStatus = async () => {
    setLoading(true);
    try {
      const [verifyRes, extractRes] = await Promise.all([
        fetch("/api/verify/aadhaar").then((r) => r.json()),
        fetch("/api/verify/extract").then((r) => r.json()),
      ]);
      setAadhaarStatus(verifyRes);
      setDocumentsExtracted(extractRes.documentsExtracted || false);

      if (verifyRes.aadhaarVerified) {
        // If Aadhaar verified but docs not extracted yet, auto-extract
        if (!extractRes.documentsExtracted) {
          // Don't auto-extract — let user click the button
        }
        // Load documents from profile
        loadDocumentsFromProfile(verifyRes);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const loadDocumentsFromProfile = (verifyData: AadhaarStatus) => {
    // Documents are loaded after extraction via the extract API
    // For now, set basic Aadhaar doc
    if (verifyData.aadhaarVerified && verifyData.extractedFields) {
      const basicDoc: Document = {
        id: "doc-aadhaar",
        type: "aadhaar",
        name: "Aadhaar Card",
        fileName: "aadhaar_verified.xml",
        fileSize: "3.2 KB",
        verificationStatus: "aadhaar_verified",
        category: "identity",
        uploadedAt: verifyData.verifiedAt || new Date().toISOString(),
        extractedData: verifyData.extractedFields,
        usedIn: ["All government services"],
        source: "aadhaar",
        aadhaarLinked: true,
        portal: "uidai",
      };
      setDocuments([basicDoc]);
    }
  };

  const handleExtractAll = async () => {
    setExtracting(true);
    setExtractProgress([]);
    setShowExtractModal(true);
    setVerifyStep("verifying");

    const aadhaarNum = aadhaarStatus?.aadhaarNumber || aadhaarInput;

    try {
      // Step by step extraction simulation for visual effect
      for (const docType of EXTRACTABLE_DOCS) {
        setExtractProgress((prev) => [...prev, `Extracting ${docType.name} from ${PORTAL_CONFIG[docType.portal]?.name || docType.portal}...`]);
        await new Promise((r) => setTimeout(r, 600)); // Simulate network latency
      }

      // Actual API call
      const res = await fetch("/api/verify/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aadhaarNumber: aadhaarNum }),
      });

      const data = await res.json();

      if (data.success && data.documents) {
        const extractedDocs = data.documents.map((doc: Record<string, string & Record<string, string>> & { type: string }) =>
          extractDataToDoc(doc, aadhaarStatus?.aadhaarVerified || false)
        );
        setDocuments((prev) => {
          const existingTypes = new Set(prev.map((d) => d.type));
          const newDocs = extractedDocs.filter((d: Document) => !existingTypes.has(d.type));
          return [...prev, ...newDocs];
        });
        setDocumentsExtracted(true);
        setExtractProgress((prev) => [...prev, `✅ Successfully extracted ${data.extractedCount} documents from ${data.portalsSearched?.length || 7} government portals`]);
        setVerifyStep("done");
      } else {
        setExtractProgress((prev) => [...prev, `❌ ${data.message || "Extraction failed"}`]);
      }
    } catch {
      setExtractProgress((prev) => [...prev, "❌ Network error. Please try again."]);
    } finally {
      setExtracting(false);
    }
  };

  const handleVerifyAadhaar = async () => {
    if (verifyStep === "input") {
      setVerifyStep("otp");
      setVerifyMessage("Sending OTP to your registered mobile...");
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
          // Auto-extract documents after Aadhaar verification
          setTimeout(() => {
            setShowVerifyModal(false);
            // Trigger document extraction automatically
            setTimeout(() => handleExtractAll(), 500);
          }, 2000);
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
    extracting: { icon: Loader2, label: "Extracting...", color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200" },
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

  // ═══ LOCKED STATE — Aadhaar not verified ═══
  if (!aadhaarStatus?.aadhaarVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Locked State */}
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Documents Vault</h1>
            <p className="text-sm text-gray-500 mb-2">मेरे दस्तावेज़ — Secure Document Repository</p>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              To access your documents, you must first verify your identity using Aadhaar.
              This ensures your data is securely linked to your government identity — just like DigiLocker.
            </p>

            <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-lg mx-auto mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Fingerprint className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Aadhaar Verification Required</h3>
                  <p className="text-xs text-gray-500">Verify once, access all your government documents</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-left">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">How it works:</h4>
                <div className="space-y-2">
                  {[
                    { step: "1", text: "Enter your 12-digit Aadhaar number", icon: Fingerprint },
                    { step: "2", text: "OTP sent to your registered mobile", icon: Smartphone },
                    { step: "3", text: "Identity verified via UIDAI", icon: Shield },
                    { step: "4", text: "Documents auto-extracted from government portals", icon: Globe },
                    { step: "5", text: "All documents available in your vault", icon: Unlock },
                  ].map(({ step, text, icon: StepIcon }) => (
                    <div key={step} className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-[10px] font-bold text-blue-700 shrink-0">
                        {step}
                      </div>
                      <StepIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="text-xs text-blue-700">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowVerifyModal(true)}
                className="w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Fingerprint className="w-5 h-5" />
                Verify Aadhaar Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[10px] text-gray-400 max-w-sm mx-auto">
              Your Aadhaar data is verified through UIDAI's secure OTP system. No data is stored permanently.
              All document extraction happens in real-time from official government portals.
            </p>
          </div>

          {/* Verify Modal */}
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
                      Verify &amp; Extract Data
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
                    <p className="text-xs text-gray-500">Extracting documents from government portals...</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
        <GovFooter />
      </div>
    );
  }

  // ═══ VERIFIED STATE — Show documents ═══
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
            <p className="text-sm text-gray-500 mt-1">मेरे दस्तावेज़ — Verified &amp; Extracted from Government Portals</p>
          </div>
          <div className="flex items-center gap-2">
            {!documentsExtracted && (
              <button
                onClick={handleExtractAll}
                disabled={extracting}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {extracting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                Extract All Documents
              </button>
            )}
          </div>
        </div>

        {/* Aadhaar Verified Banner */}
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
                Your identity has been verified through UIDAI. Documents are extracted from official government portals in real-time.
                No manual uploads needed — your data flows directly from the source.
              </p>
              <div className="flex items-center gap-3 text-[10px] text-green-600">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Aadhaar verified via OTP</span>
                <span>|</span>
                <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {documents.length} documents extracted</span>
                <span>|</span>
                <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Verified: {new Date(aadhaarStatus.verifiedAt!).toLocaleDateString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Chain */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <h3 className="text-xs font-semibold text-gray-600 mb-3">📋 Verification Chain</h3>
          <div className="flex items-center gap-2 text-xs overflow-x-auto pb-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-green-700 shrink-0">
              <Shield className="w-3.5 h-3.5" />
              Aadhaar Verified
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-blue-700 shrink-0">
              <Globe className="w-3.5 h-3.5" />
              Portals Connected
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full text-purple-700 shrink-0">
              <Zap className="w-3.5 h-3.5" />
              Data Extracted
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF9933]/10 border border-[#FF9933]/20 rounded-full text-[#FF9933] shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Reused Across Services
            </div>
          </div>
        </div>

        {/* Government Portal Status */}
        {documentsExtracted && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-600">🏛️ Connected Government Portals</h3>
              <button
                onClick={handleExtractAll}
                disabled={extracting}
                className="text-[10px] px-2 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${extracting ? "animate-spin" : ""}`} />
                Refresh All
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(PORTAL_CONFIG).map(([key, portal]) => {
                const hasDoc = documents.some((d) => d.portal === key);
                const PortalIcon = portal.icon;
                return (
                  <div
                    key={key}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-xs transition-colors ${
                      hasDoc ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <PortalIcon className={`w-4 h-4 ${hasDoc ? "text-green-600" : "text-gray-400"}`} />
                    <div className="min-w-0">
                      <p className={`font-medium truncate ${hasDoc ? "text-green-800" : "text-gray-500"}`}>{portal.name.split("(")[0].trim()}</p>
                      <p className="text-[9px] text-gray-400">{hasDoc ? "Connected" : "Not connected"}</p>
                    </div>
                    {hasDoc && <CheckCircle2 className="w-3 h-3 text-green-600 shrink-0" />}
                  </div>
                );
              })}
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
              {!documentsExtracted ? "Click 'Extract All Documents' to pull from government portals" : "Try a different search or category"}
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
                        <StIcon className={`w-3 h-3 ${doc.verificationStatus === "extracting" ? "animate-spin" : ""}`} />
                        {st.label}
                      </span>
                      <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${src.bg} ${src.color} ${src.border}`}>
                        <SrcIcon className="w-3 h-3" />
                        {src.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {doc.fileName} • {doc.fileSize} • {new Date(doc.uploadedAt).toLocaleDateString("en-IN")}
                      {doc.verificationId && ` • ID: ${doc.verificationId}`}
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

        {/* Available for Extraction */}
        {!documentsExtracted && aadhaarStatus?.aadhaarVerified && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Documents Available for Extraction</h2>
            <p className="text-xs text-gray-500 mb-4">Click below to extract each document from its official government portal</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {EXTRACTABLE_DOCS.map((docType) => {
                const isExtracted = documents.some((d) => d.type === docType.type);
                const portal = PORTAL_CONFIG[docType.portal];
                const DocIcon = docType.icon;
                return (
                  <div
                    key={docType.type}
                    className={`bg-white rounded-lg border p-3 transition-colors ${
                      isExtracted ? "border-green-200 bg-green-50/30" : "border-gray-200 hover:border-[#FF9933]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-gray-700">{docType.name}</p>
                      {isExtracted && <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />}
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <DocIcon className="w-3 h-3 text-gray-400" />
                      <p className="text-[9px] text-gray-400">{portal?.name || docType.portal}</p>
                    </div>
                    {!isExtracted && (
                      <p className="text-[9px] text-amber-600">⚠️ Not yet extracted</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Extraction Progress Modal */}
      {showExtractModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Document Extraction</h3>
              </div>
              {verifyStep === "done" && (
                <button onClick={() => { setShowExtractModal(false); setExtractProgress([]); }} className="p-1 text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-blue-700">
                Connecting to {EXTRACTABLE_DOCS.length} government portals and extracting your verified documents...
              </p>
            </div>

            <div className="space-y-1.5 mb-4 max-h-60 overflow-y-auto">
              {extractProgress.map((msg, i) => (
                <div key={i} className={`text-xs px-3 py-1.5 rounded-lg ${msg.startsWith("✅") ? "bg-green-50 text-green-700" : msg.startsWith("❌") ? "bg-red-50 text-red-700" : "bg-gray-50 text-gray-600"}`}>
                  {msg}
                </div>
              ))}
              {extracting && (
                <div className="flex items-center gap-2 text-xs text-blue-600 px-3 py-1.5">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Connecting to next portal...
                </div>
              )}
            </div>

            {verifyStep === "done" && (
              <button
                onClick={() => { setShowExtractModal(false); setExtractProgress([]); window.location.reload(); }}
                className="w-full py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                View My Documents
              </button>
            )}
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
            <div className="flex items-center gap-2 mb-4 flex-wrap">
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
              {selectedDoc.verificationId && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  ID: {selectedDoc.verificationId}
                </span>
              )}
            </div>

            {/* Portal Source */}
            {selectedDoc.portal && PORTAL_CONFIG[selectedDoc.portal] && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {(() => { const PIcon = PORTAL_CONFIG[selectedDoc.portal].icon; return <PIcon className="w-4 h-4 text-gray-600" />; })()}
                    <div>
                      <p className="text-xs font-medium text-gray-700">Extracted from {PORTAL_CONFIG[selectedDoc.portal].name}</p>
                      <p className="text-[10px] text-gray-400">Official government portal</p>
                    </div>
                  </div>
                  <a
                    href={PORTAL_CONFIG[selectedDoc.portal].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] px-2 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors flex items-center gap-1"
                  >
                    Visit Portal <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* Extracted Data */}
            {selectedDoc.extractedData && Object.keys(selectedDoc.extractedData).length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">
                  {selectedDoc.source === "aadhaar" ? "Data Extracted from Aadhaar (UIDAI)" : `Data Extracted from ${selectedDoc.portal && PORTAL_CONFIG[selectedDoc.portal] ? PORTAL_CONFIG[selectedDoc.portal].name : "Government Portal"}`}
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
              {selectedDoc.source !== "aadhaar" && selectedDoc.source !== "extracted" && (
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
