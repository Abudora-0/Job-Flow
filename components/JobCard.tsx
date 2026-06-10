"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Job } from "@/app/dashboard/page";
import { MapPin, DollarSign, ExternalLink, Pencil, Trash2, Clock, GripVertical, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

const priorityConfig = {
  high:   { label: "High",   color: "#f87171", bg: "rgba(248,113,113,0.1)",  border: "rgba(248,113,113,0.2)",  accent: "#f87171" },
  medium: { label: "Medium", color: "#fbbf24", bg: "rgba(251,191,36,0.1)",   border: "rgba(251,191,36,0.2)",   accent: "#fbbf24" },
  low:    { label: "Low",    color: "#34d399", bg: "rgba(52,211,153,0.1)",   border: "rgba(52,211,153,0.2)",   accent: "#34d399" },
};

const NEXT_STATUS: Record<string, string> = {
  wishlist: "applied",
  applied: "interview",
  interview: "offer",
  offer: "offer",
  rejected: "wishlist",
};

const NEXT_LABEL: Record<string, string> = {
  wishlist: "Mark Applied",
  applied: "Got Interview",
  interview: "Got Offer! 🎉",
  offer: "Offered ✓",
  rejected: "Re-apply",
};

interface Props {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
  onStatusChange: (status: string) => void;
}

export default function JobCard({ job, onEdit, onDelete, onStatusChange }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const priority = priorityConfig[job.priority as keyof typeof priorityConfig] || priorityConfig.medium;
  const deadline = job.deadline ? new Date(job.deadline) : null;
  const isOverdue = deadline && deadline < new Date();
  const nextStatus = NEXT_STATUS[job.status];
  const canAdvance = job.status !== "offer";

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        background: "var(--bg-surface)",
        border: `1px solid var(--border)`,
        borderLeft: `3px solid ${priority.accent}`,
      }}
      className="rounded-xl overflow-hidden group transition-all duration-200 hover:-translate-y-0.5"
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = priority.accent;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px rgba(0,0,0,0.3)`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLElement).style.borderLeftColor = priority.accent;
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      <div className="p-3.5 space-y-2.5">
        {/* Top row */}
        <div className="flex items-center justify-between gap-2">
          <div {...attributes} {...listeners}
            className="cursor-grab active:cursor-grabbing flex-shrink-0 transition-colors"
            style={{ color: "#1e2a40" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#4a6080")}
            onMouseLeave={e => (e.currentTarget.style.color = "#1e2a40")}>
            <GripVertical className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white text-sm leading-tight truncate">{job.company}</p>
          </div>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full border flex-shrink-0"
            style={{ background: priority.bg, color: priority.color, borderColor: priority.border }}>
            {priority.label}
          </span>
        </div>

        {/* Role */}
        <p className="text-xs leading-snug" style={{ color: "#5a7a8a" }}>{job.role}</p>

        {/* Details */}
        <div className="space-y-1">
          {job.location && (
            <div className="flex items-center gap-1.5 text-xs" style={{ color: "#3a5060" }}>
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
          )}
          {job.salary && (
            <div className="flex items-center gap-1.5 text-xs" style={{ color: "#3a5060" }}>
              <DollarSign className="w-3 h-3 flex-shrink-0" />
              <span>{job.salary}</span>
            </div>
          )}
          {deadline && (
            <div className="flex items-center gap-1.5 text-xs" style={{ color: isOverdue ? "#f87171" : "#3a5060" }}>
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span>{isOverdue ? "⚠ Overdue: " : "Due: "}{deadline.toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Quick advance button */}
        {canAdvance && (
          <button
            onClick={() => onStatusChange(nextStatus)}
            className="w-full flex items-center justify-center gap-1.5 text-xs py-1.5 rounded-lg transition-all duration-200"
            style={{ background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.12)", color: "#4a7060" }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(52,211,153,0.12)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(52,211,153,0.3)";
              (e.currentTarget as HTMLElement).style.color = "#34d399";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(52,211,153,0.04)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(52,211,153,0.12)";
              (e.currentTarget as HTMLElement).style.color = "#4a7060";
            }}
          >
            <ChevronRight className="w-3 h-3" />
            {NEXT_LABEL[job.status]}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="px-3.5 pb-3 flex items-center justify-between pt-2"
        style={{ borderTop: "1px solid var(--border)" }}>
        <span className="text-[10px]" style={{ color: "#2a3a50" }}>
          {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {job.url && (
            <a href={job.url} target="_blank" rel="noreferrer"
              className="p-1 rounded transition-colors"
              style={{ color: "#3a5060" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "#3a5060")}>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
          <button onClick={() => onEdit(job)}
            className="p-1 rounded transition-colors"
            style={{ color: "#3a5060" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#38bdf8")}
            onMouseLeave={e => (e.currentTarget.style.color = "#3a5060")}>
            <Pencil className="w-3 h-3" />
          </button>
          <button onClick={() => onDelete(job.id)}
            className="p-1 rounded transition-colors"
            style={{ color: "#3a5060" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#f87171")}
            onMouseLeave={e => (e.currentTarget.style.color = "#3a5060")}>
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
