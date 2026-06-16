import { NextResponse } from 'next/server';
import { nullableString, numberValue, parseBoolean } from '@/lib/admin-api';
import { prisma } from '@/lib/prisma';

function faqData(body: Record<string, unknown>) {
  return {
    question: String(body.question || ''),
    answer: String(body.answer || ''),
    category: nullableString(body.category),
    sortOrder: numberValue(body.sortOrder),
    isPublished: parseBoolean(body.isPublished),
  };
}

export async function GET() {
  const items = await prisma.fAQ.findMany({
    orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
  });
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const body = await request.json();
  const item = await prisma.fAQ.create({ data: faqData(body) });
  return NextResponse.json({ success: true, message: 'FAQ 已新增。', item });
}
