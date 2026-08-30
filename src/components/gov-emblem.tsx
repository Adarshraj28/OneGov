"use client";

// Government Emblem SVG — Lion Capital of Ashoka (Government of India)
// Pure SVG, no external image dependencies
export default function GovEmblem({ size = 120, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Base / Platform */}
      <rect x="50" y="170" width="100" height="12" rx="3" fill="#B8860B" />
      <rect x="55" y="165" width="90" height="8" rx="2" fill="#DAA520" />
      
      {/* Ashoka Chakra on the base */}
      <circle cx="100" cy="176" r="5" fill="none" stroke="#000080" strokeWidth="0.8" />
      {[...Array(24)].map((_, i) => {
        const angle = (i * 360) / 24;
        const rad = (angle * Math.PI) / 180;
        return (
          <line
            key={`spoke-${i}`}
            x1={100 + 1.5 * Math.cos(rad)}
            y1={176 + 1.5 * Math.sin(rad)}
            x2={100 + 4.5 * Math.cos(rad)}
            y2={176 + 4.5 * Math.sin(rad)}
            stroke="#000080"
            strokeWidth="0.4"
          />
        );
      })}
      
      {/* Central pillar */}
      <rect x="92" y="90" width="16" height="75" rx="2" fill="#B8860B" />
      <rect x="94" y="90" width="12" height="75" rx="1" fill="#DAA520" />
      
      {/* Ashoka Chakra on pillar */}
      <circle cx="100" cy="125" r="10" fill="none" stroke="#000080" strokeWidth="1.5" />
      <circle cx="100" cy="125" r="3" fill="#000080" />
      {[...Array(24)].map((_, i) => {
        const angle = (i * 360) / 24;
        const rad = (angle * Math.PI) / 180;
        return (
          <line
            key={`pillar-spoke-${i}`}
            x1={100 + 3.5 * Math.cos(rad)}
            y1={125 + 3.5 * Math.sin(rad)}
            x2={100 + 9 * Math.cos(rad)}
            y2={125 + 9 * Math.sin(rad)}
            stroke="#000080"
            strokeWidth="0.6"
          />
        );
      })}
      
      {/* Lions — simplified artistic representation */}
      {/* Center lion (facing forward) */}
      <ellipse cx="100" cy="60" rx="18" ry="22" fill="#B8860B" />
      <ellipse cx="100" cy="58" rx="15" ry="18" fill="#DAA520" />
      {/* Face features */}
      <circle cx="94" cy="55" r="2" fill="#8B4513" />
      <circle cx="106" cy="55" r="2" fill="#8B4513" />
      <ellipse cx="100" cy="62" rx="4" ry="3" fill="#8B4513" />
      {/* Mane */}
      <path d="M82 50 Q80 35 88 30 Q95 25 100 28 Q105 25 112 30 Q120 35 118 50" fill="#B8860B" stroke="#8B4513" strokeWidth="0.5" />
      
      {/* Left lion (facing left) */}
      <ellipse cx="72" cy="58" rx="14" ry="18" fill="#B8860B" opacity="0.9" />
      <ellipse cx="72" cy="56" rx="11" ry="14" fill="#DAA520" opacity="0.9" />
      <circle cx="67" cy="53" r="1.5" fill="#8B4513" />
      <path d="M60 50 Q58 38 64 34 Q68 32 72 33" fill="#B8860B" stroke="#8B4513" strokeWidth="0.5" opacity="0.9" />
      
      {/* Right lion (facing right) */}
      <ellipse cx="128" cy="58" rx="14" ry="18" fill="#B8860B" opacity="0.9" />
      <ellipse cx="128" cy="56" rx="11" ry="14" fill="#DAA520" opacity="0.9" />
      <circle cx="133" cy="53" r="1.5" fill="#8B4513" />
      <path d="M140 50 Q142 38 136 34 Q132 32 128 33" fill="#B8860B" stroke="#8B4513" strokeWidth="0.5" opacity="0.9" />
      
      {/* Abacus ring */}
      <rect x="60" y="85" width="80" height="8" rx="4" fill="#DAA520" stroke="#B8860B" strokeWidth="1" />
      {/* Small decorations on abacus */}
      <circle cx="70" cy="89" r="2" fill="#B8860B" />
      <circle cx="85" cy="89" r="2" fill="#B8860B" />
      <circle cx="100" cy="89" r="2" fill="#000080" />
      <circle cx="115" cy="89" r="2" fill="#B8860B" />
      <circle cx="130" cy="89" r="2" fill="#B8860B" />
      
      {/* Text: Satyameva Jayate */}
      <text
        x="100"
        y="195"
        textAnchor="middle"
        fontSize="7"
        fontFamily="serif"
        fontWeight="bold"
        fill="#B8860B"
      >
        सत्यमेव जयते
      </text>
    </svg>
  );
}
