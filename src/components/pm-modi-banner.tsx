"use client";

import { useLanguage } from "@/lib/language-context";
import AshokaChakra from "@/components/ashoka-chakra";

interface PMModiBannerProps {
  variant?: "full" | "compact" | "hero";
}

export default function PMModiBanner({ variant = "full" }: PMModiBannerProps) {
  const { t } = useLanguage();

  if (variant === "hero") {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
        {/* Tricolor top bar */}
        <div className="flex h-1.5">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#138808]" />
        </div>

        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* PM Modi Photo */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#FF9933] via-white to-[#138808] p-1">
                <div className="w-full h-full rounded-full overflow-hidden bg-white">
                  <img
                    src="/images/pm-modi.jpg"
                    alt="Prime Minister Narendra Modi"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
              {/* Ashoka Chakra badge */}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border-2 border-white shadow flex items-center justify-center">
                <AshokaChakra size={24} />
              </div>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-[#FF9933] font-semibold text-sm tracking-wide uppercase mb-1">
                {t.digitalIndiaInitiative}
              </p>
              <h2 className="text-white text-xl sm:text-2xl font-bold leading-tight mb-2">
                &quot;{t.minimumGovernment}&quot;
              </h2>
              <p className="text-blue-200 text-sm sm:text-base leading-relaxed">
                {t.bannerDescription}
              </p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                <span className="px-3 py-1 bg-[#FF9933]/20 text-[#FF9933] text-xs rounded-full font-medium">
                  🇮🇳 {t.makeInIndia}
                </span>
                <span className="px-3 py-1 bg-[#138808]/20 text-[#138808] text-xs rounded-full font-medium">
                  📱 {t.digitalIndia}
                </span>
                <span className="px-3 py-1 bg-white/20 text-white text-xs rounded-full font-medium">
                  🏛️ {t.citizenFirst}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tricolor bottom bar */}
        <div className="flex h-1">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#138808]" />
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl p-4 border border-blue-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF9933] via-white to-[#138808] p-0.5 shrink-0">
            <div className="w-full h-full rounded-full overflow-hidden bg-white">
              <img
                src="/images/pm-modi.jpg"
                alt="Prime Minister Narendra Modi"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
          <div>
            <p className="text-white font-semibold text-sm">
              &quot;{t.minimumGovernment}&quot;
            </p>
            <p className="text-blue-200 text-xs">
              ONEGOV — {t.digitalIndiaInitiative}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200">
      {/* Tricolor top bar */}
      <div className="flex h-1">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 p-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF9933] via-white to-[#138808] p-0.5 shrink-0">
            <div className="w-full h-full rounded-full overflow-hidden bg-white">
              <img
                src="/images/pm-modi.jpg"
                alt="Prime Minister Narendra Modi"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
          <div>
            <p className="text-[#FF9933] text-xs font-semibold uppercase tracking-wide">
              {t.digitalIndiaInitiative}
            </p>
            <h3 className="text-white text-lg font-bold">
              &quot;{t.minimumGovernment}&quot;
            </h3>
            <p className="text-blue-200 text-sm mt-1">
              {t.bannerDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Tricolor bottom bar */}
      <div className="flex h-1">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>
    </div>
  );
}
