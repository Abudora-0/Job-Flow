export default function Logo({ size = 28 }: { size?: number }) {
  const id = `lg-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34d399" />
          <stop offset="1" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="88" height="88" rx="22" fill={`url(#${id})`} />
      {/* Briefcase body - centered */}
      <rect x="16" y="46" width="68" height="38" rx="9" stroke="white" strokeWidth="5.5" fill="none" strokeOpacity="0.95" />
      {/* Handle */}
      <path d="M33 46V38Q33 28 42 28H58Q67 28 67 38V46" stroke="white" strokeWidth="5.5" fill="none" strokeLinecap="round" strokeOpacity="0.95" />
      {/* Center divider line */}
      <line x1="16" y1="59" x2="84" y2="59" stroke="white" strokeWidth="3" strokeOpacity="0.35" />
      {/* Latch */}
      <rect x="44" y="54" width="12" height="10" rx="3" stroke="white" strokeWidth="3" fill="none" strokeOpacity="0.7" />
    </svg>
  );
}
