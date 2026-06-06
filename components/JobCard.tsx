"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Job } from "@/app/dashboard/page";
import { MapPin, DollarSign, ExternalLink, Pencil, Trash2, Clock, GripVertical, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

const priorityConfig = {
  high:   { label: "High",   color: "text-red-300",    bg: "bg-red-500/10",    border: "border-red-500/20",    card: "border-l-red-500" },
  medium: { label: "Medium", color: "text-yellow-300", bg: "bg-yellow-500/10", border: "border-yellow-500/20", card: "border-l-yellow-500" },
  low:    { label: "Low",    color: "text-green-300",  bg: "bg-green-500/10",  border: "border-green-500/20",  card: "border-l-green-500" },
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
  const [showActions, setShowActions] = useState(false);

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
      style={style}
      className={`bg-[#0d1117] border border-[#21262d] border-l-2 ${priority.card} hover:border-[#30363d] rounded-xl overflow-hidden group transition-all duration-200 hover:shadow-lg hover:shadow-black/30 hover:-translate-y-0.5`}
    >
      <div className="p-3.5 space-y-2.5">
        {/* Top row */}
        <div className="flex items-center justify-between gap-2">
          <div {...attributes} {...listeners}
            className="text-gray-700 hover:text-gray-400 cursor-grab active:cursor-grabbing transition-colors flex-shrink-0">
            <GripVertical className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white text-sm leading-tight truncate">{job.company}</p>
          </div>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border flex-shrink-0 ${priority.bg} ${priority.color} ${priority.border}`}>
            {priority.label}
          </span>
        </div>

        {/* Role */}
        <p className="text-gray-400 text-xs leading-snug">{job.role}</p>

        {/* Details */}
        <div className="space-y-1">
          {job.location && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
          )}
          {job.salary && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <DollarSign className="w-3 h-3 flex-shrink-0" />
              <span>{job.salary}</span>
            </div>
          )}
          {deadline && (
            <div className={`flex items-center gap-1.5 text-xs ${isOverdue ? "text-red-400" : "text-gray-600"}`}>
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span>{isOverdue ? "⚠ Overdue: " : "Due: "}{deadline.toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Quick advance button */}
        {canAdvance && (
          <button
            onClick={() => onStatusChange(nextStatus)}
            className="w-full flex items-center justify-center gap-1.5 text-xs py-1.5 rounded-lg bg-white/5 hover:bg-violet-500/20 border border-white/10 hover:border-violet-500/40 text-gray-400 hover:text-violet-300 transition-all duration-200"
          >
            <ChevronRight className="w-3 h-3" />
            {NEXT_LABEL[job.status]}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="px-3.5 pb-3 flex items-center justify-between border-t border-[#21262d] pt-2">
        <span className="text-[10px] text-gray-700">
          {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {job.url && (
            <a href={job.url} target="_blank" rel="noreferrer"
              className="p-1 hover:bg-white/10 rounded text-gray-500 hover:text-white transition-colors">
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
          <button onClick={() => onEdit(job)}
            className="p-1 hover:bg-white/10 rounded text-gray-500 hover:text-blue-400 transition-colors">
            <Pencil className="w-3 h-3" />
          </button>
          <button onClick={() => onDelete(job.id)}
            className="p-1 hover:bg-white/10 rounded text-gray-500 hover:text-red-400 transition-colors">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
