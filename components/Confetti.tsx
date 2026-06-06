"use client";

import { useEffect, useState } from "react";
import { Trophy, X, Sparkles } from "lucide-react";

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
  shape: "square" | "circle" | "strip";
}

const COLORS = ["#8b5cf6","#6366f1","#3b82f6","#10b981","#f59e0b","#f97316","#ec4899","#06b6d4"];

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
      {/* Confetti particles */}
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
              borderRadius: p.shape === "circle" ? "50%" : p.shape === "strip" ? "2px" : "2px",
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              opacity: 0.9,
            }}
          />
        ))}
      </div>

      {/* Toast card */}
      <div className="pointer-events-auto animate-fade-in-up relative">
        {/* Glow */}
        <div className="absolute inset-0 bg-green-500/20 rounded-3xl blur-xl scale-110" />

        <div className="relative bg-[#0d1117] border border-green-500/30 rounded-3xl p-8 text-center shadow-2xl shadow-green-500/20 max-w-sm mx-4">
          {/* Close button */}
          <button onClick={handleClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors pointer-events-auto">
            <X className="w-4 h-4" />
          </button>

          {/* Trophy icon with glow */}
          <div className="relative inline-flex mb-4">
            <div className="absolute inset-0 bg-yellow-500/30 rounded-full blur-lg scale-150" />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">You got an offer!</h2>
          <p className="text-gray-400 text-sm mb-5">Congratulations on landing the offer. All your hard work paid off!</p>

          {/* Stars row */}
          <div className="flex items-center justify-center gap-1 mb-5">
            {[...Array(5)].map((_, i) => (
              <Sparkles key={i} className="w-4 h-4 text-yellow-400" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>

          <button onClick={handleClose}
            className="pointer-events-auto w-full py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-green-500/30">
            Let's go! 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
