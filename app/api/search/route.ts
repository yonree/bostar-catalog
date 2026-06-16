import { NextResponse } from 'next/server';
import { getSearchResults } from '@/lib/cms-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  return NextResponse.json(await getSearchResults(q));
}
