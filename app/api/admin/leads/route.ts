import { NextResponse } from 'next/server';
import { getLeadRepository } from '@/lib/lead/repository';

export async function GET() {
  const leads = await getLeadRepository().listLeads();
  return NextResponse.json({ leads });
}
