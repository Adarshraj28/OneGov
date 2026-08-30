"use client";

// Ashoka Chakra — 24 spokes, navy blue
// Public domain design based on the Indian national flag
export default function AshokaChakra({ size = 40, className = "" }: { size?: number; className?: string }) {
  const spokes = 24;
  const cx = 50;
  const cy = 50;
  const outerR = 45;
  const innerR = 12;
  const hubR = 8;

  const spokeLines: string[] = [];
  for (let i = 0; i < spokes; i++) {
    const angle = (i * 360) / spokes;
    const rad = (angle * Math.PI) / 180;
    const x1 = cx + hubR * Math.cos(rad);
    const y1 = cy + hubR * Math.sin(rad);
    const x2 = cx + outerR * Math.cos(rad);
    const y2 = cy + outerR * Math.sin(rad);
    spokeLines.push(`M${x1.toFixed(2)},${y1.toFixed(2)} L${x2.toFixed(2)},${y2.toFixed(2)}`);
  }

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer rim */}
      <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="#000080" strokeWidth="3" />
      {/* Inner rim */}
      <circle cx={cx} cy={cy} r={innerR} fill="none" stroke="#000080" strokeWidth="2" />
      {/* Hub */}
      <circle cx={cx} cy={cy} r={hubR} fill="#000080" />
      {/* 24 Spokes */}
      {spokeLines.map((d, i) => (
        <path key={i} d={d} stroke="#000080" strokeWidth="1.8" fill="none" />
      ))}
    </svg>
  );
}
