"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
  shape: "square" | "circle" | "strip";
}

/* paper-scrap confetti in desk-palette colors */
const COLORS = ["#b3402e", "#3e6b4f", "#3a5a7d", "#a06d24", "#eadfc0", "#faf6eb", "#7a6f5c"];

export default function Confetti({ onClose }: { onClose?: () => void }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const shapes: ("square"|"circle"|"strip")[] = ["square","circle","strip"];
    setParticles(Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 2,
      duration: 2.5 + Math.random() * 2,
      size: 5 + Math.random() * 9,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    })));

    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  function handleClose() {
    setVisible(false);
    onClose?.();
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Paper scraps */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute top-0 animate-confetti"
            style={{
              left: `${p.x}%`,
              width: p.shape === "strip" ? p.size / 2 : p.size,
              height: p.shape === "strip" ? p.size * 3 : p.size,
              backgroundColor: p.color,
              borderRadius: p.shape === "circle" ? "50%" : "1px",
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              opacity: 0.9,
            }}
          />
        ))}
      </div>

      {/* Telegram card */}
      <div className="pointer-events-auto animate-slide-in relative max-w-sm mx-4 w-full">
        <div className="paper-card relative p-8 text-center" style={{ boxShadow: "0 12px 40px rgba(44,36,23,0.35)" }}>
          <button onClick={handleClose}
            className="absolute top-4 right-4 transition-colors pointer-events-auto cursor-pointer"
            style={{ color: "var(--ink-faint)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--ink)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-faint)")}>
            <X className="w-4 h-4" />
          </button>

          <p className="type-label mb-5" style={{ color: "var(--ink-faint)" }}>
            ─── TELEGRAM · PRIORITY ───
          </p>

          {/* the stamp */}
          <div className="mb-5 flex justify-center">
            <span className="stamp stamp-big animate-stamp" style={{ color: "var(--green)", fontSize: 22, padding: "6px 18px", borderWidth: 3 }}>
              Offer received
            </span>
          </div>

          <h2 className="type text-[20px] font-bold mb-2">You got the offer<span style={{ color: "var(--stamp-red)" }}>.</span></h2>
          <p className="text-[13.5px] leading-relaxed mb-6" style={{ color: "var(--ink-soft)" }}>
            Case advanced to final stage STOP all that filing paid off STOP
            congratulations STOP
          </p>

          <button onClick={handleClose} className="ink-btn pointer-events-auto w-full justify-center py-3">
            Stamp it ✓
          </button>
        </div>
      </div>
    </div>
  );
}
