'use client';

import React, { useState } from 'react';
import { useUserStore } from '@/store/user';
import GuestModal from '@/components/GuestModal';

export default function HistoryGuestBanner() {
  const { isGuest } = useUserStore();
  const [showModal, setShowModal] = useState(false);

  if (!isGuest) return null;

  return (
    <>
      <GuestModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-amber-300">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-2xl text-amber-400">info</span>
          <div>
            <p className="font-bold text-sm">Mode Tamu (Data Histori Dummy)</p>
            <p className="text-xs text-amber-300/80">Histori latihan asli Anda akan tersimpan secara permanen setelah login / register.</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="self-start md:self-auto px-4 py-2 bg-amber-400 hover:bg-amber-500 text-black font-label-caps text-xs font-bold uppercase rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">login</span>
          Login / Register
        </button>
      </div>
    </>
  );
}
