"use client";

import { Job } from "@/app/dashboard/page";
import { Briefcase, TrendingUp, Trophy, XCircle, Clock } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";

const COLORS = ["#6b7280", "#3b82f6", "#f59e0b", "#10b981", "#ef4444"];
const STATUSES = ["wishlist", "applied", "interview", "offer", "rejected"];

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
    { icon: <Briefcase className="w-4 h-4 text-violet-400" />, label: "Total Applied", value: total, bg: "bg-violet-500/10", border: "border-violet-500/20" },
    { icon: <TrendingUp className="w-4 h-4 text-blue-400" />, label: "Interviews", value: interviews, bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { icon: <Trophy className="w-4 h-4 text-green-400" />, label: "Offers", value: offers, bg: "bg-green-500/10", border: "border-green-500/20" },
    { icon: <XCircle className="w-4 h-4 text-red-400" />, label: "Rejected", value: rejected, bg: "bg-red-500/10", border: "border-red-500/20" },
    { icon: <Clock className="w-4 h-4 text-yellow-400" />, label: "Interview Rate", value: `${interviewRate}%`, bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
    { icon: <Trophy className="w-4 h-4 text-emerald-400" />, label: "Offer Rate", value: `${offerRate}%`, bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  ];

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
        No applications yet. Add some jobs to see stats!
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s, i) => (
          <div key={i} className={`${s.bg} border ${s.border} rounded-xl p-4`}>
            <div className="mb-2">{s.icon}</div>
            <p className="text-xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pie chart */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-sm mb-4">Applications by Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#1f2937", border: "1px solid #374151", borderRadius: "8px", color: "#fff" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {pieData.map((d, i) => (
              <span key={i} className="flex items-center gap-1.5 text-xs text-gray-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                {d.name} ({d.value})
              </span>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-sm mb-4">Applications Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={timelineData}>
              <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1f2937", border: "1px solid #374151", borderRadius: "8px", color: "#fff" }} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top companies */}
      {topCompanies.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-sm mb-4">Companies Applied To</h3>
          <div className="space-y-2">
            {topCompanies.map(([company, count], i) => (
              <div key={company} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-4">{i + 1}</span>
                <span className="text-sm text-gray-300 flex-1">{company}</span>
                <div className="w-32 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: `${(count / total) * 100}%` }} />
                </div>
                <span className="text-xs text-gray-500 w-4 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
