"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function GovFooter() {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    // Simulate visitor counter (increments per session)
    const stored = parseInt(sessionStorage.getItem("onegov-visits") || "0");
    const count = 1247893 + stored;
    setVisitorCount(count);
    sessionStorage.setItem("onegov-visits", String(stored + 1));
  }, []);

  return (
    <footer className="bg-[#1e293b] text-gray-300">
      {/* Government of India Bar */}
      <div className="bg-[#0f172a] border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-base">🇮🇳</span>
              <span>An initiative under <strong className="text-white">Digital India</strong> Programme, Ministry of Electronics &amp; Information Technology (MeitY), Government of India</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-500">Last Updated: {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
              <span className="text-gray-500">|</span>
              <span>Visitors: {visitorCount.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">About ONEGOV</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              ONEGOV is India&apos;s unified government-service orchestration platform, connecting citizens with
              multiple government departments through a single interface. Part of the Digital India initiative.
            </p>
            <div className="mt-3 flex items-center gap-1">
              <span className="w-6 h-0.5 rounded-full bg-[#FF9933]" />
              <span className="w-6 h-0.5 rounded-full bg-white" />
              <span className="w-6 h-0.5 rounded-full bg-[#138808]" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Quick Links</h3>
            <ul className="space-y-1.5">
              <li><Link href="/departments" className="text-xs text-gray-400 hover:text-white transition-colors">Department Directory</Link></li>
              <li><Link href="/track" className="text-xs text-gray-400 hover:text-white transition-colors">Track Application</Link></li>
              <li><Link href="/citizen" className="text-xs text-gray-400 hover:text-white transition-colors">Citizen Services</Link></li>
              <li><Link href="/login" className="text-xs text-gray-400 hover:text-white transition-colors">Official Login</Link></li>
              <li><Link href="/admin/interoperability" className="text-xs text-gray-400 hover:text-white transition-colors">Interoperability Framework</Link></li>
            </ul>
          </div>

          {/* Government Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Government Portals</h3>
            <ul className="space-y-1.5">
              <li><a href="https://digitalindia.gov.in" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-white transition-colors">Digital India</a></li>
              <li><a href="https://meity.gov.in" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-white transition-colors">MeitY — Ministry of Electronics &amp; IT</a></li>
              <li><a href="https://uidai.gov.in" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-white transition-colors">UIDAI — Aadhaar</a></li>
              <li><a href="https://www.india.gov.in" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-white transition-colors">India.gov.in — National Portal</a></li>
              <li><a href="https://www.nic.in" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-white transition-colors">NIC — National Informatics Centre</a></li>
            </ul>
          </div>

          {/* Grievance & RTI */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Grievance &amp; RTI</h3>
            <ul className="space-y-1.5">
              <li><span className="text-xs text-gray-400">Toll-Free Helpline</span></li>
              <li><span className="text-sm text-white font-bold">1800-11-0031</span></li>
              <li className="pt-1"><a href="https://rtionline.gov.in" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-white transition-colors">RTI — Right to Information</a></li>
              <li><a href="https://pgportal.gov.in" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-white transition-colors">CPGRAMS — Grievance Portal</a></li>
              <li><span className="text-xs text-gray-500">Email: grievance@onegov.gov.in</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-gray-500">
            <div className="flex flex-wrap items-center gap-3">
              <span>© {new Date().getFullYear()} ONEGOV — Government of India</span>
              <span>|</span>
              <Link href="/policies" className="hover:text-gray-300 transition-colors">Website Policies</Link>
              <span>|</span>
              <Link href="/policies#terms" className="hover:text-gray-300 transition-colors">Terms &amp; Conditions</Link>
              <span>|</span>
              <Link href="/policies#privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
              <span>|</span>
              <Link href="/policies#accessibility" className="hover:text-gray-300 transition-colors">Accessibility Statement</Link>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 bg-gray-800 rounded text-[9px]">WCAG 2.1</span>
              <span>Best viewed in Chrome/Firefox, 1280×720</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tricolor accent */}
      <div className="flex h-1">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>
    </footer>
  );
}
