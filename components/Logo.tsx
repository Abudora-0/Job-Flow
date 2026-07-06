export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* manila folder */}
      <path d="M10 30 Q10 24 16 24 H38 L46 32 H84 Q90 32 90 38 V76 Q90 82 84 82 H16 Q10 82 10 76 Z"
        fill="#eadfc0" stroke="#2c2417" strokeWidth="4.5" strokeLinejoin="round" />
      {/* filed paper peeking out */}
      <path d="M22 32 V20 Q22 16 26 16 H62 Q66 16 66 20 V24" stroke="#2c2417" strokeWidth="4" fill="#faf6eb" strokeLinejoin="round" />
      {/* stamp mark */}
      <rect x="52" y="48" width="26" height="16" rx="2" stroke="#b3402e" strokeWidth="3.5" fill="none" transform="rotate(-6 65 56)" />
      {/* type lines */}
      <line x1="22" y1="50" x2="44" y2="50" stroke="#2c2417" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="22" y1="60" x2="40" y2="60" stroke="#6a5f4b" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="22" y1="70" x2="46" y2="70" stroke="#6a5f4b" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}
