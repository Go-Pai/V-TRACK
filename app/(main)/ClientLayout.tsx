'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useUserStore } from '@/store/user';

export default function ClientLayout({
  children,
  user
}: {
  children: React.ReactNode;
  user: any;
}) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const { profilePicture } = useUserStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Ambil nama depan dari session (NextAuth)
  const firstName = user?.name ? user.name.split(' ')[0] : 'Athlete';
  const displayImage = profilePicture || user?.image;

  return (
    <div className="min-h-screen bg-background text-on-background pb-[100px] md:pb-0">
      {/* TOP NAVBAR (Desktop & Mobile Header) */}
      <nav className="relative w-full z-50 flex justify-between items-center px-5 md:px-12 h-20 bg-surface border-b border-outline-variant">
        <Link className="font-headline-lg text-headline-lg font-black uppercase tracking-tighter text-primary" href="/dashboard">
          v-track
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center">
          <Link className={`font-label-caps text-[12px] uppercase tracking-widest font-bold transition-colors ${pathname === '/dashboard' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`} href="/dashboard">Dashboard</Link>
          <Link className={`font-label-caps text-[12px] uppercase tracking-widest font-bold transition-colors ${pathname === '/history' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`} href="/history">History</Link>
          <Link className={`font-label-caps text-[12px] uppercase tracking-widest font-bold transition-colors ${pathname === '/profile' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`} href="/profile">Profile</Link>
        </div>

        {/* Profile/Avatar Dinamis */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:block font-body-md text-on-surface">
            Hai, {isMounted ? firstName : '...'}
          </span>
          <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary overflow-hidden">
            {isMounted && displayImage ? (
              <img src={displayImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined">person</span>
            )}
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      {children}

      {/* BOTTOM NAVBAR (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-20 bg-surface border-t border-outline-variant flex justify-around items-center z-50">
        <Link className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/dashboard' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`} href="/dashboard">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Dashboard</span>
        </Link>

        <Link className="flex flex-col items-center gap-1 text-primary hover:text-primary-fixed transition-colors" href="/workout/start">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>fitness_center</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Workout</span>
        </Link>

        <Link className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/history' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`} href="/history">
          <span className="material-symbols-outlined">history</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">History</span>
        </Link>
        <Link className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/profile' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`} href="/profile">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
