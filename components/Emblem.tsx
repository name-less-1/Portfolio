// Original typographic emblem — an arch with a monogram cut. No borrowed assets.
export default function Emblem({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      {/* outer arch */}
      <path
        d="M8 42 V22 C8 12 15 5 24 5 C33 5 40 12 40 22 V42"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.9"
      />
      {/* inner arch */}
      <path
        d="M14 42 V23 C14 15.5 18.5 10.5 24 10.5 C29.5 10.5 34 15.5 34 23 V42"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.45"
      />
      {/* base line */}
      <line x1="5" y1="42" x2="43" y2="42" stroke="currentColor" strokeWidth="1.2" opacity="0.9" />
      {/* monogram */}
      <path
        d="M19 33 L24 20 L29 33 M21 29.5 H27"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* keystone dot */}
      <circle cx="24" cy="8.5" r="1.3" fill="currentColor" opacity="0.9" />
    </svg>
  );
}
