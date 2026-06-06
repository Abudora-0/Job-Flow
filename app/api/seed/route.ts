import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const DUMMY_JOBS = [
  { company: "Google", role: "Software Engineer II", status: "interview", priority: "high", salary: "$150k - $180k", location: "Mountain View, CA", url: "https://careers.google.com", notes: "Passed phone screen. System design interview next week.", appliedAt: "2024-05-01", deadline: "2024-06-15" },
  { company: "Meta", role: "Frontend Engineer", status: "applied", priority: "high", salary: "$140k - $170k", location: "Menlo Park, CA", url: "https://metacareers.com", notes: "Applied via referral from John.", appliedAt: "2024-05-10" },
  { company: "Stripe", role: "Full Stack Developer", status: "applied", priority: "high", salary: "$130k - $160k", location: "Remote", appliedAt: "2024-05-12" },
  { company: "Vercel", role: "Developer Experience Engineer", status: "interview", priority: "high", salary: "$120k - $145k", location: "Remote", notes: "First round done. Waiting for technical interview.", appliedAt: "2024-04-28" },
  { company: "Airbnb", role: "React Developer", status: "rejected", priority: "medium", salary: "$125k - $150k", location: "San Francisco, CA", notes: "Failed the coding challenge. Need to practice more DP.", appliedAt: "2024-04-20" },
  { company: "Netflix", role: "Senior Frontend Engineer", status: "wishlist", priority: "high", salary: "$160k - $200k", location: "Los Gatos, CA", url: "https://jobs.netflix.com" },
  { company: "Shopify", role: "Software Developer", status: "offer", priority: "medium", salary: "$110k - $135k", location: "Remote", notes: "Got the offer! Deciding between this and Vercel.", appliedAt: "2024-04-15" },
  { company: "Linear", role: "Product Engineer", status: "wishlist", priority: "medium", salary: "$100k - $130k", location: "Remote", url: "https://linear.app/careers" },
  { company: "GitHub", role: "Software Engineer", status: "applied", priority: "medium", salary: "$130k - $155k", location: "Remote", appliedAt: "2024-05-14" },
  { company: "Figma", role: "Frontend Engineer", status: "rejected", priority: "medium", salary: "$120k - $145k", location: "San Francisco, CA", notes: "No feedback given.", appliedAt: "2024-04-10" },
  { company: "OpenAI", role: "Software Engineer", status: "wishlist", priority: "high", salary: "$170k - $220k", location: "San Francisco, CA", url: "https://openai.com/careers" },
  { company: "Notion", role: "Full Stack Engineer", status: "interview", priority: "low", salary: "$115k - $140k", location: "Remote", notes: "Culture fit interview scheduled.", appliedAt: "2024-05-05" },
];

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;

  // Clear existing jobs first
  await prisma.job.deleteMany({ where: { userId } });

  // Create dummy jobs
  const jobs = await Promise.all(
    DUMMY_JOBS.map(j => prisma.job.create({
      data: {
        userId,
        company: j.company,
        role: j.role,
        status: j.status,
        priority: j.priority,
        salary: j.salary ?? null,
        location: j.location ?? null,
        url: j.url ?? null,
        notes: j.notes ?? null,
        appliedAt: j.appliedAt ? new Date(j.appliedAt) : null,
        deadline: j.deadline ? new Date(j.deadline) : null,
      }
    }))
  );

  return NextResponse.json({ created: jobs.length });
}
