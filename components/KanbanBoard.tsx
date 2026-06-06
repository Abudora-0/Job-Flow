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
  { id: "wishlist",  label: "Wishlist",  icon: <Bookmark className="w-3.5 h-3.5" />,      color: "text-gray-300",   bg: "bg-[#161b22]",     border: "border-[#30363d]",     count: "bg-gray-500/20 text-gray-300" },
  { id: "applied",   label: "Applied",   icon: <Send className="w-3.5 h-3.5" />,           color: "text-blue-300",   bg: "bg-blue-950/40",   border: "border-blue-500/30",   count: "bg-blue-500/20 text-blue-300" },
  { id: "interview", label: "Interview", icon: <MessageSquare className="w-3.5 h-3.5" />,  color: "text-yellow-300", bg: "bg-yellow-950/40", border: "border-yellow-500/30", count: "bg-yellow-500/20 text-yellow-300" },
  { id: "offer",     label: "Offer",     icon: <Trophy className="w-3.5 h-3.5" />,         color: "text-green-300",  bg: "bg-green-950/40",  border: "border-green-500/30",  count: "bg-green-500/20 text-green-300" },
  { id: "rejected",  label: "Rejected",  icon: <XCircle className="w-3.5 h-3.5" />,        color: "text-red-300",    bg: "bg-red-950/40",    border: "border-red-500/30",    count: "bg-red-500/20 text-red-300" },
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search company or role..."
            className="w-full bg-[#161b22] border border-[#21262d] rounded-xl pl-9 pr-9 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`flex items-center gap-2 px-3 py-2 border rounded-xl text-sm transition-colors ${priorityFilter !== "all" ? "bg-violet-500/20 border-violet-500/40 text-violet-300" : "bg-[#161b22] border-[#21262d] text-gray-400 hover:text-white"}`}
          >
            <Filter className="w-4 h-4" />
            {priorityFilter === "all" ? "Filter" : `${priorityFilter} priority`}
          </button>
          {showFilter && (
            <div className="absolute top-full mt-1 right-0 bg-[#161b22] border border-[#30363d] rounded-xl p-1 z-10 shadow-xl min-w-[140px]">
              {["all", "high", "medium", "low"].map(p => (
                <button key={p} onClick={() => { setPriorityFilter(p); setShowFilter(false); }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${priorityFilter === p ? "bg-violet-500/20 text-violet-300" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                  {p === "all" ? "All priorities" : `${p.charAt(0).toUpperCase() + p.slice(1)} priority`}
                </button>
              ))}
            </div>
          )}
        </div>

        {isFiltering && (
          <span className="text-xs text-gray-500">{totalFiltered} result{totalFiltered !== 1 ? "s" : ""}</span>
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
                  <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl border ${col.bg} ${col.border}`}>
                    <div className="flex items-center gap-2">
                      <span className={col.color}>{col.icon}</span>
                      <span className={`text-sm font-semibold ${col.color}`}>{col.label}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${col.count}`}>
                        {totalInCol}
                      </span>
                    </div>
                    <button onClick={() => onAdd(col.id)}
                      className={`${col.color} hover:opacity-70 transition-opacity`}>
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
                          className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer group ${col.border} hover:bg-white/5`}>
                          <div className={`flex justify-center mb-1 opacity-30 ${col.color}`}>{col.icon}</div>
                          <p className={`text-xs ${col.color} opacity-50 group-hover:opacity-80 transition-opacity`}>
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
