import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const body = await req.json();

  const job = await prisma.job.updateMany({
    where: { id: params.id, userId },
    data: {
      ...body,
      appliedAt: body.appliedAt ? new Date(body.appliedAt) : undefined,
      deadline: body.deadline ? new Date(body.deadline) : undefined,
    },
  });
  return NextResponse.json(job);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  await prisma.job.deleteMany({ where: { id: params.id, userId } });
  return NextResponse.json({ success: true });
}
