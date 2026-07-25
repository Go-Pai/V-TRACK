'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkoutStore } from '@/store/workout';
import { useUserStore } from '@/store/user';
import { createWorkoutSession } from '@/app/actions/workout';

import GuestModal from '@/components/GuestModal';

// KOMPONEN SETROW
type SetRowProps = {
  setNumber: number;
  valueKg: string;
  valueReps: string;
  valueRpe: string;
  isCompleted: boolean;
  onWeightChange: (val: string) => void;
  onRepsChange: (val: string) => void;
  onRpeChange: (val: string) => void;
  onToggle: (checked: boolean) => void;
};

function SetRow({
  setNumber, valueKg, valueReps, valueRpe, isCompleted,
  onWeightChange, onRepsChange, onRpeChange, onToggle
}: SetRowProps) {
  const rowClasses = isCompleted
    ? 'group grid grid-cols-[30px_1fr_1fr_1fr_40px] md:grid-cols-[40px_1fr_1fr_1fr_50px] gap-2 items-center p-2 rounded border border-primary bg-primary/10 transition-all'
    : 'group grid grid-cols-[30px_1fr_1fr_1fr_40px] md:grid-cols-[40px_1fr_1fr_1fr_50px] gap-2 items-center p-2 rounded border border-outline-variant bg-transparent transition-all';

  const numClasses = isCompleted
    ? 'text-center font-body-md text-body-md font-bold text-primary'
    : 'text-center font-body-md text-body-md font-bold text-on-surface-variant group-focus-within:text-on-surface';

  const inputClasses = isCompleted
    ? 'w-full h-[56px] bg-primary/20 border-2 border-primary !text-black font-black text-center text-body-lg rounded transition-all !opacity-100 cursor-not-allowed'
    : 'w-full h-[56px] bg-white border border-outline-variant !text-black font-bold text-center text-body-md rounded focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-gray-400';

  return (
    <div className={rowClasses}>
      <div className={numClasses}>{setNumber}</div>
      <div>
        <input className={inputClasses} disabled={isCompleted} type="number" value={valueKg} onChange={(e) => onWeightChange(e.target.value)} placeholder="-" />
      </div>
      <div>
        <input className={inputClasses} disabled={isCompleted} type="number" value={valueReps} onChange={(e) => onRepsChange(e.target.value)} placeholder="-" />
      </div>
      <div>
        <input className={inputClasses} disabled={isCompleted} type="number" value={valueRpe} onChange={(e) => onRpeChange(e.target.value)} placeholder="-" />
      </div>
      <div className="flex justify-center items-center">
        <input className="workout-checkbox w-8 h-8 md:w-10 md:h-10 rounded bg-surface-container-lowest border-2 border-outline-variant focus:ring-primary focus:ring-offset-0 transition-colors cursor-pointer" type="checkbox" checked={isCompleted} onChange={(e) => onToggle(e.target.checked)} />
      </div>
    </div>
  );
}

export default function ActiveWorkoutPage() {
  const router = useRouter();
  const { name, profilePicture, isGuest } = useUserStore();
  const firstName = name ? name.split(' ')[0] : 'User';
  // 🌟 Tarik fungsi hapus (removeExercise)
  const { workoutName, activeExercises, startTime, addSet, updateSet, removeExercise } = useWorkoutStore();

  const [timerDisplay, setTimerDisplay] = useState("00:00:00");
  const [isClient, setIsClient] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Modal States
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);

  // 🌟 State khusus untuk Modal Hapus Gerakan
  const [exerciseToDelete, setExerciseToDelete] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!startTime) return;
    const interval = setInterval(() => {
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - new Date(startTime).getTime()) / 1000);
      const hours = String(Math.floor(diffInSeconds / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((diffInSeconds % 3600) / 60)).padStart(2, '0');
      const seconds = String(diffInSeconds % 60).padStart(2, '0');
      setTimerDisplay(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const totalVolume = activeExercises.reduce((total, exercise) => {
    const exerciseVolume = exercise.sets.reduce((sum, set) => {
      if (set.isCompleted && set.weight && set.reps) {
        return sum + (parseFloat(set.weight) * parseFloat(set.reps));
      }
      return sum;
    }, 0);
    return total + exerciseVolume;
  }, 0);

  const handleRequestFinish = () => {
    if (isGuest) {
      setShowGuestModal(true);
      return;
    }

    const hasValidSets = activeExercises.some(ex =>
      ex.sets.some(set => set.isCompleted && set.weight && set.reps)
    );
    if (!hasValidSets) {
      setWarningMessage("Anda belum menyelesaikan satupun set! Centang minimal 1 set (Kg & Reps terisi) sebelum mengakhiri sesi.");
      setShowWarningModal(true);
      return;
    }
    setShowConfirmModal(true);
  };

  const executeFinishWorkout = async () => {
    setShowConfirmModal(false);
    setIsSaving(true);

    const payload = {
      name: workoutName,
      startTime: startTime ? new Date(startTime) : null,
      exercises: activeExercises
    };

    const res = await createWorkoutSession(payload);

    if (res.success) {
      router.push('/workout/summary');
    } else {
      setWarningMessage("Sistem error gagal menyimpan: " + res.error);
      setShowWarningModal(true);
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (isClient && activeExercises.length === 0) {
      router.push('/workout/start');
    }
  }, [isClient, activeExercises, router]);

  if (!isClient || activeExercises.length === 0) return null;

  return (
    <div className="antialiased flex flex-col min-h-screen relative pb-[120px]">

      {/* MODAL GUEST */}
      <GuestModal isOpen={showGuestModal} onClose={() => setShowGuestModal(false)} />

      {/* MODAL WARNING */}
      {showWarningModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-surface border border-red-500/50 rounded-xl max-w-sm w-full p-6 shadow-[0_0_30px_rgba(239,68,68,0.2)] animate-in zoom-in-95 duration-200 text-center">
            <span className="material-symbols-outlined text-red-500 text-5xl mb-4">warning</span>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2 uppercase">Perhatian</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">{warningMessage}</p>
            <button onClick={() => setShowWarningModal(false)} className="w-full py-3 bg-surface-container-highest hover:bg-surface-variant text-on-surface font-label-caps uppercase tracking-widest rounded-lg transition-colors border border-outline-variant">Mengerti</button>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI AKHIRI */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-surface border border-outline-variant rounded-xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2 uppercase text-center italic font-black text-primary">AKHIRI SESI?</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6 text-center">Apakah Anda yakin ingin menyelesaikan dan merekap sesi latihan ini ke database?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 bg-transparent hover:bg-surface-variant text-on-surface-variant font-label-caps uppercase tracking-widest rounded-lg transition-colors border border-outline-variant">Batal</button>
              <button onClick={executeFinishWorkout} className="flex-1 py-3 bg-primary hover:bg-[#86c82a] text-black font-label-caps uppercase tracking-widest font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(163,230,53,0.3)]">Akhiri</button>
            </div>
          </div>
        </div>
      )}

      {/* 🌟 MODAL KONFIRMASI HAPUS GERAKAN 🌟 */}
      {exerciseToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-surface border border-red-500/50 rounded-xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2 uppercase text-center italic font-black text-red-500">HAPUS GERAKAN?</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6 text-center">Apakah Anda yakin ingin menghapus gerakan ini? Semua data set pada gerakan ini akan hilang.</p>
            <div className="flex gap-3">
              <button onClick={() => setExerciseToDelete(null)} className="flex-1 py-3 bg-transparent hover:bg-surface-variant text-on-surface-variant font-label-caps uppercase tracking-widest rounded-lg transition-colors border border-outline-variant">Batal</button>
              <button
                onClick={() => {
                  removeExercise(exerciseToDelete);
                  setExerciseToDelete(null);
                }}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-label-caps uppercase tracking-widest font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)]"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-5 md:px-12 h-20 bg-surface border-b border-outline-variant">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-2 rounded-full hover:bg-surface-variant active:scale-95">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </Link>
          <div className="font-headline-lg text-headline-lg font-black uppercase tracking-normal text-primary">v-track</div>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-body-md text-on-surface">
            Hai, {isClient ? firstName : 'User'}
          </span>
          <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary overflow-hidden">
            {isClient && profilePicture ? (
              <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined">person</span>
            )}
          </div>
        </div>
      </nav>

      <div className="h-20 w-full"></div>

      {/* TOP STATS BAR */}
      <div className="sticky top-20 z-40 w-full bg-surface/90 backdrop-blur-md border-b border-outline-variant py-3 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 md:px-12 flex justify-between items-center">
          <div className="flex flex-col items-center">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-[10px] md:text-[12px]">Timer</span>
            <span className="font-headline-md text-headline-md text-primary font-bold">{timerDisplay}</span>
          </div>
          <div className="w-px h-10 bg-outline-variant"></div>
          <div className="flex flex-col items-center">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-[10px] md:text-[12px]">Volume</span>
            <span className="font-headline-md text-headline-md text-on-surface font-bold">
              {totalVolume.toLocaleString('id-ID')} <span className="text-sm font-normal text-on-surface-variant">kg</span>
            </span>
          </div>
          <div className="w-px h-10 bg-outline-variant"></div>
          <div className="flex flex-col items-center">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-[10px] md:text-[12px]">Exercise</span>
            <span className="font-headline-md text-headline-md text-on-surface font-bold">{activeExercises.length}</span>
          </div>
        </div>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-5 md:px-12 py-6 md:py-10 flex flex-col gap-6">
        <div className="mb-4">
          <p className="font-label-caps text-label-caps text-primary tracking-widest uppercase mb-1">Active Session</p>
          <h1 className="text-2xl md:text-3xl lg:text-4xl text-on-surface uppercase italic font-black tracking-tight leading-none">
            {workoutName || 'SESI LATIHAN'}
          </h1>
        </div>

        <div className="flex flex-col gap-10">
          {activeExercises.map((exercise) => (
            <div key={exercise.id} className="bg-surface-container-low border border-outline-variant rounded-lg p-4 md:p-6 flex flex-col gap-4 shadow-sm relative group">

              <div className="flex justify-between items-start mb-2">
                <h2 className="font-headline-md text-headline-md font-bold text-on-surface pr-10">
                  {exercise.name}
                </h2>
                {/* 🌟 TOMBOL HAPUS "X" 🌟 */}
                <button
                  onClick={() => setExerciseToDelete(exercise.id)}
                  className="absolute top-4 right-4 text-outline hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded-md transition-all active:scale-90"
                  title="Hapus Gerakan"
                >
                  <span className="material-symbols-outlined text-[24px]">close</span>
                </button>
              </div>

              <div className="grid grid-cols-[30px_1fr_1fr_1fr_40px] md:grid-cols-[40px_1fr_1fr_1fr_50px] gap-2 items-center px-2 font-label-caps text-label-caps text-on-surface-variant uppercase border-b border-outline-variant pb-2">
                <div className="text-center">Set</div>
                <div className="text-center">Kg</div>
                <div className="text-center">Reps</div>
                <div className="text-center">RPE</div>
                <div className="text-center"><span className="material-symbols-outlined text-[16px]">check</span></div>
              </div>

              <div className="flex flex-col gap-2">
                {exercise.sets.map((set, index) => (
                  <SetRow
                    key={set.id} setNumber={index + 1} valueKg={set.weight} valueReps={set.reps} valueRpe={set.rpe} isCompleted={set.isCompleted}
                    onWeightChange={(val) => updateSet(exercise.id, set.id, 'weight', val)}
                    onRepsChange={(val) => updateSet(exercise.id, set.id, 'reps', val)}
                    onRpeChange={(val) => updateSet(exercise.id, set.id, 'rpe', val)}
                    onToggle={(checked) => updateSet(exercise.id, set.id, 'isCompleted', checked)}
                  />
                ))}
              </div>

              <button onClick={() => addSet(exercise.id)} className="mt-2 w-full h-[48px] border border-outline-variant text-on-surface font-label-caps text-label-caps uppercase tracking-widest rounded-md hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                <span className="material-symbols-outlined">add</span> Tambah Set
              </button>
            </div>
          ))}

          {/* 🌟 TOMBOL TAMBAH GERAKAN EXTRA 🌟 */}
          <button
            onClick={() => router.push('/workout/start')}
            className="w-full h-[60px] border-2 border-dashed border-outline-variant text-on-surface-variant font-label-caps uppercase tracking-widest rounded-xl hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 active:scale-[0.98] mt-4"
          >
            <span className="material-symbols-outlined">add_circle</span>
            TAMBAH GERAKAN LAIN
          </button>

        </div>
      </main>

      {/* FLOATING ACTION BUTTON */}
      <div className="fixed bottom-6 left-0 w-full flex justify-center z-40 pointer-events-none">
        <button
          onClick={handleRequestFinish}
          disabled={isSaving}
          className="pointer-events-auto h-[48px] px-8 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-label-caps text-label-caps font-bold uppercase tracking-widest rounded-full shadow-[0_4px_15px_rgba(220,38,38,0.3)] transition-all flex items-center justify-center gap-2 active:scale-[0.95] disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span> : <span className="material-symbols-outlined text-[18px]">stop_circle</span>}
          {isSaving ? 'MENYIMPAN...' : 'AKHIRI LATIHAN'}
        </button>
      </div>
    </div>
  );
}