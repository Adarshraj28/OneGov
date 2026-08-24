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
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
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
  }: {
    icon: typeof User;
    label: string;
    value?: string;
    verified?: boolean;
  }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-900">
          {value || "—"}
        </span>
        {verified && (
          <CheckCircle2 className="w-4 h-4 text-green-600" />
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            />
            <ProfileField
              icon={MapPin}
              label="City"
              value={p?.city}
            />
            <ProfileField
              icon={MapPin}
              label="State"
              value={p?.state}
            />
            <ProfileField
              icon={MapPin}
              label="Pincode"
              value={p?.pincode}
            />
          </div>
        </div>

        {/* Business Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Business Information
          </h2>
          <div className="space-y-0">
            <ProfileField
              icon={Building2}
              label="Business Name"
              value={p?.businessName}
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
            />
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <strong>Smart Profile:</strong> ONEGOV reuses your profile data across
            all service journeys. You only need to enter information once.
          </p>
        </div>
      </main>
    </div>
  );
}
