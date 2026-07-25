'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation'; // 🌟 TAMBAHAN: Buat pindah halaman
import React, { useState, useEffect } from 'react';
import { getExercises, createExercise, deleteExercise } from '@/app/actions/exercise';
import { useWorkoutStore } from '@/store/workout'; // 🌟 TAMBAHAN: Import Brankas
import {
  Dumbbell,
  ArrowUpFromLine,
  ArrowUp,
  Footprints,
  BicepsFlexed,
  ShieldCheck,
  HeartPulse
} from 'lucide-react';

export default function StartWorkoutPage() {
  const router = useRouter();
  const { activeExercises, startWorkout, addExtraExercises } = useWorkoutStore(); // Pastikan narik addExtraExercises juga
  const isAddingToSession = activeExercises && activeExercises.length > 0; // Cek apakah lagi di tengah sesi

  const [exercises, setExercises] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('DADA');

  // 🌟 STATE BARU: Untuk menyimpan inputan user sebelum dikirim ke brankas
  const [workoutName, setWorkoutName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<any[]>([]);
  const [showWarning, setShowWarning] = useState(false); // 🌟 TAMBAHAN INI

  // State Form Custom
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customTarget, setCustomTarget] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    const res = await getExercises();
    if (res?.success) {
      setExercises(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredExercises = exercises.filter((ex) => ex.category === activeCategory);

  const getCategoryClass = (category: string) => {
    const base = "flex items-center gap-3 p-3.5 transition-colors border-l-4 text-left ";
    if (activeCategory === category) {
      return base + "bg-primary/10 text-primary font-bold border-primary";
    }
    return base + "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface border-transparent";
  };

  // 🌟 FUNGSI BARU: Nambah/Hapus centangan gerakan
  const toggleExercise = (exercise: any) => {
    const isSelected = selectedExercises.some((ex) => ex.id === exercise.id);
    if (isSelected) {
      setSelectedExercises(selectedExercises.filter((ex) => ex.id !== exercise.id));
    } else {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  // 🌟 FUNGSI BARU: Eksekusi saat tombol MULAI ditekan
  const handleStartWorkout = () => {
    if (selectedExercises.length === 0) {
      // 🌟 Ganti alert() jadi Toast yang otomatis hilang dalam 3 detik
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }

    if (isAddingToSession) {
      // 🌟 KONDISI 1: Kalau lagi nambah gerakan di tengah sesi
      addExtraExercises(selectedExercises);
    } else {
      // 🌟 KONDISI 2: Kalau bikin sesi baru dari awal
      startWorkout(workoutName || 'Sesi Latihan', selectedExercises);
    }

    // 2. Pindah ke halaman Active
    router.push('/workout/active');
  };

  const handleSaveCustom = async () => {
    if (!customName.trim()) return;
    setIsSaving(true);
    const res = await createExercise({ name: customName, category: activeCategory, target: customTarget });
    if (res.success) {
      setCustomName('');
      setCustomTarget('');
      setIsAddingCustom(false);
      await loadData();
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    await deleteExercise(id);
    await loadData();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto">

      {/* 🌟 UI TOAST POP-UP CANTIK */}
      {showWarning && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] bg-red-500 text-white px-6 py-3 rounded-full font-bold shadow-[0_10px_40px_rgba(239,68,68,0.4)] animate-in fade-in slide-in-from-top-5 flex items-center gap-2">
          <span className="material-symbols-outlined">warning</span>
          Pilih minimal 1 gerakan dulu ya, Senpai! 🏋️‍♂️
        </div>
      )}

      <div className="bg-surface border border-outline-variant rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">

        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant bg-surface-container-low sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl">fitness_center</span>
            <h2 className="text-on-surface font-headline-md text-xl uppercase tracking-wide">Persiapan Sesi Latihan</h2>
          </div>
          <Link href="/dashboard" className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-variant flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">close</span>
          </Link>
        </div>

        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          <div className="w-full">
            <input
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              className="w-full bg-surface-container-high text-on-surface text-headline-md placeholder:text-outline border border-outline-variant rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all"
              placeholder="Ketik nama sesi latihan (misal: Push Day)..."
              type="text"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-5 flex flex-col gap-2">
              <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest px-1">
                Kategori Otot
              </h3>
              <div className="bg-surface-container rounded-xl overflow-hidden flex flex-col border border-outline-variant">
                <button onClick={() => setActiveCategory('DADA')} className={getCategoryClass('DADA')}>
                  <Dumbbell size={20} className="stroke-[2.5px]" />
                  <span className="text-body-md uppercase tracking-wide">Dada</span>
                </button>
                <button onClick={() => setActiveCategory('PUNGGUNG')} className={getCategoryClass('PUNGGUNG')}>
                  <ArrowUpFromLine size={20} className="stroke-[2.5px]" />
                  <span className="text-body-md uppercase tracking-wide">Punggung</span>
                </button>
                <button onClick={() => setActiveCategory('BAHU')} className={getCategoryClass('BAHU')}>
                  <ArrowUp size={20} className="stroke-[2.5px]" />
                  <span className="text-body-md uppercase tracking-wide">Bahu</span>
                </button>
                <button onClick={() => setActiveCategory('KAKI')} className={getCategoryClass('KAKI')}>
                  <Footprints size={20} className="stroke-[2.5px]" />
                  <span className="text-body-md uppercase tracking-wide">Kaki</span>
                </button>
                <button onClick={() => setActiveCategory('LENGAN')} className={getCategoryClass('LENGAN')}>
                  <BicepsFlexed size={20} className="stroke-[2.5px]" />
                  <span className="text-body-md uppercase tracking-wide">Lengan</span>
                </button>
                <button onClick={() => setActiveCategory('CORE')} className={getCategoryClass('CORE')}>
                  <ShieldCheck size={20} className="stroke-[2.5px]" />
                  <span className="text-body-md uppercase tracking-wide">Core</span>
                </button>
              </div>
            </div>

            <div className="md:col-span-7 flex flex-col gap-2">
              <div className="flex justify-between items-center px-1">
                <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                  Pilih Gerakan ({activeCategory})
                </h3>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                  {selectedExercises.length} Dipilih
                </span>
              </div>

              <div className="bg-surface-container rounded-xl p-4 flex flex-col gap-3 border border-outline-variant">
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <span className="text-primary animate-pulse text-sm font-label-caps">Memuat daftar gerakan...</span>
                  </div>
                ) : filteredExercises.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-on-surface-variant opacity-70">
                    <span className="material-symbols-outlined text-4xl mb-2">fitness_center</span>
                    <p className="text-sm">Belum ada gerakan di kategori ini.</p>
                  </div>
                ) : (
                  filteredExercises.map((exercise: any) => (
                    <div key={exercise.id} className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high transition-colors border border-outline-variant group">
                      <label className="flex items-start gap-3 flex-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedExercises.some((ex) => ex.id === exercise.id)}
                          onChange={() => toggleExercise(exercise)}
                          className="w-5 h-5 mt-0.5 rounded border-outline-variant bg-transparent text-primary focus:ring-primary checked:bg-primary transition-colors cursor-pointer"
                        />
                        <div>
                          <p className="text-body-md font-bold text-on-surface group-hover:text-primary transition-colors">
                            {exercise.name}
                          </p>
                          {exercise.target && (
                            <p className="text-xs text-on-surface-variant mt-0.5">Target: {exercise.target}</p>
                          )}
                        </div>
                      </label>

                      {exercise.userId && (
                        <button
                          onClick={() => handleDelete(exercise.id)}
                          className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all opacity-50 hover:opacity-100"
                          title="Hapus Gerakan Kustom"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      )}
                    </div>
                  ))
                )}

                {isAddingCustom ? (
                  <div className="bg-surface-container-low p-4 rounded-xl border border-primary/50 animate-in fade-in mt-1">
                    <h4 className="text-xs font-label-caps text-on-surface-variant mb-3">Tambah Gerakan Kustom</h4>
                    <input
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="Nama Gerakan..."
                      className="w-full bg-white text-black placeholder:text-gray-500 p-3 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      value={customTarget}
                      onChange={(e) => setCustomTarget(e.target.value)}
                      placeholder="Target Otot (Opsional)..."
                      className="w-full bg-white text-black placeholder:text-gray-500 p-3 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveCustom}
                        disabled={!customName.trim() || isSaving}
                        className="flex-1 bg-primary text-black py-2 rounded-lg font-bold transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
                      >
                        {isSaving ? 'Menyimpan...' : 'Simpan'}
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingCustom(false);
                          setCustomName('');
                          setCustomTarget('');
                        }}
                        className="px-4 py-2 border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded-lg transition-all active:scale-95"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setIsAddingCustom(true)} className="mt-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-dashed border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary hover:bg-primary/5 transition-all text-xs font-bold tracking-wide">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    TAMBAH GERAKAN KUSTOM
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>

        <div className="p-4 bg-surface-container-low border-t border-outline-variant sticky bottom-0 z-10 flex justify-end gap-3">
          <Link href="/dashboard" className="px-5 py-3 rounded-xl border border-outline-variant text-on-surface-variant hover:text-on-surface font-label-caps text-xs uppercase tracking-wider flex items-center justify-center transition-colors">
            Batal
          </Link>
          <button onClick={handleStartWorkout} className="px-6 py-3 bg-primary hover:bg-[#86c82a] text-black font-extrabold rounded-xl text-body-md flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(163,230,53,0.3)] transition-all active:scale-[0.98]">
            <span>{isAddingToSession ? 'TAMBAHKAN GERAKAN' : 'MULAI SESI LATIHAN'}</span>
            <span className="material-symbols-outlined text-[20px]">{isAddingToSession ? 'add' : 'play_arrow'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}