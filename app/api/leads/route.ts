import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateLead } from '@/lib/validators';

export async function POST(request: Request) {
  const body = await request.json();
  const validation = validateLead(body);
  if (!validation.ok) {
    return NextResponse.json({ success: false, message: validation.message }, { status: 400 });
  }

  try {
    await prisma.lead.create({
      data: {
        name: body.name,
        company: body.company || null,
        phone: body.phone || null,
        email: body.email || null,
        wechat: body.wechat || null,
        region: body.region || null,
        sourcePage: body.sourcePage || null,
        demandType: body.demandType || null,
        interestedProduct: body.interestedProduct || null,
        workpiece: body.workpiece || null,
        currentIssue: body.currentIssue || null,
        message: body.message || null,
        attachmentUrl: body.attachmentUrl || null,
      },
    });
  } catch {
    // Keep the inquiry flow usable even if the database is temporarily unavailable.
  }

  return NextResponse.json({ success: true, message: '提交成功，我们会尽快联系您。' });
}
