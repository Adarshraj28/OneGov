"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/header";
import GovFooter from "@/components/gov-footer";
import { Shield, FileText, Eye, Accessibility, Scale } from "lucide-react";

function PoliciesContent() {
  const searchParams = useSearchParams();
  const section = searchParams.get("section") || "all";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Website Policies</h1>
          <p className="text-sm text-gray-500 mt-1">वेबसाइट नीतियाँ — Terms, Privacy, RTI, and Accessibility</p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: "terms", label: "Terms & Conditions", icon: Scale },
            { id: "privacy", label: "Privacy Policy", icon: Shield },
            { id: "rti", label: "Right to Information", icon: FileText },
            { id: "accessibility", label: "Accessibility", icon: Accessibility },
            { id: "copyright", label: "Copyright", icon: Eye },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-[#FF9933] hover:text-[#FF9933] transition-colors"
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </a>
            );
          })}
        </div>

        {/* Terms & Conditions */}
        {(section === "all" || section === "terms") && (
          <section id="terms" className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#FF9933]" />
              Terms &amp; Conditions
            </h2>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p><strong>1. Acceptance of Terms:</strong> By accessing and using ONEGOV (onegov.gov.in), you agree to be bound by these Terms and Conditions. This is a government digital platform developed under SIH Problem Statement 26129.</p>
              <p><strong>2. Purpose:</strong> ONEGOV serves as an interoperability and orchestration layer connecting citizens with multiple government departments. It does not replace official government portals.</p>
              <p><strong>3. User Responsibilities:</strong> Users must provide accurate information. Misuse of the platform, including providing false information or attempting to exploit system vulnerabilities, is prohibited.</p>
              <p><strong>4. Service Availability:</strong> While we strive for continuous availability, ONEGOV does not guarantee uninterrupted access. Scheduled maintenance windows will be communicated in advance.</p>
              <p><strong>5. External Links:</strong> ONEGOV may contain links to external government portals. The content of external websites is not controlled by ONEGOV.</p>
              <p><strong>6. Limitation of Liability:</strong> ONEGOV facilitates the application process but is not responsible for decisions made by government departments regarding applications.</p>
              <p><strong>7. Governing Law:</strong> These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in New Delhi.</p>
            </div>
          </section>
        )}

        {/* Privacy Policy */}
        {(section === "all" || section === "privacy") && (
          <section id="privacy" className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#FF9933]" />
              Privacy Policy
            </h2>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p><strong>1. Data Collection:</strong> ONEGOV collects personal information (name, Aadhaar, PAN, address, contact details) only as required for processing government service applications.</p>
              <p><strong>2. Consent-Based Sharing:</strong> Your data is shared with government departments only with your explicit consent. You can review and revoke consent at any time through the Consent Management panel.</p>
              <p><strong>3. Data Protection:</strong> All data is transmitted using industry-standard encryption (TLS 1.3). Sensitive fields are encrypted at rest. Access is controlled through role-based access control (RBAC).</p>
              <p><strong>4. Data Retention:</strong> User data is retained for the duration of active service journeys and as required by government record-keeping policies.</p>
              <p><strong>5. Third-Party Sharing:</strong> Data is shared only with authorized government departments for the specific purpose of processing your application. No data is shared with commercial third parties.</p>
              <p><strong>6. Your Rights:</strong> You have the right to access your data, correct inaccuracies, and request deletion of non-essential data. Contact the Data Protection Officer at dpo@onegov.gov.in.</p>
              <p><strong>7. Cookies:</strong> ONEGOV uses essential session cookies for authentication. No tracking or advertising cookies are used.</p>
              <p><strong>8. Audit Trail:</strong> All data access and sharing events are logged for transparency and accountability.</p>
            </div>
          </section>
        )}

        {/* Right to Information */}
        {(section === "all" || section === "rti") && (
          <section id="rti" className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#FF9933]" />
              Right to Information (RTI)
            </h2>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p>In compliance with the <strong>Right to Information Act, 2005</strong>, the following information is disclosed:</p>
              <p><strong>1. Nodal Officer:</strong> The designated Nodal Officer for RTI requests is the System Administrator, ONEGOV Platform, Ministry of Electronics &amp; Information Technology.</p>
              <p><strong>2. How to File RTI:</strong> RTI applications can be filed online through <a href="https://rtionline.gov.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">rtionline.gov.in</a> or addressed to the CPIO, MeitY, Electronics Niketan, CGO Complex, New Delhi — 110003.</p>
              <p><strong>3. Fee:</strong> RTI application fee is ₹10 (postage/court fee). No fee for BPL applicants.</p>
              <p><strong>4. Response Time:</strong> Information will be provided within 30 days of receipt of the application.</p>
              <p><strong>5. Appeals:</strong> First appeal to the Appellate Authority, MeitY. Second appeal to the Central Information Commission.</p>
              <p><strong>6. Proactive Disclosure:</strong> In accordance with Section 4 of the RTI Act, the following information is proactively disclosed on this platform.</p>
            </div>
            <a
              href="https://rtionline.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
            >
              File RTI Application →
            </a>
          </section>
        )}

        {/* Accessibility */}
        {(section === "all" || section === "accessibility") && (
          <section id="accessibility" className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Accessibility className="w-5 h-5 text-[#FF9933]" />
              Accessibility Statement
            </h2>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p>ONEGOV is committed to ensuring digital accessibility for all citizens, including persons with disabilities. This platform aims to comply with the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong> and the <strong>Government of India Website Standards</strong>.</p>
              <p><strong>Features Implemented:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Semantic HTML structure with proper heading hierarchy</li>
                <li>Keyboard navigation support for all interactive elements</li>
                <li>Sufficient color contrast ratios (minimum 4.5:1)</li>
                <li>Multi-language support (10 Indian languages)</li>
                <li>Screen reader compatible labels and ARIA attributes</li>
                <li>Responsive design for mobile and tablet devices</li>
                <li>Text resizing support up to 200% without loss of functionality</li>
              </ul>
              <p><strong>Feedback:</strong> If you encounter accessibility barriers, please contact us at accessibility@onegov.gov.in or call the toll-free helpline at 1800-11-0031.</p>
            </div>
          </section>
        )}

        {/* Copyright */}
        {(section === "all" || section === "copyright") && (
          <section id="copyright" className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#FF9933]" />
              Copyright Notice
            </h2>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p>© {new Date().getFullYear()} Government of India. All rights reserved.</p>
              <p>Content on this website is owned by the Ministry of Electronics &amp; Information Technology (MeitY), Government of India, unless otherwise indicated.</p>
              <p>This is a prototype platform developed for <strong>Smart India Hackathon 2026 — Problem Statement SIH26129</strong>.</p>
              <p>Reproduction or distribution of content without prior permission is prohibited, except as permitted under applicable laws.</p>
            </div>
          </section>
        )}

        {/* Last Updated */}
        <div className="text-center text-xs text-gray-400 py-4">
          Page last updated on: {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
        </div>
      </main>
      <GovFooter />
    </div>
  );
}

export default function PoliciesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>}>
      <PoliciesContent />
    </Suspense>
  );
}
