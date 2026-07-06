"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Plus, Sparkles } from "lucide-react";
import Logo from "@/components/Logo";
import KanbanBoard from "@/components/KanbanBoard";
import StatsView from "@/components/StatsView";
import JobModal from "@/components/JobModal";

export type Job = {
  id: string;
  company: string;
  role: string;
  status: string;
  priority: string;
  salary?: string;
  location?: string;
  url?: string;
  notes?: string;
  appliedAt?: string;
  deadline?: string;
  createdAt: string;
};

type View = "board" | "stats";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("board");
  const [showModal, setShowModal] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") fetchJobs();
  }, [status]);

  async function fetchJobs() {
    setLoading(true);
    const res = await fetch("/api/jobs");
    const data = await res.json();
    setJobs(data);
    setLoading(false);
  }

  async function createJob(data: Partial<Job>) {
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const job = await res.json();
    setJobs(prev => [job, ...prev]);
  }

  async function updateJob(id: string, data: Partial<Job>) {
    await fetch(`/api/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...data } : j));
  }

  async function deleteJob(id: string) {
    await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    setJobs(prev => prev.filter(j => j.id !== id));
  }

  function openEdit(job: Job) {
    setEditJob(job);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditJob(null);
  }

  async function seedData() {
    setSeeding(true);
    await fetch("/api/seed", { method: "POST" });
    await fetchJobs();
    setSeeding(false);
  }

  async function handleSave(data: Partial<Job>) {
    if (editJob) {
      await updateJob(editJob.id, data);
    } else {
      await createJob(data);
    }
    closeModal();
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen" style={{ background: "var(--desk)" }}>
        <div className="h-14" style={{ background: "var(--paper)", borderBottom: "1px solid var(--card-edge)" }} />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="skeleton h-9" />
                {[...Array(2)].map((_, j) => <div key={j} className="skeleton h-28" />)}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const counts = {
    applied:   jobs.filter(j => j.status === "applied").length,
    interview: jobs.filter(j => j.status === "interview").length,
    offer:     jobs.filter(j => j.status === "offer").length,
  };

  return (
    <div className="min-h-screen relative" style={{ background: "var(--desk)" }}>
      {/* Desk-top header */}
      <header className="sticky top-0 z-20"
        style={{ background: "var(--paper)", borderBottom: "1px solid var(--card-edge)", boxShadow: "0 1px 3px rgba(70,55,25,0.08)" }}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <Logo size={30} />
            <div className="hidden sm:block">
              <span className="type font-bold text-[16px] leading-none tracking-tight">JobFlow</span>
              <p className="type-label leading-none mt-0.5" style={{ color: "var(--ink-faint)", fontSize: 8.5 }}>
                Application dossier
              </p>
            </div>
          </div>

          {/* View toggle — file tabs */}
          <div className="flex items-end gap-1 ml-2 self-end">
            {(["board", "stats"] as View[]).map(v => (
              <button key={v} onClick={() => setView(v)}
                className="type-label px-4 pt-2 pb-2.5 transition-colors cursor-pointer"
                style={view === v
                  ? { background: "var(--manila)", border: "1px solid var(--manila-deep)", borderBottom: "none", borderRadius: "6px 10px 0 0", color: "var(--ink)" }
                  : { color: "var(--ink-faint)", border: "1px solid transparent" }}>
                {v === "board" ? "The Desk" : "Case Stats"}
              </button>
            ))}
          </div>

          {/* Quick tallies */}
          {jobs.length > 0 && (
            <div className="hidden lg:flex items-center gap-4 ml-4">
              <span className="type text-[11px]" style={{ color: "var(--ink-blue)" }}>{counts.applied} applied</span>
              <span className="type text-[11px]" style={{ color: "var(--amber)" }}>{counts.interview} interview</span>
              <span className="type text-[11px]" style={{ color: "var(--green)" }}>{counts.offer} offer</span>
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">
            {jobs.length === 0 && (
              <button onClick={seedData} disabled={seeding} className="ghost-btn">
                <Sparkles className="w-3.5 h-3.5" />
                {seeding ? "Filing…" : "Sample data"}
              </button>
            )}
            <button onClick={() => setShowModal(true)} className="ink-btn">
              <Plus className="w-3.5 h-3.5" /> File new
            </button>
            <div className="w-px h-5 mx-1" style={{ background: "var(--card-edge)" }} />
            {session?.user?.image && (
              <img src={session.user.image} alt="avatar"
                className="w-7 h-7 rounded-full"
                style={{ border: "1.5px solid var(--card-edge)" }} />
            )}
            <span className="type text-[12px] hidden sm:block" style={{ color: "var(--ink-soft)" }}>{session?.user?.name}</span>
            <button onClick={() => signOut({ callbackUrl: "/login" })}
              className="p-2 transition-colors cursor-pointer"
              style={{ color: "var(--ink-faint)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--stamp-red)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-faint)")}
              title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        {view === "board" ? (
          <KanbanBoard
            jobs={jobs}
            onUpdate={updateJob}
            onDelete={deleteJob}
            onEdit={openEdit}
            onAdd={(status) => { setEditJob({ status } as Job); setShowModal(true); }}
          />
        ) : (
          <StatsView jobs={jobs} />
        )}
      </main>

      {showModal && (
        <JobModal
          job={editJob}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
