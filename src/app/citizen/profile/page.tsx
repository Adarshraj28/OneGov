"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import {
  CheckCircle2,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Building2,
  Loader2,
  FileText,
  ArrowRight,
  Info,
} from "lucide-react";

interface ProfileData {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    profile?: {
      address: string;
      city: string;
      state: string;
      pincode: string;
      dateOfBirth: string;
      panNumber: string;
      aadhaarNumber: string;
      gstNumber: string;
      businessName: string;
      businessType: string;
    };
  };
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

export default function CitizenProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData["user"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) setProfile(data.user);
        else router.push("/login");
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

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

  const p = profile.profile;

  const ProfileField = ({
    icon: Icon,
    label,
    value,
    verified,
    fieldName,
  }: {
    icon: typeof User;
    label: string;
    value?: string;
    verified?: boolean;
    fieldName?: string;
  }) => {
    const usage = fieldName ? FIELD_USAGE[fieldName] : undefined;
    const usageCount = usage?.length || 0;

    return (
      <div className="py-3 border-b border-gray-100 last:border-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">{label}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">
              {value || "—"}
            </span>
            {verified && (
              <CheckCircle2 className="w-4 h-4 text-[#138808]" />
            )}
          </div>
        </div>
        {usage && usageCount > 0 && (
          <div className="ml-7 mt-1.5">
            <p className="text-[10px] text-gray-400">
              Reused across {usageCount} service{usageCount > 1 ? "s" : ""}:{" "}
              {usage.map((u) => u.service).join(", ")}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Banner */}
        <div className="bg-[#FF9933]/5 border border-[#FF9933]/20 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-[#FF9933] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-900">Demo / Mock Data</p>
            <p className="text-xs text-gray-600 mt-1">
              This is prototype data for SIH 26129 demonstration. In production, profile data
              would be verified through government databases (Aadhaar, PAN, etc.).
            </p>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          My Profile
        </h1>

        {/* Personal Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Personal Information
          </h2>
          <div className="space-y-0">
            <ProfileField
              icon={User}
              label="Full Name"
              value={profile.name}
              verified
              fieldName="name"
            />
            <ProfileField
              icon={Mail}
              label="Email"
              value={profile.email}
              verified
            />
            <ProfileField
              icon={Phone}
              label="Phone"
              value={profile.phone}
              verified
            />
            <ProfileField
              icon={MapPin}
              label="Address"
              value={p?.address}
              fieldName="address"
            />
            <ProfileField icon={MapPin} label="City" value={p?.city} />
            <ProfileField icon={MapPin} label="State" value={p?.state} />
            <ProfileField icon={MapPin} label="Pincode" value={p?.pincode} />
            <ProfileField
              icon={User}
              label="Date of Birth"
              value={p?.dateOfBirth}
              fieldName="dateOfBirth"
            />
          </div>
        </div>

        {/* Business Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Business Information
          </h2>
          <div className="space-y-0">
            <ProfileField
              icon={Building2}
              label="Business Name"
              value={p?.businessName}
              fieldName="businessName"
            />
            <ProfileField
              icon={Building2}
              label="Business Type"
              value={p?.businessType?.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
            />
            <ProfileField
              icon={CreditCard}
              label="PAN Number"
              value={p?.panNumber ? `${p.panNumber.slice(0, 4)}${"X".repeat(p.panNumber.length - 8)}${p.panNumber.slice(-4)}` : undefined}
              verified
              fieldName="panNumber"
            />
          </div>
        </div>

        {/* Data Reuse Explanation */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            📋 Data Reuse Summary
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            ONEGOV reuses your profile data across all service journeys. You only need to enter
            information once — it&apos;s automatically shared (with your consent) to relevant government services.
          </p>
          <div className="space-y-3">
            {Object.entries(FIELD_USAGE).map(([field, services]) => {
              const fieldValue = p?.[field as keyof typeof p];
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
            🇮🇳 Smart Profile
          </p>
          <p className="text-blue-200 text-sm mt-2">
            Your data is reused across government services — enter once, use everywhere.
          </p>
          <p className="text-blue-300 text-xs mt-1">
            Consent-based sharing • Audit logged • You control what&apos;s shared
          </p>
        </div>
      </main>
    </div>
  );
}
