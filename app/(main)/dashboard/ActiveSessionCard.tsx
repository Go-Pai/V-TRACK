'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useWorkoutStore } from '@/store/workout';

export default function ActiveSessionCard() {
  const { activeExercises, workoutName, startTime, resetWorkout } = useWorkoutStore();
  const [isMounted, setIsMounted] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getFormattedTime = () => {
    if (!startTime) return '';
    return new Date(startTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const hasActiveSession = activeExercises.length > 0;

  return (
    <>
      {/* MODAL KONFIRMASI PEMBATALAN */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-surface border border-red-500/50 rounded-xl max-w-sm w-full p-6 shadow-[0_0_30px_rgba(239,68,68,0.2)] animate-in zoom-in-95 duration-200">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2 uppercase text-center italic font-black text-red-500">BATALKAN SESI?</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6 text-center">Apakah Anda yakin ingin membatalkan sesi ini? Semua progres yang belum disimpan akan hilang.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowCancelModal(false)} className="flex-1 py-3 bg-transparent hover:bg-surface-variant text-on-surface-variant font-label-caps uppercase tracking-widest rounded-lg transition-colors border border-outline-variant">Tutup</button>
              <button 
                onClick={() => {
                  resetWorkout();
                  setShowCancelModal(false);
                }} 
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-label-caps uppercase tracking-widest font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)]"
              >
                Batalkan
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">

        {/* Card 1: Ongoing Session (HANYA MUNCUL JIKA ADA SESI AKTIF) */}
        {isMounted && hasActiveSession && (
          <article className="bg-surface-container-low border border-primary/40 p-6 rounded-xl flex flex-col justify-between group transition-all duration-300 shadow-[0_0_15px_rgba(163,230,53,0.1)]">
            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>timer</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">Session Active</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Started: {getFormattedTime()}
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowCancelModal(true);
                    }}
                    className="text-outline hover:text-red-500 transition-colors flex items-center justify-center active:scale-95"
                    title="Batalkan Sesi"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
            </div>
            <h2 className="text-xl font-bold text-on-surface truncate">
              {workoutName || 'Sesi Latihan'}
            </h2>
          </div>
          <Link
            href="/workout/active"
            className="w-full py-3 bg-primary text-black text-xs font-bold uppercase tracking-widest rounded flex items-center justify-center gap-2 hover:bg-[#86c82a] transition-colors active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">play_arrow</span>
            Lanjutkan Latihan
          </Link>
        </article>
      )}

      {/* Card 2: Start New (Kembali ke desain kotak hitam elegan!) */}
      <Link
        href="/workout/start"
        className="bg-[#0a0a0a] border border-[#1f2937] hover:border-primary/50 transition-colors rounded-xl flex flex-col items-center justify-center min-h-[180px] md:min-h-[200px] group cursor-pointer"
      >
        <span className="material-symbols-outlined text-[32px] text-on-surface-variant mb-3 group-hover:text-primary transition-colors">add</span>
        <span className="text-lg font-bold text-on-surface-variant group-hover:text-primary transition-colors">Mulai Latihan</span>
      </Link>
    </section>
    </>
  );
}