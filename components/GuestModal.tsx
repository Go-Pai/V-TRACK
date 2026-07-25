'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user';

type GuestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
};

export default function GuestModal({
  isOpen,
  onClose,
  title = 'AKUN TAMU',
  message = 'Anda sedang menggunakan akun tamu. Silahkan login atau register untuk menyimpan progres latihan dan mengakses fitur secara penuh.',
}: GuestModalProps) {
  const router = useRouter();
  const { loginAsUser } = useUserStore();

  if (!isOpen) return null;

  const handleLoginRegister = () => {
    loginAsUser(); // reset status tamu ke user biasa jika kembali ke login
    router.push('/');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="bg-surface border border-primary/40 rounded-xl max-w-sm w-full p-6 shadow-[0_0_30px_rgba(163,230,53,0.15)] animate-in zoom-in-95 duration-200 text-center">
        <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4 text-primary">
          <span className="material-symbols-outlined text-3xl">no_accounts</span>
        </div>

        <h3 className="font-headline-md text-headline-md text-primary font-black uppercase tracking-tight mb-2">
          {title}
        </h3>

        <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={handleLoginRegister}
            type="button"
            className="w-full py-3 bg-primary hover:bg-[#86c82a] text-black font-label-caps uppercase tracking-widest font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(163,230,53,0.3)] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">login</span>
            Login / Register
          </button>

          <button
            onClick={onClose}
            type="button"
            className="w-full py-3 bg-surface-container-high hover:bg-surface-variant text-on-surface-variant hover:text-on-surface font-label-caps uppercase tracking-widest rounded-lg transition-colors border border-outline-variant active:scale-[0.98]"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
