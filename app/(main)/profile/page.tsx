'use client';

import React, { useState, useRef, useEffect, useTransition } from 'react';
import { useUserStore } from '@/store/user';
import { useSession, signOut } from 'next-auth/react';
import GuestModal from '@/components/GuestModal';
import { updateProfileInfo, getUserProfile } from '@/app/actions/user';
import { useRouter } from 'next/navigation';
import { useWorkoutStore } from '@/store/workout';

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const { name, weight, height, profilePicture, isGuest, updateProfile } = useUserStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [editName, setEditName] = useState(name);
  const [editWeight, setEditWeight] = useState(weight);
  const [editHeight, setEditHeight] = useState(height);
  const [editImage, setEditImage] = useState<string | null>(profilePicture);

  const [showWarning, setShowWarning] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
    if (session?.user) {
      // Fetch fresh data from DB on mount
      getUserProfile().then((dbUser) => {
        if (dbUser) {
          setEditName(dbUser.name || session?.user?.name || '');
          setEditWeight(dbUser.weight ? dbUser.weight.toString() : '');
          setEditHeight(dbUser.height ? dbUser.height.toString() : '');
          setEditImage(dbUser.image || session?.user?.image || null);
          
          // Sinkronisasikan ke local storage juga untuk jaga-jaga
          updateProfile({
            name: dbUser.name || session?.user?.name || '',
            weight: dbUser.weight ? dbUser.weight.toString() : '',
            height: dbUser.height ? dbUser.height.toString() : '',
            profilePicture: dbUser.image || session?.user?.image || null
          });
        }
      });
    } else {
      setEditName(name);
      setEditWeight(weight);
      setEditHeight(height);
      setEditImage(profilePicture);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, isGuest]);

  const isDirty = editName !== (session?.user?.name || name) || editWeight !== weight || editHeight !== height || editImage !== profilePicture;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isGuest) {
      setShowGuestModal(true);
      return;
    }
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (isGuest) {
      setShowGuestModal(true);
      return;
    }

    startTransition(async () => {
      try {
        await updateProfileInfo({
          name: editName,
          weight: editWeight,
          height: editHeight,
          image: editImage || undefined
        });
        
        // Update session secara paksa agar layout Navbar ter-update jika Auth.js bisa mendeteksinya
        await updateSession();

        // Update local state fallback
        updateProfile({ name: editName, weight: editWeight, height: editHeight, profilePicture: editImage });

        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
          router.refresh();
        }, 2000);
      } catch (error) {
        console.error("Failed to update profile", error);
      }
    });
  };

  const handleCancelClick = () => {
    if (isDirty) {
      setShowWarning(true);
    }
  };

  const handleLogout = () => {
    useWorkoutStore.getState().resetWorkout();
    
    if (isGuest) {
      updateProfile({ isGuest: false });
      startTransition(async () => {
        const { clearGuestCookie } = await import('@/app/actions/guest');
        await clearGuestCookie();
      });
    } else {
      signOut({ callbackUrl: '/' });
    }
  };

  const confirmCancel = () => {
    if (session?.user) {
      getUserProfile().then((dbUser) => {
        if (dbUser) {
          setEditName(dbUser.name || '');
          setEditWeight(dbUser.weight ? dbUser.weight.toString() : '');
          setEditHeight(dbUser.height ? dbUser.height.toString() : '');
          setEditImage(dbUser.image || null);
        }
      });
    } else {
      setEditName(name);
      setEditWeight(weight);
      setEditHeight(height);
      setEditImage(profilePicture);
    }
    setShowWarning(false);
  };

  if (!isMounted) return null;

  const displayUserId = isGuest ? 'GUEST-PREVIEW' : (session?.user?.id?.substring(0, 8) || 'USER-PROFILE');

  return (
    <main className="max-w-4xl mx-auto px-5 md:px-12 py-10 flex flex-col items-center min-h-[80vh] justify-center relative">
      {/* MODAL GUEST */}
      <GuestModal isOpen={showGuestModal} onClose={() => setShowGuestModal(false)} />

      {/* MODAL PERINGATAN */}
      {showWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-surface border border-outline-variant rounded-xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="font-headline-md text-headline-md text-primary mb-2 uppercase text-center italic font-black">BATALKAN PERUBAHAN?</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6 text-center">Anda memiliki perubahan yang belum disimpan. Yakin ingin membatalkan?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowWarning(false)} className="flex-1 py-3 bg-transparent hover:bg-surface-variant text-on-surface font-label-caps uppercase tracking-widest rounded-lg transition-colors border border-outline-variant">Kembali</button>
              <button onClick={confirmCancel} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-label-caps uppercase tracking-widest font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)]">Ya, Batalkan</button>
            </div>
          </div>
        </div>
      )}

      <input type="file" accept="image/png, image/jpeg, image/webp" ref={fileInputRef} onChange={handleImageChange} className="hidden" />

      {/* AREA FOTO PROFIL */}
      <div onClick={() => fileInputRef.current?.click()} className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-primary overflow-hidden cursor-pointer group mb-8 shadow-[0_0_30px_rgba(163,230,53,0.15)]">
        {editImage ? (
          <img src={editImage} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
            <span className="material-symbols-outlined text-[64px] text-primary">person</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="material-symbols-outlined text-white text-[40px]">photo_camera</span>
        </div>
      </div>

      {/* NAMA USER */}
      <div className="flex flex-col items-center w-full mb-10">
        {isGuest && (
          <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/40 text-amber-400 font-label-caps text-xs rounded-full mb-3 uppercase tracking-widest font-bold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            Mode Tamu (Read-Only)
          </span>
        )}
        <input
          type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
          className="bg-transparent border-b-2 border-transparent hover:border-outline-variant focus:border-primary text-center text-4xl md:text-5xl font-black italic uppercase text-on-surface focus:outline-none focus:ring-0 transition-all w-full max-w-sm pb-1"
          placeholder="Nama Anda"
        />
        <span className="text-primary font-label-caps text-[12px] uppercase tracking-widest font-bold mt-2">ID: {displayUserId}</span>
      </div>

      {/* STATS (BERAT & TINGGI) */}
      <div className="grid grid-cols-2 gap-4 md:gap-10 w-full max-w-2xl mb-12">
        <div className="flex flex-col gap-2">
          <label className="font-label-caps text-xs uppercase tracking-widest text-on-surface-variant font-bold">Berat Badan</label>
          <div className="bg-[#0a0a0a] border border-[#1f2937] rounded-lg p-4 flex justify-end items-end group focus-within:border-primary transition-colors">
            <input type="number" value={editWeight} onChange={(e) => setEditWeight(e.target.value)} className="bg-transparent text-right text-2xl font-black text-on-surface focus:outline-none focus:ring-0 w-16" />
            <span className="text-on-surface-variant text-sm ml-1 font-bold mb-[2px] group-focus-within:text-primary transition-colors">kg</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-label-caps text-xs uppercase tracking-widest text-on-surface-variant font-bold">Tinggi Badan</label>
          <div className="bg-[#0a0a0a] border border-[#1f2937] rounded-lg p-4 flex justify-end items-end group focus-within:border-primary transition-colors">
            <input type="number" value={editHeight} onChange={(e) => setEditHeight(e.target.value)} className="bg-transparent text-right text-2xl font-black text-on-surface focus:outline-none focus:ring-0 w-16" />
            <span className="text-on-surface-variant text-sm ml-1 font-bold mb-[2px] group-focus-within:text-primary transition-colors">cm</span>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="mb-4 text-primary font-label-caps font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">check_circle</span> Tersimpan!
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl items-center justify-center">
        {isDirty && !saveSuccess && (
          <div className="flex gap-3 w-full sm:w-auto animate-in fade-in duration-300">
            <button onClick={handleCancelClick} className="flex-1 sm:flex-none py-3 px-6 bg-surface-container hover:bg-surface-variant text-on-surface font-label-caps font-bold uppercase tracking-widest rounded-lg border border-outline-variant transition-colors">Batal</button>
            <button onClick={handleSave} className="flex-1 sm:flex-none py-3 px-8 bg-primary hover:bg-[#86c82a] text-black font-label-caps font-bold uppercase tracking-widest rounded-lg shadow-[0_0_15px_rgba(163,230,53,0.3)] transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">save</span> Simpan
            </button>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 py-3 px-8 bg-transparent border border-[#1f2937] hover:border-red-500 hover:text-red-500 hover:bg-red-500/10 text-on-surface-variant font-label-caps font-bold uppercase tracking-widest rounded-lg transition-colors w-full sm:w-auto mt-2 sm:mt-0"
        >
          <span className="material-symbols-outlined">logout</span> Logout
        </button>
      </div>
    </main>
  );
}