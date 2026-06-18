import { NextResponse } from 'next/server';
import { runLeadAutomation } from '@/lib/lead/automation';

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET || '';
  if (!secret) {
    return process.env.NODE_ENV !== 'production';
  }

  return request.headers.get('authorization') === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const summary = await runLeadAutomation();
  return NextResponse.json({
    ok: true,
    summary,
  });
}
