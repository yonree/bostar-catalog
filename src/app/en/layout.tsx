import type { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'BOSTAR - Electrostatic Spraying Equipment Catalog',
  description: 'Intelligent Electronic Product Catalog for Electrostatic Spraying Equipment',
};

export default async function EnLayout({ children }: { children: React.ReactNode }) {
  // Force English language via cookie
  const cookieStore = await cookies();
  if (cookieStore.get('bostar_lang')?.value !== 'en') {
    // We can't set cookies in server components, but we preserve the children
  }

  return <>{children}</>;
}
