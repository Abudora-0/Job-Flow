"use client";

import { signIn } from "next-auth/react";
import Logo from "@/components/Logo";

const CONTENTS = [
  ["01", "Kanban desk",     "five folders, wishlist through offer"],
  ["02", "Index cards",     "one card per application, drag to file"],
  ["03", "Deadline stamps", "overdue applications get flagged in red"],
  ["04", "Case statistics", "interview and offer rates, charted"],
];

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative" style={{ background: "var(--desk)" }}>
      <div className="relative z-10 w-full max-w-md animate-fade-in-up">

        {/* folder tab */}
        <div className="folder-tab inline-flex items-center gap-2 px-5 py-2 ml-4">
          <span className="type-label">CASE FILE · JF-2025</span>
        </div>

        {/* the dossier */}
        <div className="paper-card relative p-8 space-y-7" style={{ borderRadius: "0 3px 3px 3px" }}>
          {/* confidential stamp */}
          <span className="stamp stamp-big absolute top-6 right-6" style={{ color: "var(--stamp-red)" }}>
            Job Hunt
          </span>

          <div className="flex items-center gap-4">
            <Logo size={52} />
            <div>
              <h1 className="type text-[26px] font-bold leading-none tracking-tight">JobFlow</h1>
              <p className="type-label mt-1.5" style={{ color: "var(--ink-faint)" }}>Application dossier</p>
            </div>
          </div>

          <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
            Every application is a case. File it, stamp it, move it through the
            pipeline — from wishlist to signed offer.
          </p>

          {/* contents listing */}
          <div>
            <p className="type-label card-rule pb-1.5 mb-2">Contents</p>
            {CONTENTS.map(([n, title, desc]) => (
              <div key={n} className="flex items-baseline gap-3 py-1.5">
                <span className="type text-[11px] font-bold" style={{ color: "var(--stamp-red)" }}>{n}</span>
                <span className="type text-[13px] font-bold">{title}</span>
                <span className="text-[12px] truncate" style={{ color: "var(--ink-faint)" }}>— {desc}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="ink-btn w-full justify-center py-3.5"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Open file — GitHub
          </button>

          <p className="type-label text-center" style={{ color: "var(--ink-faint)" }}>
            Free forever · your data stays yours
          </p>
        </div>
      </div>
    </div>
  );
}
