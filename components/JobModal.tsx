"use client";

import { useState, useEffect } from "react";
import { X, Briefcase } from "lucide-react";
import { Job } from "@/app/dashboard/page";

const STATUSES = ["wishlist", "applied", "interview", "offer", "rejected"];
const PRIORITIES = ["low", "medium", "high"];

interface Props {
  job: Partial<Job> | null;
  onSave: (data: Partial<Job>) => void;
  onClose: () => void;
}

export default function JobModal({ job, onSave, onClose }: Props) {
  const [form, setForm] = useState({
    company: "", role: "", status: "wishlist", priority: "medium",
    salary: "", location: "", url: "", notes: "", appliedAt: "", deadline: "",
  });

  useEffect(() => {
    if (job) {
      setForm({
        company:   job.company   ?? "",
        role:      job.role      ?? "",
        status:    job.status    ?? "wishlist",
        priority:  job.priority  ?? "medium",
        salary:    job.salary    ?? "",
        location:  job.location  ?? "",
        url:       job.url       ?? "",
        notes:     job.notes     ?? "",
        appliedAt: job.appliedAt ? job.appliedAt.slice(0, 10) : "",
        deadline:  job.deadline  ? job.deadline.slice(0, 10)  : "",
      });
    }
  }, [job]);

  const isEdit = !!(job as Job)?.id;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      ...form,
      appliedAt: form.appliedAt || undefined,
      deadline:  form.deadline  || undefined,
      salary:    form.salary    || undefined,
      location:  form.location  || undefined,
      url:       form.url       || undefined,
      notes:     form.notes     || undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 backdrop-blur-sm" style={{ background: "rgba(0,0,0,0.7)" }} onClick={onClose} />
      <div className="relative glass rounded-2xl w-full max-w-lg animate-slide-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)" }}>
              <Briefcase className="w-4 h-4" style={{ color: "#34d399" }} />
            </div>
            <h2 className="font-semibold text-white">{isEdit ? "Edit Application" : "Add Application"}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors"
            style={{ color: "#5a7a8a" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#5a7a8a"; }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Company + Role */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Company *</label>
              <input required value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                placeholder="Google" className="input-field" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Role *</label>
              <input required value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                placeholder="Software Engineer" className="input-field" />
            </div>
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="input-field">
                {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Priority</label>
              <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))} className="input-field">
                {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
          </div>

          {/* Salary + Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Salary</label>
              <input value={form.salary} onChange={e => setForm(p => ({ ...p, salary: e.target.value }))}
                placeholder="$80,000 - $100,000" className="input-field" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Location</label>
              <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                placeholder="Remote / New York" className="input-field" />
            </div>
          </div>

          {/* URL */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Job URL</label>
            <input value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
              placeholder="https://..." className="input-field" />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Applied Date</label>
              <input type="date" value={form.appliedAt} onChange={e => setForm(p => ({ ...p, appliedAt: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Deadline</label>
              <input type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} className="input-field" />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Notes</label>
            <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              placeholder="Interview notes, contacts, requirements..."
              rows={3} className="input-field resize-none" />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{ border: "1px solid var(--border)", color: "#5a7a8a" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#34d399"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "#5a7a8a"; }}>
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-2.5 text-white rounded-xl text-sm font-medium transition-all hover:scale-[1.01]"
              style={{ background: "linear-gradient(135deg,#34d399,#fbbf24)", boxShadow: "0 2px 12px rgba(52,211,153,0.2)" }}>
              {isEdit ? "Save Changes" : "Add Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
