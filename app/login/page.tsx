"use client";

import { signIn } from "next-auth/react";
import { LayoutDashboard, BarChart2, Bell, Flag } from "lucide-react";
import Logo from "@/components/Logo";

const features = [
  { icon: <LayoutDashboard className="w-4 h-4" />, text: "Kanban board" },
  { icon: <BarChart2 className="w-4 h-4" />, text: "Application stats" },
  { icon: <Bell className="w-4 h-4" />, text: "Deadline tracking" },
  { icon: <Flag className="w-4 h-4" />, text: "Priority flags" },
];

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "var(--bg-base)" }}>
      {/* Ambient blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(52,211,153,0.07)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(251,191,36,0.06)" }} />

      <div className="relative z-10 w-full max-w-md px-6 animate-fade-in-up">
        {/* Logo + title */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Logo size={48} />
          <div>
            <span className="text-2xl font-bold text-white tracking-tight">JobFlow</span>
            <p className="text-xs" style={{ color: "#34d399" }}>Career momentum tracker</p>
          </div>
        </div>

        <div className="glass rounded-2xl p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Track your job hunt</h1>
            <p className="text-sm mt-2" style={{ color: "#5a7a8a" }}>
              Organize applications with a beautiful Kanban board
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm rounded-lg px-3 py-2"
                style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.12)", color: "#8aa8b8" }}>
                <span style={{ color: "#34d399" }}>{f.icon}</span>
                {f.text}
              </div>
            ))}
          </div>

          <button
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-white"
            style={{
              background: "linear-gradient(135deg, #34d399, #fbbf24)",
              boxShadow: "0 4px 24px rgba(52,211,153,0.25)",
            }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Continue with GitHub
          </button>

          <p className="text-xs text-center" style={{ color: "#3a5060" }}>Free forever. No credit card required.</p>
        </div>
      </div>
    </div>
  );
}
