"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import GovFooter from "@/components/gov-footer";
import {
  CheckCircle2,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Building2,
  Loader2,
  Edit3,
  Save,
  X,
  Shield,
  Calendar,
  Users,
  Briefcase,
  Fingerprint,
  FileText,
  BookOpen,
  Car,
  Vote,
  Info,
} from "lucide-react";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  profile?: Record<string, string | null>;
}

// Which services use which profile fields
const FIELD_USAGE: Record<string, { service: string; department: string }[]> = {
  name: [
    { service: "Business Registration", department: "MCA" },
    { service: "GST Registration", department: "Income Tax" },
    { service: "Food License", department: "FSSAI" },
    { service: "Passport", department: "MEA" },
    { service: "Driving License", department: "Parivahan" },
  ],
  address: [
    { service: "Business Registration", department: "MCA" },
    { service: "Municipal Permission", department: "Municipal Corp" },
    { service: "Passport", department: "MEA" },
    { service: "Driving License", department: "Parivahan" },
  ],
  aadhaarNumber: [
    { service: "PAN Card", department: "Income Tax" },
    { service: "Passport", department: "MEA" },
    { service: "Bank Account", department: "Various Banks" },
  ],
  panNumber: [
    { service: "GST Registration", department: "Income Tax" },
    { service: "Food License", department: "FSSAI" },
    { service: "Business Registration", department: "MCA" },
  ],
  dateOfBirth: [
    { service: "Passport", department: "MEA" },
    { service: "Driving License", department: "Parivahan" },
    { service: "Voter ID", department: "ECI" },
  ],
  businessName: [
    { service: "Business Registration", department: "MCA" },
    { service: "GST Registration", department: "Income Tax" },
    { service: "Food License", department: "FSSAI" },
    { service: "Municipal Permission", department: "Municipal Corp" },
  ],
};

function maskValue(field: string, value: string): string {
  if (field === "aadhaarNumber") {
    return value.replace(/\d{4}\s?\d{4}\s?(\d{4})/, "XXXX XXXX $1");
  }
  if (field === "panNumber") {
    return value.slice(0, 2) + "XXXX" + value.slice(-4);
  }
  if (field === "gstNumber") {
    return value.slice(0, 2) + "XXXX" + value.slice(-8);
  }
  if (field === "voterId") {
    return value.slice(0, 3) + "XXXX" + value.slice(-4);
  }
  if (field === "passportNumber") {
    return value.slice(0, 1) + "XXXX" + value.slice(-3);
  }
  if (field === "drivingLicense") {
    return value.slice(0, 6) + "XXX" + value.slice(-3);
  }
  return value;
}

function ProfileSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof User;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-[#FF9933]" />
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function EditableField({
  label,
  field,
  value,
  type = "text",
  verified = false,
  sensitive = false,
  icon: Icon,
  usage,
  onSave,
  disabled = false,
}: {
  label: string;
  field: string;
  value?: string | null;
  type?: string;
  verified?: boolean;
  sensitive?: boolean;
  icon: typeof User;
  usage?: { service: string; department: string }[];
  onSave: (field: string, value: string) => void;
  disabled?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(field, editValue);
    setSaving(false);
    setEditing(false);
  };

  const displayValue = sensitive && value ? maskValue(field, value) : value;

  return (
    <div className="py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Icon className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="text-sm text-gray-500 shrink-0">{label}</span>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                type={type}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-48 px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933]"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") setEditing(false);
                }}
              />
              <button
                onClick={handleSave}
                disabled={saving}
                className="p-1 text-[#138808] hover:bg-[#138808]/10 rounded"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="p-1 text-gray-400 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                {displayValue || <span className="text-gray-400 italic">Not provided</span>}
              </span>
              {verified && (
                <span className="shrink-0 inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 bg-[#138808]/10 text-[#138808] rounded-full font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              )}
              {sensitive && value && (
                <Shield className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              )}
              {!disabled && (
                <button
                  onClick={() => { setEditValue(value || ""); setEditing(true); }}
                  className="p-1 text-gray-400 hover:text-[#FF9933] hover:bg-[#FF9933]/10 rounded transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {usage && usage.length > 0 && !editing && (
        <div className="ml-7 mt-1.5">
          <p className="text-[10px] text-gray-400">
            Reused across {usage.length} service{usage.length > 1 ? "s" : ""}:{" "}
            {usage.map((u) => u.service).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}

export default function CitizenProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingField, setSavingField] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/auth/profile");
      const data = await res.json();
      if (data.user) setProfile(data.user);
      else router.push("/login");
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (field: string, value: string) => {
    setSavingField(field);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, value }),
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.user);
      }
    } catch {
      // silent
    } finally {
      setSavingField(null);
    }
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

  if (!profile) return null;

  const p = profile.profile || {};

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF9933] via-blue-900 to-[#138808] flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-2xl">{getInitials(profile.name)}</span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{profile.email}</span>
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{profile.phone}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-0.5 bg-[#138808]/10 text-[#138808] rounded-full font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Aadhaar Verified
                </span>
                <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> PAN Verified
                </span>
                <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full font-medium">
                  👤 Citizen
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>🔐 Profile Data:</strong> Your information is stored securely and shared only with your explicit consent.
              Sensitive fields (Aadhaar, PAN) are masked and protected.
            </p>
          </div>
        </div>

        {/* Personal Information */}
        <ProfileSection title="Personal Information" icon={User}>
          <EditableField label="Full Name" field="name" value={profile.name} icon={User} verified onSave={handleSave} usage={FIELD_USAGE.name} />
          <EditableField label="Father's Name" field="fatherName" value={p.fatherName} icon={Users} onSave={handleSave} />
          <EditableField label="Mother's Name" field="motherName" value={p.motherName} icon={Users} onSave={handleSave} />
          <EditableField label="Date of Birth" field="dateOfBirth" value={p.dateOfBirth} type="date" icon={Calendar} onSave={handleSave} usage={FIELD_USAGE.dateOfBirth} />
          <EditableField label="Gender" field="gender" value={p.gender} icon={User} onSave={handleSave} />
          <EditableField label="Phone" field="phone" value={profile.phone} icon={Phone} verified onSave={handleSave} />
          <EditableField label="Email" field="email" value={profile.email} icon={Mail} verified onSave={handleSave} disabled />
        </ProfileSection>

        {/* Address */}
        <ProfileSection title="Address" icon={MapPin}>
          <EditableField label="Address" field="address" value={p.address} icon={MapPin} onSave={handleSave} usage={FIELD_USAGE.address} />
          <EditableField label="City" field="city" value={p.city} icon={MapPin} onSave={handleSave} />
          <EditableField label="State" field="state" value={p.state} icon={MapPin} onSave={handleSave} />
          <EditableField label="Pincode" field="pincode" value={p.pincode} icon={MapPin} onSave={handleSave} />
        </ProfileSection>

        {/* Identity Documents */}
        <ProfileSection title="Identity Documents" icon={Shield}>
          <EditableField label="Aadhaar Number" field="aadhaarNumber" value={p.aadhaarNumber} icon={Fingerprint} sensitive verified onSave={handleSave} usage={FIELD_USAGE.aadhaarNumber} />
          <EditableField label="PAN Number" field="panNumber" value={p.panNumber} icon={CreditCard} sensitive verified onSave={handleSave} usage={FIELD_USAGE.panNumber} />
          <EditableField label="Voter ID" field="voterId" value={p.voterId} icon={Vote} sensitive onSave={handleSave} />
          <EditableField label="Passport Number" field="passportNumber" value={p.passportNumber} icon={BookOpen} sensitive onSave={handleSave} />
          <EditableField label="Driving License" field="drivingLicense" value={p.drivingLicense} icon={Car} sensitive onSave={handleSave} />
        </ProfileSection>

        {/* Financial */}
        <ProfileSection title="Financial Information" icon={CreditCard}>
          <EditableField label="GST Number" field="gstNumber" value={p.gstNumber} icon={FileText} sensitive onSave={handleSave} />
          <EditableField label="Annual Income" field="annualIncome" value={p.annualIncome} icon={CreditCard} onSave={handleSave} />
          <EditableField label="Occupation" field="occupation" value={p.occupation} icon={Briefcase} onSave={handleSave} />
        </ProfileSection>

        {/* Business */}
        <ProfileSection title="Business Information" icon={Building2}>
          <EditableField label="Business Name" field="businessName" value={p.businessName} icon={Building2} onSave={handleSave} usage={FIELD_USAGE.businessName} />
          <EditableField label="Business Type" field="businessType" value={p.businessType?.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())} icon={Building2} onSave={handleSave} />
          <EditableField label="CIN Number" field="cinNumber" value={p.cinNumber} icon={FileText} sensitive onSave={handleSave} />
          <EditableField label="Registration Date" field="businessRegDate" value={p.businessRegDate} type="date" icon={Calendar} onSave={handleSave} />
        </ProfileSection>

        {/* Data Reuse Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-[#FF9933]" />
            <h2 className="text-lg font-semibold text-gray-900">Data Reuse Summary</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            ONEGOV reuses your profile data across all service journeys. You only need to enter
            information once — it&apos;s automatically shared (with your consent) to relevant government services.
          </p>
          <div className="space-y-3">
            {Object.entries(FIELD_USAGE).map(([field, services]) => {
              const fieldValue = p[field];
              if (!fieldValue) return null;
              return (
                <div key={field} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#138808]" />
                    <span className="text-xs font-semibold text-gray-700">
                      {field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      → used by {services.length} service{services.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 ml-5">
                    {services.map((s) => (
                      <span
                        key={s.service}
                        className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200"
                      >
                        {s.service}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Smart Profile Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 rounded-xl p-6 text-center">
          <div className="flex justify-center gap-1 mb-3">
            <span className="w-12 h-1 rounded-full bg-[#FF9933]" />
            <span className="w-12 h-1 rounded-full bg-white" />
            <span className="w-12 h-1 rounded-full bg-[#138808]" />
          </div>
          <p className="text-white font-semibold text-lg">
            🇮🇳 Smart Profile — OneGov
          </p>
          <p className="text-blue-200 text-sm mt-2">
            Your data is reused across government services — enter once, use everywhere.
          </p>
          <p className="text-blue-300 text-xs mt-1">
            Consent-based sharing • Audit logged • You control what&apos;s shared
          </p>
        </div>
      </main>
      <GovFooter />
    </div>
  );
}
