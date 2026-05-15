import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export default async function RedirectPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  // Look up salesperson by slug/code
  const salesperson = await prisma.salesperson.findFirst({
    where: { slug: code, isActive: true },
  });

  const cookieStore = await cookies();

  if (salesperson) {
    // Set the sales ref cookie
    cookieStore.set('bostar_ref', salesperson.slug, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });
  }

  // Set channel cookie if it matches a pattern
  if (code.startsWith('expo') || code.startsWith('dealer') || code.startsWith('channel')) {
    cookieStore.set('bostar_channel', code, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });
  }

  redirect('/');
}
