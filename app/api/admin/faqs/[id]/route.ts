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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const item = await prisma.fAQ.update({ where: { id }, data: faqData(body) });
  return NextResponse.json({ success: true, message: 'FAQ 已更新。', item });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.fAQ.delete({ where: { id } });
  return NextResponse.json({ success: true, message: 'FAQ 已删除。' });
}
