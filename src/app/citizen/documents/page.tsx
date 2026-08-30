"use client";

import { useState, useRef } from "react";
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
  Filter,
  FolderOpen,
  X,
  Camera,
  CreditCard,
  Fingerprint,
  Building2,
  MapPin,
} from "lucide-react";

interface Document {
  id: string;
  type: string;
  name: string;
  fileName: string;
  fileSize: string;
  verificationStatus: "verified" | "pending" | "rejected" | "uploaded";
  category: string;
  uploadedAt: string;
  extractedData?: Record<string, string>;
  usedIn?: string[];
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

// Initial demo documents (DigiLocker-style)
const INITIAL_DOCS: Document[] = [
  {
    id: "doc-1",
    type: "aadhaar",
    name: "Aadhaar Card",
    fileName: "aadhaar_4521.pdf",
    fileSize: "245 KB",
    verificationStatus: "verified",
    category: "identity",
    uploadedAt: "2026-08-10T10:00:00Z",
    extractedData: { name: "Adarsh Raj", aadhaar: "XXXX XXXX 3456", dob: "14/07/1992", gender: "Male" },
    usedIn: ["Business Registration", "Passport Application", "GST Registration"],
  },
  {
    id: "doc-2",
    type: "pan",
    name: "PAN Card",
    fileName: "pan_AXPRR4521M.jpg",
    fileSize: "180 KB",
    verificationStatus: "verified",
    category: "identity",
    uploadedAt: "2026-08-12T14:30:00Z",
    extractedData: { name: "ADARSH RAJ", pan: "AXXXX4521M", dob: "14/07/1992", fatherName: "SURESH RAJ" },
    usedIn: ["GST Registration", "Business Registration", "Food License"],
  },
  {
    id: "doc-3",
    type: "address_proof",
    name: "Electricity Bill (Address Proof)",
    fileName: "electricity_bill_aug2026.pdf",
    fileSize: "320 KB",
    verificationStatus: "verified",
    category: "address",
    uploadedAt: "2026-08-15T09:00:00Z",
    extractedData: { name: "Adarsh Raj", address: "42, MG Road, Near Deccan Gymkhana", city: "Pune", pincode: "411004" },
    usedIn: ["Passport Application", "Driving License"],
  },
  {
    id: "doc-4",
    type: "business_cert",
    name: "Certificate of Incorporation",
    fileName: "incorporation_cert.pdf",
    fileSize: "1.2 MB",
    verificationStatus: "verified",
    category: "business",
    uploadedAt: "2026-08-18T11:00:00Z",
    extractedData: { cin: "U56100MH2024PTC123456", company: "Adarsh Food Hub Pvt. Ltd.", date: "15/03/2024" },
    usedIn: ["GST Registration", "FSSAI License"],
  },
];

const DOC_TYPES = [
  { type: "aadhaar", name: "Aadhaar Card", category: "identity", requiredFor: ["All government services"] },
  { type: "pan", name: "PAN Card", category: "identity", requiredFor: ["GST", "Business Registration"] },
  { type: "address_proof", name: "Address Proof", category: "address", requiredFor: ["Passport", "Driving License", "Voter ID"] },
  { type: "business_cert", name: "Business Certificate", category: "business", requiredFor: ["FSSAI License", "Municipal Permission"] },
  { type: "photograph", name: "Passport Photo", category: "identity", requiredFor: ["Passport", "Driving License", "Voter ID"] },
  { type: "income_proof", name: "Income Proof", category: "financial", requiredFor: ["Income Certificate", "Subsidies"] },
];

export default function CitizenDocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCS);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    // Simulate upload + verification
    setTimeout(() => {
      const docType = DOC_TYPES.find((d) => d.type === typeName);
      if (!docType) return;

      const newDoc: Document = {
        id: `doc-${Date.now()}`,
        type: docType.type,
        name: docType.name,
        fileName: `${docType.type}_upload_${Date.now()}.pdf`,
        fileSize: `${Math.floor(Math.random() * 500 + 100)} KB`,
        verificationStatus: "verified",
        category: docType.category,
        uploadedAt: new Date().toISOString(),
        extractedData: { status: "Auto-verified by DigiLocker" },
        usedIn: docType.requiredFor,
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
    pending: { icon: Clock, label: "Pending", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
    uploaded: { icon: Clock, label: "Uploaded", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
    rejected: { icon: AlertCircle, label: "Rejected", color: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
            <p className="text-sm text-gray-500 mt-1">मेरे दस्तावेज़ — Upload, verify, and reuse across all government services</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        </div>

        {/* DigiLocker-style Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-800">
                🔐 Document Intelligence — DigiLocker Integration
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Upload your documents once. ONEGOV extracts and verifies relevant information, then reuses it across all your service journeys.
                Sensitive data (Aadhaar, PAN) is masked and protected. You control what&apos;s shared.
              </p>
            </div>
          </div>
        </div>

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
                  selectedCategory === cat
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {cat === "all" ? `All (${categoryCounts.all})` :
                 cat.charAt(0).toUpperCase() + cat.slice(1) + ` (${categoryCounts[cat]})`}
              </button>
            ))}
          </div>
        </div>

        {/* Documents Grid */}
        {filteredDocs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No documents found</p>
            <p className="text-xs text-gray-400 mt-1">
              {documents.length === 0 ? "Upload your first document to get started" : "Try a different search or category"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDocs.map((doc) => {
              const catColors = CATEGORY_COLORS[doc.category] || CATEGORY_COLORS.other;
              const CatIcon = CATEGORY_ICONS[doc.category] || FileText;
              const st = statusConfig[doc.verificationStatus];
              const StIcon = st.icon;

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
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                      <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${st.bg} ${st.color} ${st.border}`}>
                        <StIcon className="w-3 h-3" />
                        {st.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {doc.fileName} • {doc.fileSize} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString("en-IN")}
                    </p>
                    {doc.usedIn && doc.usedIn.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {doc.usedIn.map((service) => (
                          <span key={service} className="text-[9px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                            Used in: {service}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Supported Document Types */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Supported Document Types</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {DOC_TYPES.map((docType) => {
              const isUploaded = documents.some((d) => d.type === docType.type);
              const catColors = CATEGORY_COLORS[docType.category] || CATEGORY_COLORS.other;
              return (
                <div
                  key={docType.type}
                  className={`bg-white rounded-lg border p-4 transition-colors ${
                    isUploaded ? "border-green-200 bg-green-50/30" : "border-gray-200 hover:border-[#FF9933]/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">{docType.name}</p>
                    {isUploaded && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Required for: {docType.requiredFor.join(", ")}
                  </p>
                  {!isUploaded && (
                    <button
                      onClick={() => handleUpload(docType.type)}
                      disabled={uploading}
                      className="mt-2 text-[10px] px-2 py-1 bg-blue-900 text-white rounded font-medium hover:bg-blue-800 transition-colors disabled:opacity-50"
                    >
                      {uploading ? "Uploading..." : "Upload Now"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

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

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
              className={`border-2 border-dashed rounded-xl p-8 text-center mb-4 transition-colors ${
                dragOver ? "border-[#FF9933] bg-[#FF9933]/5" : "border-gray-300"
              }`}
            >
              <Camera className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-600">Drag & drop or click to upload</p>
              <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 5MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={() => {}}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Choose File
              </button>
            </div>

            {/* Quick upload by type */}
            <p className="text-xs text-gray-500 mb-2">Or upload by document type:</p>
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

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className={`font-medium ${statusConfig[selectedDoc.verificationStatus].color}`}>
                  {statusConfig[selectedDoc.verificationStatus].label}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">File</span>
                <span className="text-gray-900">{selectedDoc.fileName}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Size</span>
                <span className="text-gray-900">{selectedDoc.fileSize}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Uploaded</span>
                <span className="text-gray-900">{new Date(selectedDoc.uploadedAt).toLocaleDateString("en-IN")}</span>
              </div>
            </div>

            {selectedDoc.extractedData && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">Extracted Data</p>
                <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                  {Object.entries(selectedDoc.extractedData).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                      <span className="text-gray-900 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedDoc.usedIn && selectedDoc.usedIn.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">Used In Services</p>
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
              <button
                onClick={() => handleDelete(selectedDoc.id)}
                className="flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <GovFooter />
    </div>
  );
}
