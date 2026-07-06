"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Job } from "@/app/dashboard/page";
import { ExternalLink, Pencil, Trash2, GripVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const priorityConfig = {
  high:   { label: "Urgent", color: "var(--stamp-red)" },
  medium: { label: "Std",    color: "var(--amber)" },
  low:    { label: "Low",    color: "var(--green)" },
};

const NEXT_STATUS: Record<string, string> = {
  wishlist: "applied",
  applied: "interview",
  interview: "offer",
  offer: "offer",
  rejected: "wishlist",
};

const NEXT_LABEL: Record<string, string> = {
  wishlist: "File as applied",
  applied: "Interview booked",
  interview: "Offer received!",
  offer: "Offer ✓",
  rejected: "Re-open case",
};

interface Props {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
  onStatusChange: (status: string) => void;
}

/* an index card, filed in a manila folder */
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
      style={style}
      className="paper-card group overflow-hidden transition-shadow duration-200 hover:shadow-md"
    >
      <div className="p-3 pb-2.5">
        {/* Header row — ruled like an index card */}
        <div className="card-rule flex items-start justify-between gap-2 pb-2 mb-2">
          <div {...attributes} {...listeners}
            className="cursor-grab active:cursor-grabbing flex-shrink-0 mt-0.5 transition-colors"
            style={{ color: "var(--card-edge)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--ink-faint)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--card-edge)")}>
            <GripVertical className="w-3.5 h-3.5" />
          </div>
          <p className="flex-1 min-w-0 font-semibold text-[14px] leading-tight truncate" style={{ color: "var(--ink)" }}>
            {job.company}
          </p>
          <span className="stamp flex-shrink-0" style={{ color: priority.color }}>
            {priority.label}
          </span>
        </div>

        {/* Role — typed on the card */}
        <p className="type text-[12px] leading-snug mb-2" style={{ color: "var(--ink-soft)" }}>
          {job.role}
        </p>

        {/* Details as typed fields */}
        {(job.location || job.salary || deadline) && (
          <div className="space-y-1 mb-1">
            {job.location && (
              <p className="type text-[11px] truncate" style={{ color: "var(--ink-faint)" }}>
                <span style={{ color: "var(--ink-faint)" }}>loc:</span> {job.location}
              </p>
            )}
            {job.salary && (
              <p className="type text-[11px]" style={{ color: "var(--ink-faint)" }}>
                <span>pay:</span> {job.salary}
              </p>
            )}
            {deadline && (
              <p className="type text-[11px] flex items-center gap-1.5" style={{ color: isOverdue ? "var(--stamp-red)" : "var(--ink-faint)" }}>
                <span>due:</span> {deadline.toLocaleDateString()}
                {isOverdue && <span className="stamp" style={{ color: "var(--stamp-red)", fontSize: 8 }}>Overdue</span>}
              </p>
            )}
          </div>
        )}

        {/* Quick advance */}
        {canAdvance && (
          <button
            onClick={() => onStatusChange(nextStatus)}
            className="type w-full text-left text-[11px] font-bold py-1 transition-colors cursor-pointer"
            style={{ color: "var(--ink-faint)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--green)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-faint)")}
          >
            → {NEXT_LABEL[job.status]}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-1.5 flex items-center justify-between"
        style={{ borderTop: "1px dashed var(--card-edge)", background: "var(--paper-aged)" }}>
        <span className="type text-[10px]" style={{ color: "var(--ink-faint)" }}>
          filed {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
        </span>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {job.url && (
            <a href={job.url} target="_blank" rel="noreferrer"
              className="p-1 transition-colors"
              style={{ color: "var(--ink-faint)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--ink-blue)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-faint)")}>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
          <button onClick={() => onEdit(job)}
            className="p-1 transition-colors cursor-pointer"
            style={{ color: "var(--ink-faint)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--ink)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-faint)")}>
            <Pencil className="w-3 h-3" />
          </button>
          <button onClick={() => onDelete(job.id)}
            className="p-1 transition-colors cursor-pointer"
            style={{ color: "var(--ink-faint)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--stamp-red)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-faint)")}>
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
