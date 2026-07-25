import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import ActiveSessionCard from './ActiveSessionCard';

export const metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const recentSessions = userId
    ? await prisma.workoutSession.findMany({
        where: { userId },
        orderBy: { startTime: 'desc' },
        take: 3,
        include: {
          sets: true,
        },
      })
    : [];

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sessionDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diffInTime = today.getTime() - sessionDate.getTime();
    const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    return `${diffInDays} Days Ago`;
  };

  return (
    <main className="max-w-[1280px] mx-auto px-5 md:px-12 py-10">

      <header className="mb-10">
        <h1 className="text-4xl font-black text-on-surface mb-2 tracking-tight">Dashboard</h1>
        <p className="text-base text-on-surface-variant">
          Welcome back, {session?.user?.name || 'Athlete'}! Ready to crush it today?
        </p>
      </header>

      {/* KOMPONEN CLIENT: Tombol Mulai/Lanjut Latihan */}
      <ActiveSessionCard />

      {/* KOMPONEN SERVER: Riwayat Terakhir */}
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-end border-b border-outline-variant/50 pb-3 mb-2">
          <h2 className="text-xl font-bold text-on-surface">Riwayat Terakhir</h2>
          <Link
            href="/history"
            className="text-xs font-bold text-primary hover:text-primary-fixed uppercase tracking-widest transition-colors"
          >
            View All
          </Link>
        </div>

        <div className="flex flex-col">
          {recentSessions.length === 0 ? (
            <div className="text-center py-8 text-on-surface-variant text-sm border border-dashed border-outline-variant rounded-xl">
              Belum ada riwayat latihan. Waktunya mencetak rekor baru!
            </div>
          ) : (
            recentSessions.map((sessionItem, index) => {
              const sessionVol = sessionItem.sets.reduce((sum, set) => {
                const w = set.weight || 0;
                const r = set.reps || 0;
                return sum + w * r;
              }, 0);

              const isLast = index === recentSessions.length - 1;

              return (
                <Link
                  key={sessionItem.id}
                  href={`/workout/summary/${sessionItem.id}`}
                  className={`flex items-center justify-between py-4 group hover:bg-[#0a0a0a] transition-colors px-3 rounded-lg ${!isLast ? 'border-b border-[#1f2937]' : ''}`}
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-[#11150a] border border-[#1f2937] flex items-center justify-center text-primary group-hover:border-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">fitness_center</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-base font-bold text-on-surface group-hover:text-primary transition-colors">{sessionItem.name}</span>
                      <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mt-1">
                        {getRelativeTime(sessionItem.startTime)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-on-surface-variant mb-1">Volume</span>
                    <span className="text-base font-bold text-primary">
                      {sessionVol.toLocaleString('id-ID')} <span className="text-xs font-normal text-on-surface-variant">kg</span>
                    </span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </section>

    </main>
  );
}