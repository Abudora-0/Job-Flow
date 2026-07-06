"use client";

import { useState } from "react";
import { DndContext, DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, Search, X } from "lucide-react";
import { Job } from "@/app/dashboard/page";
import JobCard from "./JobCard";
import DroppableColumn from "./DroppableColumn";
import Confetti from "./Confetti";

const COLUMNS = [
  { id: "wishlist",  label: "Wishlist",  color: "var(--pencil)",    hint: "Jobs worth chasing" },
  { id: "applied",   label: "Applied",   color: "var(--ink-blue)",  hint: "Paperwork sent" },
  { id: "interview", label: "Interview", color: "var(--amber)",     hint: "In the room" },
  { id: "offer",     label: "Offer",     color: "var(--green)",     hint: "Signed & stamped" },
  { id: "rejected",  label: "Rejected",  color: "var(--stamp-red)", hint: "Case closed" },
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
    <div className="space-y-5">
      {showConfetti && <Confetti onClose={() => setShowConfetti(false)} />}

      {/* Search + Filter bar */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--ink-faint)" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search company or role…"
            className="input-field pl-7 pr-8"
            style={{ background: "transparent" }}
          />
          {search && (
            <button onClick={() => setSearch("")}
              className="absolute right-1 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
              style={{ color: "var(--ink-faint)" }}>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* priority filter as stamp toggles */}
        <div className="flex items-center gap-2">
          <span className="type-label" style={{ color: "var(--ink-faint)" }}>Priority:</span>
          {["all", "high", "medium", "low"].map(p => (
            <button key={p} onClick={() => setPriorityFilter(p)}
              className="stamp cursor-pointer transition-opacity"
              style={{
                color: p === "high" ? "var(--stamp-red)" : p === "medium" ? "var(--amber)" : p === "low" ? "var(--green)" : "var(--ink-soft)",
                opacity: priorityFilter === p ? 1 : 0.35,
                transform: "rotate(0deg)",
              }}>
              {p}
            </button>
          ))}
        </div>

        {isFiltering && (
          <span className="type text-[11px]" style={{ color: "var(--ink-faint)" }}>
            {totalFiltered} card{totalFiltered !== 1 ? "s" : ""} found
          </span>
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
                <div>
                  {/* Folder tab */}
                  <div className="folder-tab flex items-center justify-between pl-3 pr-2 py-2 mr-6">
                    <div className="flex items-baseline gap-2 min-w-0">
                      <span className="type text-[12.5px] font-bold truncate" style={{ color: col.color }}>
                        {col.label}
                      </span>
                      <span className="type text-[10.5px]" style={{ color: "var(--ink-faint)" }}>
                        ×{totalInCol}
                      </span>
                    </div>
                    <button onClick={() => onAdd(col.id)}
                      className="transition-opacity hover:opacity-60 cursor-pointer flex-shrink-0"
                      style={{ color: col.color }}
                      title={`Add to ${col.label}`}>
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Folder body */}
                  <div className="folder-body p-2">
                    <SortableContext items={colJobs.map(j => j.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-2.5 min-h-[90px]">
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
                          <button onClick={() => onAdd(col.id)}
                            className="w-full p-5 text-center transition-colors cursor-pointer"
                            style={{ border: `1.5px dashed ${col.color}`, opacity: 0.55, borderRadius: 2 }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                            onMouseLeave={e => (e.currentTarget.style.opacity = "0.55")}>
                            <p className="type text-[11px]" style={{ color: col.color }}>
                              — {col.hint} —
                            </p>
                          </button>
                        )}
                      </div>
                    </SortableContext>
                  </div>
                </div>
              </DroppableColumn>
            );
          })}
        </div>

        <DragOverlay>
          {activeJob && (
            <div className="rotate-2 scale-105 opacity-95">
              <JobCard job={activeJob} onEdit={() => {}} onDelete={() => {}} onStatusChange={() => {}} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
