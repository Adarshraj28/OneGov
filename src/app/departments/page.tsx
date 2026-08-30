"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/header";
import GovFooter from "@/components/gov-footer";
import {
  Building2,
  Shield,
  BookOpen,
  Car,
  Vote,
  Flame,
  UtensilsCrossed,
  Fingerprint,
  IndianRupee,
  Home,
  ScrollText,
  ExternalLink,
} from "lucide-react";

const DEPARTMENTS = [
  {
    name: "Ministry of Corporate Affairs",
    code: "MCA",
    icon: Building2,
    color: "blue",
    description: "Handles business registration, company incorporation, compliance filings, and corporate governance across India.",
    services: ["Business Registration", "Company Incorporation", "Annual Returns", "DIN Application"],
    website: "https://www.mca.gov.in",
    contact: "1800-11-0031",
    address: "Aastha Darshan, 6th Floor, B-3 Wing, IFCI Tower, 61 Nehru Place, New Delhi",
  },
  {
    name: "Food Safety and Standards Authority",
    code: "FSSAI",
    icon: UtensilsCrossed,
    color: "green",
    description: "Ensures food safety standards across India. Issues FSSAI licenses for food businesses.",
    services: ["FSSAI License", "FSSAI Registration", "Food Safety Compliance", "Product Approval"],
    website: "https://www.fssai.gov.in",
    contact: "1800-11-2100",
    address: "Food Safety and Standards Authority of India, FDA Bhawan, Kotla Road, New Delhi",
  },
  {
    name: "Unique Identification Authority of India",
    code: "UIDAI",
    icon: Fingerprint,
    color: "cyan",
    description: "Issues Aadhaar numbers and manages the world's largest biometric identity system.",
    services: ["Aadhaar Enrollment", "Aadhaar Update", "Biometric Update", "Aadhaar Verification"],
    website: "https://uidai.gov.in",
    contact: "1947",
    address: "Unique Identification Authority of India, Bangla Sahib Road, New Delhi",
  },
  {
    name: "Income Tax Department",
    code: "ITD",
    icon: IndianRupee,
    color: "purple",
    description: "Manages direct tax collection, PAN card issuance, and tax compliance in India.",
    services: ["PAN Card Application", "PAN Correction", "Tax Filing", "GST Registration"],
    website: "https://www.incometax.gov.in",
    contact: "1800-103-0031",
    address: "Income Tax Department, North Block, Central Secretariat, New Delhi",
  },
  {
    name: "Ministry of External Affairs — Passport Seva",
    code: "MEA",
    icon: BookOpen,
    color: "blue",
    description: "Issues Indian passports and manages consular services for citizens abroad.",
    services: ["New Passport", "Passport Renewal", "Tatkal Passport", "Police Verification"],
    website: "https://www.passportindia.gov.in",
    contact: "1800-258-1800",
    address: "Passport Seva, Ministry of External Affairs, Patpuri, New Delhi",
  },
  {
    name: "Ministry of Road Transport & Highways",
    code: "MORTH",
    icon: Car,
    color: "orange",
    description: "Manages driving licenses, vehicle registration, and road transport services via Parivahan.",
    services: ["Driving License", "Vehicle Registration", "RC Transfer", "Fancy Number"],
    website: "https://parivahan.gov.in",
    contact: "1800-11-0031",
    address: "Parivahan Bhawan, 1, Motilal Nehru Marg, New Delhi",
  },
  {
    name: "Election Commission of India",
    code: "ECI",
    icon: Vote,
    color: "green",
    description: "Conducts elections across India and manages voter registration through NVSP.",
    services: ["Voter Registration", "Voter ID Correction", "Address Change", "New Voter ID"],
    website: "https://www.nvsp.in",
    contact: "1800-111-1111",
    address: "Nirvachan Sadan, Ashoka Road, New Delhi",
  },
  {
    name: "Municipal Corporation",
    code: "MUNICIPAL",
    icon: Building2,
    color: "slate",
    description: "Local government body managing civic services, permissions, birth/death certificates, and property records.",
    services: ["Municipal Permission", "Birth Certificate", "Death Certificate", "Property Tax"],
    website: "https://www.india.gov.in",
    contact: "1800-233-1234",
    address: "Municipal Corporation Office, City Centre, Pune — 411001",
  },
  {
    name: "Fire Department",
    code: "FIRE",
    icon: Flame,
    color: "red",
    description: "Issues Fire Safety No Objection Certificates (NOC) for commercial establishments.",
    services: ["Fire Safety NOC", "Fire Audit", "Emergency Response", "Safety Training"],
    website: "https://www.india.gov.in",
    contact: "101",
    address: "Fire Station Road, Pune — 411001",
  },
  {
    name: "Revenue Department",
    code: "REVENUE",
    icon: ScrollText,
    color: "amber",
    description: "Issues income certificates, caste certificates, and manages land records.",
    services: ["Income Certificate", "Caste Certificate", "Land Records (7/12)", "Property Registration"],
    website: "https://www.india.gov.in",
    contact: "1800-120-8040",
    address: "Revenue Department, Collectorate Office, Pune — 411001",
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  green: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  cyan: { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
  purple: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  slate: { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" },
  red: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  amber: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
};

export default function DepartmentsPage() {
  const router = useRouter();

  useEffect(() => {
    // Check auth
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user) router.push("/login");
      })
      .catch(() => router.push("/login"));
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Department Directory</h1>
              <p className="text-sm text-gray-500">विभाग निर्देशिका — Government departments connected via ONEGOV interoperability framework</p>
            </div>
          </div>
          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <strong>One Platform, Multiple Departments.</strong> ONEGOV connects citizens with {DEPARTMENTS.length}+ government departments
              through a unified interoperability framework — so you don&apos;t have to visit multiple portals.
            </p>
          </div>
        </div>

        {/* Departments Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {DEPARTMENTS.map((dept) => {
            const colors = colorMap[dept.color] || colorMap.blue;
            const Icon = dept.icon;
            return (
              <div
                key={dept.code}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colors.bg}`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-base font-semibold text-gray-900">{dept.name}</h2>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${colors.bg} ${colors.text} border ${colors.border}`}>
                        {dept.code}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{dept.description}</p>

                    {/* Services */}
                    <div className="mb-3">
                      <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-1">Services Available</p>
                      <div className="flex flex-wrap gap-1">
                        {dept.services.map((svc) => (
                          <span key={svc} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                            {svc}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-500">
                      <span>📞 {dept.contact}</span>
                      <a href={dept.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                        🌐 Official Portal <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-[#FF9933]/5 border border-[#FF9933]/20 rounded-xl p-4">
          <p className="text-xs text-gray-700">
            <strong>🧪 Demo Mode:</strong> Department data shown above is for SIH 26129 prototype demonstration.
            In production, service availability and department information would be sourced from verified government databases.
          </p>
        </div>
      </main>
      <GovFooter />
    </div>
  );
}
