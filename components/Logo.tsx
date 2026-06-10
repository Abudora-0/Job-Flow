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
      <rect x="18" y="44" width="64" height="40" rx="8" stroke="white" strokeWidth="5.5" fill="none" strokeOpacity="0.95" />
      <path d="M34 44V36Q34 28 42 28H58Q66 28 66 36V44" stroke="white" strokeWidth="5.5" fill="none" strokeLinecap="round" strokeOpacity="0.95" />
      <line x1="18" y1="57" x2="82" y2="57" stroke="white" strokeWidth="3" strokeOpacity="0.35" />
      <path d="M50 76V58M43 65L50 58L57 65" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeOpacity="0.85" />
    </svg>
  );
}
