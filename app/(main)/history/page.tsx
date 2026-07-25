import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import HistoryGuestBanner from '@/components/HistoryGuestBanner';

export const metadata = { title: 'History' };

export default async function HistoryPage() {
  const session = await auth();
  const userId = session?.user?.id;

  // 1. TARIK SEMUA DATA DARI DATABASE (Dinamis per user)
  const sessions = userId
    ? await prisma.workoutSession.findMany({
        where: { userId },
        orderBy: { startTime: 'desc' },
        include: {
          sets: {
            include: { exercise: true },
          },
        },
      })
    : [];

  // 2. KALKULASI STATISTIK SUPER KAPTEN
  const totalLatihan = sessions.length;

  let totalVolume = 0;
  let totalGerakan = 0;

  sessions.forEach((sessionItem: any) => {
    const uniqueExercises = new Set(sessionItem.sets.map((s: any) => s.exerciseId));
    totalGerakan += uniqueExercises.size;

    sessionItem.sets.forEach((set: any) => {
      const w = set.weight || 0;
      const r = set.reps || 0;
      totalVolume += w * r;
    });
  });

  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    }).toUpperCase();
  };

  return (
    <main className="pt-6 pb-16 px-5 md:px-12 max-w-[1280px] mx-auto flex flex-col gap-10">
      {/* Banner Notifikasi Akun Tamu */}
      <HistoryGuestBanner />

      {/* Top Scoreboard */}
      <section aria-label="Performance Summary" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-container border border-outline-variant rounded-lg p-6 flex flex-col justify-between gap-2 hover:border-primary transition-colors duration-300">
          <span className="font-label-caps text-label-caps text-on-surface-variant">Total Latihan</span>
          <span className="font-display-lg text-display-lg text-on-surface">{totalLatihan}</span>
        </div>
        <div className="bg-surface-container border border-outline-variant rounded-lg p-6 flex flex-col justify-between gap-2 hover:border-primary transition-colors duration-300">
          <span className="font-label-caps text-label-caps text-on-surface-variant">Total Volume Beban</span>
          <span className="font-display-lg text-display-lg text-primary">
            {totalVolume.toLocaleString('id-ID')} <span className="font-body-md text-body-md text-on-surface-variant">kg</span>
          </span>
        </div>
        <div className="bg-surface-container border border-outline-variant rounded-lg p-6 flex flex-col justify-between gap-2 hover:border-primary transition-colors duration-300">
          <span className="font-label-caps text-label-caps text-on-surface-variant">Total Gerakan</span>
          <span className="font-display-lg text-display-lg text-on-surface">{totalGerakan}</span>
        </div>
      </section>

      {/* Volume Progress Chart */}
      <section aria-label="Volume Progress Chart" className="flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-tight">Volume Trend</h2>
          <span className="font-label-caps text-label-caps text-on-surface-variant">Last 30 Days</span>
        </div>

        <div className="bg-surface-container border border-outline-variant rounded-lg p-6 h-[320px] w-full relative overflow-hidden group">
          {/* Logika Grafik Dinamis */}
          {(() => {
            const sortedSessions = [...sessions].reverse();
            if (sortedSessions.length === 0) return <div className="text-on-surface-variant flex items-center justify-center h-full">Belum ada data volume</div>;

            const maxVol = Math.max(...sortedSessions.map(s => {
              return s.sets.reduce((sum: number, set: any) => sum + ((set.weight || 0) * (set.reps || 0)), 0);
            }), 100);

            const width = 1000;
            const height = 200;
            const padding = 20;
            const effectiveHeight = height - (padding * 2);

            const points = sortedSessions.map((s, i) => {
              const vol = s.sets.reduce((sum: number, set: any) => sum + ((set.weight || 0) * (set.reps || 0)), 0);
              const x = (i / (sortedSessions.length > 1 ? sortedSessions.length - 1 : 1)) * width;
              const y = height - padding - ((vol / maxVol) * effectiveHeight);
              return `${x},${y}`;
            });

            return (
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox={`0 0 ${width} ${height}`}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={i * (height / 4)}
                    x2={width}
                    y2={i * (height / 4)}
                    stroke="#1f2937"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                ))}

                <path d={`M ${points.join(' L ')}`} fill="none" stroke="#a3e635" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

                {points.map((p, i) => {
                  const [cx, cy] = p.split(',');
                  return <circle key={i} cx={cx} cy={cy} r="8" fill="#11150a" stroke="#a3e635" strokeWidth="3" />;
                })}
              </svg>
            );
          })()}
        </div>
      </section>

      {/* Daily History List (Accordion) */}
      <section aria-label="Workout History Log" className="flex flex-col gap-4">
        <h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-tight">Workout Log</h2>
        <div className="flex flex-col gap-2">

          {sessions.length === 0 ? (
            <div className="text-center py-10 bg-surface-container border border-outline-variant rounded-lg text-on-surface-variant font-body-md">
              Belum ada riwayat latihan. Waktunya angkat beban, Kapten! 🏋️‍♂️
            </div>
          ) : (
            sessions.map((sessionItem: any) => {
              const sessionSets = (sessionItem.sets || []) as any[];

              const sessionVol = sessionSets.reduce((sum: number, set: any) => {
                const w = set.weight || 0;
                const r = set.reps || 0;
                return sum + (w * r);
              }, 0);

              const groupedSets = sessionSets.reduce((acc: any, set: any) => {
                const exName = set.exercise?.name || 'Unknown Exercise';
                if (!acc[exName]) {
                  acc[exName] = { sets: 0, reps: [], weights: [] };
                }
                acc[exName].sets += 1;
                acc[exName].reps.push(set.reps || 0);
                acc[exName].weights.push(set.weight || 0);
                return acc;
              }, {});

              return (
                <details key={sessionItem.id} className="group bg-surface-container border border-outline-variant rounded-lg transition-colors hover:border-primary-container">
                  <summary className="flex justify-between items-center p-6 cursor-pointer select-none">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-10">
                      <span className="font-label-caps text-label-caps text-primary w-24">
                        {formatDate(sessionItem.startTime)}
                      </span>
                      <span className="font-body-lg text-body-lg text-on-surface font-bold uppercase tracking-wide">
                        {sessionItem.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-label-caps text-label-caps text-on-surface-variant hidden sm:block">
                        Vol: {sessionVol.toLocaleString('id-ID')} kg
                      </span>
                      <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform duration-300">
                        keyboard_arrow_down
                      </span>
                    </div>
                  </summary>

                  <div className="px-6 pb-6">
                    <div className="w-full border-t border-outline-variant pt-4">
                      <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left font-body-md text-body-md text-on-surface-variant border-collapse">
                          <thead>
                            <tr className="border-b border-outline-variant">
                              <th className="py-2 font-label-caps text-label-caps font-normal w-1/2">Exercise</th>
                              <th className="py-2 font-label-caps text-label-caps font-normal text-right">Sets</th>
                              <th className="py-2 font-label-caps text-label-caps font-normal text-right">Reps</th>
                              <th className="py-2 font-label-caps text-label-caps font-normal text-right">Weight (Max)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(groupedSets).map(([exName, data]: [string, any]) => (
                              <tr key={exName} className="border-b border-outline-variant/30 hover:bg-surface-container-highest transition-colors">
                                <td className="py-2 text-on-surface">{exName}</td>
                                <td className="py-2 text-right">{data.sets}</td>
                                <td className="py-2 text-right">{data.reps.join(', ')}</td>
                                <td className="py-2 text-right text-primary">
                                  {Math.max(...data.weights, 0)} kg
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-4 pt-4 border-t border-outline-variant/30 flex justify-end">
                        <Link
                          href={`/workout/summary/${sessionItem.id}`}
                          className="flex items-center gap-2 text-primary hover:text-primary-fixed text-label-caps font-bold uppercase tracking-widest transition-colors group/btn"
                        >
                          <span>Lihat Rekapan Penuh</span>
                          <span className="material-symbols-outlined text-[18px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                        </Link>
                      </div>

                    </div>
                  </div>
                </details>
              );
            })
          )}

        </div>
      </section>
    </main>
  );
}