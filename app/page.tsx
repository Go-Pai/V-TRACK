'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useUserStore } from '@/store/user';

import { setGuestCookie } from '@/app/actions/guest';
import { useTransition } from 'react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  const [isPending, startTransition] = useTransition();

  const { loginAsGuest } = useUserStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      setLoading(false);

      if (res?.error) {
        setError('Invalid email or password. Please try again.');
      } else {
        const { updateProfile } = useUserStore.getState();
        updateProfile({ isGuest: false });
        startTransition(async () => {
          const { clearGuestCookieOnly } = await import('@/app/actions/guest');
          await clearGuestCookieOnly();
          router.push('/dashboard');
          router.refresh();
        });
      }
    } catch (err: any) {
      setLoading(false);
      setError('An error occurred during sign in.');
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    startTransition(async () => {
      await setGuestCookie();
      router.push('/dashboard');
      router.refresh();
    });
  };

  return (
    <div className="bg-surface-container rounded-xl border border-outline-variant p-6 md:p-10 shadow-2xl flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center mb-4">
        <h1 className="text-primary-container text-display-lg uppercase tracking-tight">v-track</h1>
        <p className="text-on-surface-variant text-base">Welcome back to the high-performance zone.</p>
      </div>

      {registered && (
        <div className="bg-primary/20 border border-primary text-primary text-sm p-3 rounded text-center">
          Account created successfully! Please sign in below.
        </div>
      )}

      {error && (
        <div className="bg-error-container/20 border border-error text-error text-sm p-3 rounded text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSignIn} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-on-surface text-sm font-medium" htmlFor="email">Email</label>
          <input
            className="w-full rounded border border-outline-variant bg-surface-container-high focus:border-primary-container focus:ring-1 focus:ring-primary-container text-on-surface placeholder:text-on-surface-variant h-12 px-4 transition-colors"
            id="email"
            placeholder="Enter your email"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-on-surface text-sm font-medium" htmlFor="password">Password</label>
          <div className="relative">
            <input
              className="w-full rounded border border-outline-variant bg-surface-container-high focus:border-primary-container focus:ring-1 focus:ring-primary-container text-on-surface placeholder:text-on-surface-variant h-12 px-4 pr-12 transition-colors"
              id="password"
              placeholder="Enter your password"
              required
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-1"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              className="rounded border-outline-variant bg-surface-container-high text-primary-container focus:ring-primary-container w-4 h-4"
              type="checkbox"
            />
            <span className="text-on-surface-variant text-sm">Remember me</span>
          </label>
          <Link href="/forgot-password" className="text-primary-container text-sm hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded bg-primary-container text-on-primary-container font-bold uppercase tracking-wide hover:bg-primary transition-colors mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? 'Signing In...' : 'Sign In'}
          <span className="material-symbols-outlined text-[20px]">login</span>
        </button>
      </form>

      <div className="relative flex py-4 items-center">
        <div className="flex-grow border-t border-outline-variant"></div>
        <span className="flex-shrink-0 mx-4 text-on-surface-variant font-label-caps text-xs">OR</span>
        <div className="flex-grow border-t border-outline-variant"></div>
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={handleGuestLogin}
          className="w-full h-12 rounded border border-outline text-on-surface-variant font-bold hover:text-on-surface hover:border-on-surface transition-colors flex items-center justify-center gap-2"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">person_outline</span>
          Continue as Guest
        </button>
      </div>

      <p className="text-center text-on-surface-variant text-sm mt-2">
        Don't have an account? <Link className="text-primary-container hover:underline" href="/signup">Sign up</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="font-body-md min-h-screen flex items-center justify-center relative overflow-hidden bg-background text-on-background">
      {/* Animasi Kinetic Grid */}
      <div className="absolute inset-0 kinetic-grid z-0"></div>

      {/* Kontainer Form */}
      <div className="relative z-10 w-full max-w-md px-5 md:px-0">
        <Suspense fallback={<div className="text-center py-10 text-on-surface-variant">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}