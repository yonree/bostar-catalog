import { NextResponse } from 'next/server';
import { updateLeadStatus } from '@/lib/lead/service';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json()) as Record<string, unknown>;
  const lead = await updateLeadStatus({
    id,
    status: String(body.status || ''),
    assignedTo: String(body.assignedTo || ''),
    remark: typeof body.remark === 'string' ? body.remark : undefined,
    actor: 'admin',
  });

  return NextResponse.json({ success: true, message: '线索已更新。', lead });
}
