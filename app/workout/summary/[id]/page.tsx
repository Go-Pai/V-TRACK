import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

// 🌟 FIX 1: Tipe params diubah menjadi Promise sesuai aturan Next.js terbaru
export default async function HistorySummaryPage({ params }: { params: Promise<{ id: string }> }) {

  // 🌟 FIX 2: Kita "buka" dulu isi params-nya menggunakan await!
  const resolvedParams = await params;

  // 1. Tarik data sesi latihan spesifik ini dari Database
  const session = await prisma.workoutSession.findUnique({
    where: { id: resolvedParams.id }, // Sekarang ID-nya pasti terbaca!
    include: {
      sets: {
        include: { exercise: true }
      }
    }
  });

  // Kalau datanya nggak ketemu (ID ngasal), tendang balik ke history
  if (!session) {
    redirect('/history');
  }

  // Bimbing TypeScript biar nggak bingung
  const sessionSets = (session.sets || []) as any[];

  // 2. Kalkulasi Volume Total
  const totalVolume = sessionSets.reduce((sum: number, set: any) => {
    const w = set.weight || 0;
    const r = set.reps || 0;
    return sum + (w * r);
  }, 0);

  // 3. Kelompokkan set berdasarkan gerakan
  const groupedSets = sessionSets.reduce((acc: any, set: any) => {
    const exName = set.exercise?.name || 'Unknown Exercise';
    if (!acc[exName]) {
      acc[exName] = { name: exName, sets: [] };
    }
    acc[exName].sets.push(set);
    return acc;
  }, {});

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  };

  return (
    <div className="bg-[#000000] bg-summary-pattern text-on-background min-h-screen pb-10">

      <nav className="relative w-full z-50 flex justify-center items-center h-20 bg-background/90 backdrop-blur-md border-b border-outline-variant">
        <div className="font-headline-lg text-headline-lg font-black text-primary tracking-tighter uppercase italic">
          v-track
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-5 md:px-12 py-10">
        <header className="mb-12 text-center md:text-left">
          <h1 className="font-display-lg text-display-lg text-primary italic uppercase mb-2">WORKOUT RECAP</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant font-bold uppercase tracking-widest">
            SESI <span className="text-white">{session.name}</span> PADA {formatDate(session.startTime)}.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="bg-surface/80 backdrop-blur-sm border border-outline-variant p-6 flex flex-col items-start justify-center min-h-[140px] rounded-xl shadow-lg">
            <span className="font-label-caps text-label-caps text-on-surface-variant mb-2">TOTAL VOLUME</span>
            <div className="font-display-lg text-display-lg text-primary italic">
              {totalVolume.toLocaleString('id-ID')} <span className="text-headline-md font-headline-md not-italic text-on-surface-variant">kg</span>
            </div>
          </div>
          <div className="bg-surface/80 backdrop-blur-sm border border-outline-variant p-6 flex flex-col items-start justify-center min-h-[140px] rounded-xl shadow-lg">
            <span className="font-label-caps text-label-caps text-on-surface-variant mb-2">TANGGAL LATIHAN</span>
            <div className="font-display-lg text-display-lg text-primary italic">{formatDate(session.startTime)}</div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-headline-md text-headline-md text-on-background mb-6 uppercase italic border-b border-outline-variant pb-2">
            Exercise Recap
          </h2>
          <div className="space-y-4">
            {Object.values(groupedSets).map((group: any) => (
              <div key={group.name} className="bg-surface/90 border border-outline-variant rounded-xl overflow-hidden shadow-md">
                <div className="bg-surface-container-high px-4 py-3 border-b border-outline-variant">
                  <h3 className="font-label-caps text-label-caps text-primary uppercase">{group.name}</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-4 gap-2 font-label-caps text-label-caps text-on-surface-variant mb-3 pb-2 border-b border-outline-variant/30">
                    <div>SET</div>
                    <div>KG</div>
                    <div>REPS</div>
                    <div>RPE</div>
                  </div>
                  <div className="space-y-3 font-body-md text-body-md">
                    {group.sets.map((set: any, index: number) => (
                      <div key={set.id} className="grid grid-cols-4 gap-2 items-center">
                        <div className="text-on-surface-variant font-bold">{index + 1}</div>
                        <div className="text-on-surface font-bold">{set.weight || 0}</div>
                        <div className="text-primary font-bold">{set.reps || 0}</div>
                        <div className="text-primary font-bold">{set.rpe || '-'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4 pb-10">
          <Link
            href="/history"
            className="w-full bg-primary text-background font-label-caps text-label-caps py-4 px-6 uppercase tracking-widest active:scale-95 transition-transform hover:bg-primary-fixed border border-primary rounded-xl font-bold shadow-[0_0_15px_rgba(204,255,128,0.2)] flex justify-center text-center"
          >
            KEMBALI KE HISTORY
          </Link>
        </section>

      </main>
    </div>
  );
}