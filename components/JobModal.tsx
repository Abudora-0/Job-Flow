"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
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
      <div className="absolute inset-0" style={{ background: "rgba(44,36,23,0.45)" }} onClick={onClose} />

      <div className="relative w-full max-w-lg animate-slide-in max-h-[92vh] overflow-y-auto">
        {/* folder tab */}
        <div className="folder-tab inline-flex items-center px-5 py-1.5 ml-3">
          <span className="type-label">{isEdit ? "Amend record" : "New record"}</span>
        </div>

        <div className="paper-card p-6 sm:p-7" style={{ borderRadius: "0 3px 3px 3px" }}>
          {/* Header */}
          <div className="card-rule flex items-center justify-between pb-3 mb-5">
            <h2 className="type font-bold text-[18px] tracking-tight">
              {isEdit ? "Edit application" : "File an application"}
            </h2>
            <button onClick={onClose} className="p-1.5 transition-colors cursor-pointer"
              style={{ color: "var(--ink-faint)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--stamp-red)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-faint)")}>
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Company + Role */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="type-label mb-1 block">Company *</label>
                <input required value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                  placeholder="Acme Corp" className="input-field" />
              </div>
              <div>
                <label className="type-label mb-1 block">Role *</label>
                <input required value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                  placeholder="Software Engineer" className="input-field" />
              </div>
            </div>

            {/* Status + Priority */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="type-label mb-1 block">Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="input-field">
                  {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="type-label mb-1 block">Priority</label>
                <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))} className="input-field">
                  {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
              </div>
            </div>

            {/* Salary + Location */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="type-label mb-1 block">Salary</label>
                <input value={form.salary} onChange={e => setForm(p => ({ ...p, salary: e.target.value }))}
                  placeholder="$80,000 – $100,000" className="input-field" />
              </div>
              <div>
                <label className="type-label mb-1 block">Location</label>
                <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                  placeholder="Remote / New York" className="input-field" />
              </div>
            </div>

            {/* URL */}
            <div>
              <label className="type-label mb-1 block">Job URL</label>
              <input value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
                placeholder="https://…" className="input-field" />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="type-label mb-1 block">Applied date</label>
                <input type="date" value={form.appliedAt} onChange={e => setForm(p => ({ ...p, appliedAt: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="type-label mb-1 block">Deadline</label>
                <input type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} className="input-field" />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="type-label mb-1 block">Case notes</label>
              <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                placeholder="Interview notes, contacts, requirements…"
                rows={3} className="input-field resize-none" />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="ghost-btn flex-1 justify-center py-3">
                Discard
              </button>
              <button type="submit" className="ink-btn flex-1 justify-center py-3">
                {isEdit ? "Save changes" : "File it"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
