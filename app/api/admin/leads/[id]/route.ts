import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const lead = await prisma.lead.update({
    where: { id },
    data: {
      status: body.status || undefined,
      assignedTo: body.assignedTo || undefined,
      remark: body.remark || undefined,
    },
  });
  return NextResponse.json({ success: true, message: '线索已更新。', lead });
}
