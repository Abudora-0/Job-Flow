"use client";

import { useState } from "react";
import { DndContext, DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, Search, Filter, X, Bookmark, Send, MessageSquare, Trophy, XCircle } from "lucide-react";
import { Job } from "@/app/dashboard/page";
import JobCard from "./JobCard";
import DroppableColumn from "./DroppableColumn";
import Confetti from "./Confetti";

const COLUMNS = [
  { id: "wishlist",  label: "Wishlist",  icon: <Bookmark className="w-3.5 h-3.5" />,     colStyle: { color: "#8aa8b8", bg: "rgba(24,32,48,0.6)",       border: "rgba(30,42,64,0.8)" },  countStyle: { bg: "rgba(138,168,184,0.12)", color: "#8aa8b8" } },
  { id: "applied",   label: "Applied",   icon: <Send className="w-3.5 h-3.5" />,          colStyle: { color: "#38bdf8", bg: "rgba(14,40,70,0.4)",        border: "rgba(56,189,248,0.25)" }, countStyle: { bg: "rgba(56,189,248,0.15)", color: "#38bdf8" } },
  { id: "interview", label: "Interview", icon: <MessageSquare className="w-3.5 h-3.5" />, colStyle: { color: "#fbbf24", bg: "rgba(40,30,8,0.4)",         border: "rgba(251,191,36,0.25)" }, countStyle: { bg: "rgba(251,191,36,0.15)", color: "#fbbf24" } },
  { id: "offer",     label: "Offer",     icon: <Trophy className="w-3.5 h-3.5" />,        colStyle: { color: "#34d399", bg: "rgba(8,40,28,0.4)",         border: "rgba(52,211,153,0.25)" }, countStyle: { bg: "rgba(52,211,153,0.15)", color: "#34d399" } },
  { id: "rejected",  label: "Rejected",  icon: <XCircle className="w-3.5 h-3.5" />,       colStyle: { color: "#f87171", bg: "rgba(40,10,10,0.4)",        border: "rgba(248,113,113,0.25)" }, countStyle: { bg: "rgba(248,113,113,0.15)", color: "#f87171" } },
];

interface Props {
  jobs: Job[];
  onUpdate: (id: string, data: Partial<Job>) => void;
  onDelete: (id: string) => void;
  onEdit: (job: Job) => void;
  onAdd: (status: string) => void;
}

export default function KanbanBoard({ jobs, onUpdate, onDelete, onEdit, onAdd }: Props) {
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [showFilter, setShowFilter] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function handleDragStart(event: DragStartEvent) {
    const job = jobs.find(j => j.id === event.active.id);
    setActiveJob(job ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveJob(null);
    if (!over) return;

    const jobId = active.id as string;
    const overId = over.id as string;
    const currentJob = jobs.find(j => j.id === jobId);

    const col = COLUMNS.find(c => c.id === overId);
    if (col && col.id !== currentJob?.status) {
      onUpdate(jobId, { status: col.id });
      if (col.id === "offer") {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
      return;
    }

    const overJob = jobs.find(j => j.id === overId);
    if (overJob && overJob.status !== currentJob?.status) {
      onUpdate(jobId, { status: overJob.status });
      if (overJob.status === "offer") {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
    }
  }

  const filtered = jobs.filter(j => {
    const matchSearch = search === "" ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.role.toLowerCase().includes(search.toLowerCase());
    const matchPriority = priorityFilter === "all" || j.priority === priorityFilter;
    return matchSearch && matchPriority;
  });

  const totalFiltered = filtered.length;
  const isFiltering = search !== "" || priorityFilter !== "all";

  return (
    <div className="space-y-4">
      {showConfetti && <Confetti onClose={() => setShowConfetti(false)} />}

      {/* Search + Filter bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#3a5060" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search company or role..."
            className="w-full rounded-xl pl-9 pr-9 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none transition-colors"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
            onFocus={e => (e.currentTarget.style.borderColor = "#34d399")}
            onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: "#3a5060" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "#3a5060")}>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors"
            style={priorityFilter !== "all"
              ? { background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)", color: "#34d399" }
              : { background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "#5a7a8a" }}
          >
            <Filter className="w-4 h-4" />
            {priorityFilter === "all" ? "Filter" : `${priorityFilter} priority`}
          </button>
          {showFilter && (
            <div className="absolute top-full mt-1 right-0 rounded-xl p-1 z-10 shadow-xl min-w-[140px]"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
              {["all", "high", "medium", "low"].map(p => (
                <button key={p} onClick={() => { setPriorityFilter(p); setShowFilter(false); }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors"
                  style={priorityFilter === p
                    ? { background: "rgba(52,211,153,0.12)", color: "#34d399" }
                    : { color: "#5a7a8a" }}
                  onMouseEnter={e => { if (priorityFilter !== p) { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.color = "#fff"; } }}
                  onMouseLeave={e => { if (priorityFilter !== p) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#5a7a8a"; } }}>
                  {p === "all" ? "All priorities" : `${p.charAt(0).toUpperCase() + p.slice(1)} priority`}
                </button>
              ))}
            </div>
          )}
        </div>

        {isFiltering && (
          <span className="text-xs" style={{ color: "#3a5060" }}>{totalFiltered} result{totalFiltered !== 1 ? "s" : ""}</span>
        )}
      </div>

      {/* Board */}
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
          {COLUMNS.map(col => {
            const colJobs = filtered.filter(j => j.status === col.id);
            const totalInCol = jobs.filter(j => j.status === col.id).length;

            return (
              <DroppableColumn key={col.id} id={col.id}>
                <div className="space-y-2">
                  {/* Column header */}
                  <div className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                    style={{ background: col.colStyle.bg, border: `1px solid ${col.colStyle.border}` }}>
                    <div className="flex items-center gap-2">
                      <span style={{ color: col.colStyle.color }}>{col.icon}</span>
                      <span className="text-sm font-semibold" style={{ color: col.colStyle.color }}>{col.label}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: col.countStyle.bg, color: col.countStyle.color }}>
                        {totalInCol}
                      </span>
                    </div>
                    <button onClick={() => onAdd(col.id)}
                      className="transition-opacity hover:opacity-70"
                      style={{ color: col.colStyle.color }}>
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Cards */}
                  <SortableContext items={colJobs.map(j => j.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2 min-h-[80px]">
                      {colJobs.map(job => (
                        <JobCard key={job.id} job={job} onEdit={onEdit} onDelete={onDelete}
                          onStatusChange={(status) => {
                            onUpdate(job.id, { status });
                            if (status === "offer") {
                              setShowConfetti(true);
                              setTimeout(() => setShowConfetti(false), 4000);
                            }
                          }}
                        />
                      ))}

                      {colJobs.length === 0 && (
                        <div onClick={() => onAdd(col.id)}
                          className="rounded-xl p-5 text-center transition-all cursor-pointer"
                          style={{ border: `2px dashed ${col.colStyle.border}` }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                          <div className="flex justify-center mb-1 opacity-30" style={{ color: col.colStyle.color }}>{col.icon}</div>
                          <p className="text-xs opacity-50 transition-opacity" style={{ color: col.colStyle.color }}>
                            {col.id === "wishlist" ? "Add jobs you want" :
                             col.id === "applied" ? "Track applications" :
                             col.id === "interview" ? "Log interviews" :
                             col.id === "offer" ? "Celebrate offers! 🎉" :
                             "Track rejections"}
                          </p>
                        </div>
                      )}
                    </div>
                  </SortableContext>
                </div>
              </DroppableColumn>
            );
          })}
        </div>

        <DragOverlay>
          {activeJob && (
            <div className="rotate-1 scale-105 opacity-95">
              <JobCard job={activeJob} onEdit={() => {}} onDelete={() => {}} onStatusChange={() => {}} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
