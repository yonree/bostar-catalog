import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';

async function getAdminUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bostar_token')?.value;
    if (!token) return null;

    const { verifyToken } = await import('@/lib/auth');
    const { prisma } = await import('@/lib/prisma');

    const decoded = verifyToken(token);
    if (!decoded) return null;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { role: true },
    });

    if (!user || user.status !== 'active') return null;
    return user;
  } catch {
    return null;
  }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();

  if (!user) {
    redirect('/admin/login');
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <AdminSidebar userRole={user.role.slug} />
      <div className="flex-1 flex flex-col">
        <AdminHeader user={user} />
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
