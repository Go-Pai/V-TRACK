import { auth } from '@/auth';
import ClientLayout from './ClientLayout';
import { redirect } from 'next/navigation';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const cookieStore = await import('next/headers').then((m) => m.cookies());
  const isGuest = cookieStore.get('vtrack-guest')?.value === 'true';

  if (!session?.user && !isGuest) {
    redirect('/');
  }

  return (
    <ClientLayout user={session?.user || null}>
      {children}
    </ClientLayout>
  );
}