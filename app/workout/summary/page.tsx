'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkoutStore } from '@/store/workout';

export default function WorkoutSummaryPage() {
  const router = useRouter();
  const { workoutName, activeExercises, startTime, resetWorkout } = useWorkoutStore();
  const [timeElapsed, setTimeElapsed] = useState('00:00');

  // Satpam: Kalau brankas kosong, tendang ke dashboard
  useEffect(() => {
    if (activeExercises.length === 0) {
      router.push('/dashboard');
    }
  }, [activeExercises, router]);

  useEffect(() => {
    if (startTime) {
      const diffInSeconds = Math.floor((new Date().getTime() - new Date(startTime).getTime()) / 1000);
      const minutes = String(Math.floor(diffInSeconds / 60)).padStart(2, '0');
      const seconds = String(diffInSeconds % 60).padStart(2, '0');
      setTimeElapsed(`${minutes}:${seconds}`);
    }
  }, [startTime]);

  const totalVolume = activeExercises.reduce((total, exercise) => {
    const exerciseVolume = exercise.sets.reduce((sum, set) => {
      if (set.isCompleted && set.weight && set.reps) {
        return sum + (parseFloat(set.weight) * parseInt(set.reps));
      }
      return sum;
    }, 0);
    return total + exerciseVolume;
  }, 0);

  const handleFinishAndExit = () => {
    resetWorkout(); // Kosongkan brankas setelah selesai
    router.push('/dashboard');
  };

  if (activeExercises.length === 0) return null;

  return (
    <div className="bg-[#000000] bg-summary-pattern text-on-background min-h-screen pb-10">
      <nav className="relative w-full z-50 flex justify-center items-center h-20 bg-background/90 backdrop-blur-md border-b border-outline-variant">
        <div className="font-headline-lg text-headline-lg font-black text-primary tracking-tighter uppercase italic">
          v-track
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-5 md:px-12 py-10">
        <header className="mb-12 text-center md:text-left">
          <h1 className="font-display-lg text-display-lg text-primary italic uppercase mb-2">CONGRATULATIONS!</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant font-bold uppercase tracking-widest">
            SESI <span className="text-white">{workoutName || 'LATIHAN'}</span> SELESAI. YOU CRUSHED IT.
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
            <span className="font-label-caps text-label-caps text-on-surface-variant mb-2">TIME ELAPSED</span>
            <div className="font-display-lg text-display-lg text-primary italic">{timeElapsed}</div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-headline-md text-headline-md text-on-background mb-6 uppercase italic border-b border-outline-variant pb-2">
            Exercise Recap
          </h2>
          <div className="space-y-4">
            {activeExercises.map((exercise) => {
              const completedSets = exercise.sets.filter((s) => s.isCompleted && s.weight && s.reps);
              if (completedSets.length === 0) return null;

              return (
                <div key={exercise.id} className="bg-surface/90 border border-outline-variant rounded-xl overflow-hidden shadow-md">
                  <div className="bg-surface-container-high px-4 py-3 border-b border-outline-variant">
                    <h3 className="font-label-caps text-label-caps text-primary uppercase">{exercise.name}</h3>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-4 gap-2 font-label-caps text-label-caps text-on-surface-variant mb-3 pb-2 border-b border-outline-variant/30">
                      <div>SET</div>
                      <div>KG</div>
                      <div>REPS</div>
                      <div>RPE</div>
                    </div>
                    <div className="space-y-3 font-body-md text-body-md">
                      {completedSets.map((set, index) => (
                        <div key={set.id} className="grid grid-cols-4 gap-2 items-center">
                          <div className="text-on-surface-variant font-bold">{index + 1}</div>
                          <div className="text-on-surface font-bold">{set.weight}</div>
                          <div className="text-primary font-bold">{set.reps}</div>
                          <div className="text-primary font-bold">{set.rpe || '-'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-4 pb-10">
          <button
            onClick={handleFinishAndExit}
            className="w-full bg-primary text-background font-label-caps text-label-caps py-4 px-6 uppercase tracking-widest active:scale-95 transition-transform hover:bg-primary-fixed border border-primary rounded-xl font-bold shadow-[0_0_15px_rgba(204,255,128,0.2)] flex justify-center text-center"
          >
            KEMBALI KE DASHBOARD
          </button>
        </section>
      </main>
    </div>
  );
}