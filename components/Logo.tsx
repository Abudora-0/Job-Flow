export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="url(#logoGrad)" />
      <rect x="6" y="10" width="8" height="3" rx="1.5" fill="white" fillOpacity="0.9" />
      <rect x="6" y="15" width="8" height="3" rx="1.5" fill="white" fillOpacity="0.6" />
      <rect x="6" y="20" width="5" height="3" rx="1.5" fill="white" fillOpacity="0.3" />
      <rect x="17" y="10" width="9" height="3" rx="1.5" fill="white" fillOpacity="0.5" />
      <rect x="17" y="15" width="9" height="3" rx="1.5" fill="white" fillOpacity="0.9" />
      <rect x="17" y="20" width="6" height="3" rx="1.5" fill="white" fillOpacity="0.6" />
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c3aed" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
      </defs>
    </svg>
  );
}
