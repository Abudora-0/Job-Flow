"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Plus, LayoutDashboard, BarChart2, Sparkles } from "lucide-react";
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
      <div className="min-h-screen bg-[#0a0c10]">
        <div className="h-14 bg-[#0d1117] border-b border-[#21262d]" />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="skeleton h-8 rounded-xl" />
                {[...Array(2)].map((_, j) => <div key={j} className="skeleton h-28 rounded-xl" />)}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white">
      {/* Header */}
      <header className="border-b border-[#21262d] bg-[#0d1117]/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center gap-4">
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <Logo size={28} />
            <span className="font-bold text-white">JobFlow</span>
          </div>

          {/* View toggle */}
          <div className="flex gap-1 bg-[#161b22] border border-[#21262d] rounded-lg p-0.5 ml-4">
            <button onClick={() => setView("board")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${view === "board" ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white"}`}>
              <LayoutDashboard className="w-3.5 h-3.5" /> Board
            </button>
            <button onClick={() => setView("stats")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${view === "stats" ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white"}`}>
              <BarChart2 className="w-3.5 h-3.5" /> Stats
            </button>
          </div>

          {/* Quick stats */}
          {jobs.length > 0 && (
            <div className="hidden lg:flex items-center gap-3 ml-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" />{jobs.filter(j=>j.status==="applied").length} applied</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500" />{jobs.filter(j=>j.status==="interview").length} interview</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" />{jobs.filter(j=>j.status==="offer").length} offer</span>
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">
            {jobs.length === 0 && (
              <button onClick={seedData} disabled={seeding}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                <Sparkles className="w-4 h-4" />
                {seeding ? "Loading..." : "Sample Data"}
              </button>
            )}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Job
            </button>
            <div className="w-px h-5 bg-[#30363d]" />
            {session?.user?.image && (
              <img src={session.user.image} alt="avatar" className="w-7 h-7 rounded-full ring-2 ring-violet-500/50" />
            )}
            <span className="text-sm text-gray-300 hidden sm:block">{session?.user?.name}</span>
            <button onClick={() => signOut({ callbackUrl: "/login" })}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-red-400">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-6">
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
