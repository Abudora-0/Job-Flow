import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const jobs = await prisma.job.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(jobs);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const body = await req.json();
  const job = await prisma.job.create({
    data: {
      userId,
      company: body.company,
      role: body.role,
      status: body.status ?? "wishlist",
      priority: body.priority ?? "medium",
      salary: body.salary ?? null,
      location: body.location ?? null,
      url: body.url ?? null,
      notes: body.notes ?? null,
      appliedAt: body.appliedAt ? new Date(body.appliedAt) : null,
      deadline: body.deadline ? new Date(body.deadline) : null,
    },
  });
  return NextResponse.json(job);
}
