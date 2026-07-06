"use client";

import { Job } from "@/app/dashboard/page";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";

const COLORS = ["#7a6f5c", "#3a5a7d", "#a06d24", "#3e6b4f", "#b3402e"];
const STATUSES = ["wishlist", "applied", "interview", "offer", "rejected"];

const tooltipStyle = {
  background: "#faf6eb",
  border: "1px solid #d6c9ab",
  borderRadius: "2px",
  color: "#2c2417",
  fontFamily: "var(--font-type), 'Courier Prime', monospace",
  fontSize: 12,
};

export default function StatsView({ jobs }: { jobs: Job[] }) {
  const total = jobs.length;
  const applied = jobs.filter(j => j.status === "applied").length;
  const interviews = jobs.filter(j => j.status === "interview").length;
  const offers = jobs.filter(j => j.status === "offer").length;
  const rejected = jobs.filter(j => j.status === "rejected").length;

  const interviewRate = applied > 0 ? Math.round((interviews / applied) * 100) : 0;
  const offerRate = interviews > 0 ? Math.round((offers / interviews) * 100) : 0;

  const pieData = STATUSES.map((s, i) => ({
    name: s.charAt(0).toUpperCase() + s.slice(1),
    value: jobs.filter(j => j.status === s).length,
    color: COLORS[i],
  })).filter(d => d.value > 0);

  // Applications over time (by week)
  const weekMap: Record<string, number> = {};
  jobs.forEach(j => {
    const d = new Date(j.createdAt);
    const week = `${d.getMonth() + 1}/${d.getDate()}`;
    weekMap[week] = (weekMap[week] || 0) + 1;
  });
  const timelineData = Object.entries(weekMap).slice(-8).map(([date, count]) => ({ date, count }));

  // Top companies
  const companyMap: Record<string, number> = {};
  jobs.forEach(j => { companyMap[j.company] = (companyMap[j.company] || 0) + 1; });
  const topCompanies = Object.entries(companyMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const stats = [
    { label: "Cases filed",    value: total,              color: "var(--ink)" },
    { label: "Interviews",     value: interviews,         color: "var(--amber)" },
    { label: "Offers",         value: offers,             color: "var(--green)" },
    { label: "Rejections",     value: rejected,           color: "var(--stamp-red)" },
    { label: "Interview rate", value: `${interviewRate}%`, color: "var(--ink-blue)" },
    { label: "Offer rate",     value: `${offerRate}%`,     color: "var(--green)" },
  ];

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="type text-[13px]" style={{ color: "var(--ink-faint)" }}>
          — Empty docket. File some applications to see stats. —
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Tally cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="paper-card p-4">
            <p className="type text-[26px] font-bold leading-none" style={{ color: s.color }}>{s.value}</p>
            <p className="type-label mt-2" style={{ color: "var(--ink-faint)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pie chart */}
        <div className="paper-card p-6">
          <h3 className="type-label card-rule pb-2 mb-4">Pipeline by status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} stroke="var(--paper)" />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
            {pieData.map((d, i) => (
              <span key={i} className="type flex items-center gap-1.5 text-[11px]" style={{ color: "var(--ink-soft)" }}>
                <span className="w-2 h-2 inline-block" style={{ backgroundColor: d.color }} />
                {d.name} ({d.value})
              </span>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="paper-card p-6">
          <h3 className="type-label card-rule pb-2 mb-4">Applications over time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={timelineData}>
              <XAxis dataKey="date" tick={{ fill: "#6a5f4b", fontSize: 11, fontFamily: "monospace" }} axisLine={{ stroke: "#d6c9ab" }} tickLine={false} />
              <YAxis tick={{ fill: "#6a5f4b", fontSize: 11, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(160,109,36,0.08)" }} />
              <Bar dataKey="count" fill="#3a5a7d" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top companies */}
      {topCompanies.length > 0 && (
        <div className="paper-card p-6">
          <h3 className="type-label card-rule pb-2 mb-4">Companies on file</h3>
          <div className="space-y-2.5">
            {topCompanies.map(([company, count], i) => (
              <div key={company} className="flex items-center gap-3">
                <span className="type text-[11px] font-bold w-5" style={{ color: "var(--stamp-red)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[13.5px] font-medium flex-1" style={{ color: "var(--ink)" }}>{company}</span>
                <div className="w-36 h-2 overflow-hidden" style={{ background: "var(--paper-aged)", border: "1px solid var(--card-edge)" }}>
                  <div className="h-full" style={{ width: `${(count / total) * 100}%`, background: "var(--ink-blue)" }} />
                </div>
                <span className="type text-[11px] w-5 text-right" style={{ color: "var(--ink-faint)" }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
