'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/app/actions/auth';

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);

    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Failed to create account.');
    } else {
      router.push('/?registered=true');
    }
  };

  return (
    <main className="font-body-md min-h-screen flex items-center justify-center relative overflow-hidden bg-background text-on-background py-10">
      {/* Kinetic Grid Animation */}
      <div className="absolute inset-0 kinetic-grid z-0"></div>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-md px-5 md:px-0">
        <div className="bg-surface-container rounded-xl border border-outline-variant p-6 md:p-10 shadow-2xl flex flex-col gap-6">

          <div className="flex flex-col gap-2 text-center mb-2">
            <h1 className="text-primary-container text-display-lg uppercase tracking-tight">v-track</h1>
            <p className="text-on-surface-variant text-base">Create your high-performance account.</p>
          </div>

          {error && (
            <div className="bg-error-container/20 border border-error text-error text-sm p-3 rounded text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-on-surface text-sm font-medium" htmlFor="name">Full Name</label>
              <input
                className="w-full rounded border border-outline-variant bg-surface-container-high focus:border-primary-container focus:ring-1 focus:ring-primary-container text-on-surface placeholder:text-on-surface-variant h-12 px-4 transition-colors"
                id="name"
                name="name"
                placeholder="Enter your name"
                required
                type="text"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-on-surface text-sm font-medium" htmlFor="email">Email</label>
              <input
                className="w-full rounded border border-outline-variant bg-surface-container-high focus:border-primary-container focus:ring-1 focus:ring-primary-container text-on-surface placeholder:text-on-surface-variant h-12 px-4 transition-colors"
                id="email"
                name="email"
                placeholder="Enter your email"
                required
                type="email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-on-surface text-sm font-medium" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  className="w-full rounded border border-outline-variant bg-surface-container-high focus:border-primary-container focus:ring-1 focus:ring-primary-container text-on-surface placeholder:text-on-surface-variant h-12 px-4 pr-12 transition-colors"
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  required
                  minLength={6}
                  type={showPassword ? 'text' : 'password'}
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

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-on-surface text-sm font-medium" htmlFor="height">Height (cm)</label>
                <input
                  className="w-full rounded border border-outline-variant bg-surface-container-high focus:border-primary-container focus:ring-1 focus:ring-primary-container text-on-surface placeholder:text-on-surface-variant h-12 px-4 transition-colors"
                  id="height"
                  name="height"
                  placeholder="e.g. 175"
                  step="0.1"
                  type="number"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-on-surface text-sm font-medium" htmlFor="weight">Weight (kg)</label>
                <input
                  className="w-full rounded border border-outline-variant bg-surface-container-high focus:border-primary-container focus:ring-1 focus:ring-primary-container text-on-surface placeholder:text-on-surface-variant h-12 px-4 transition-colors"
                  id="weight"
                  name="weight"
                  placeholder="e.g. 70"
                  step="0.1"
                  type="number"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded bg-primary-container text-on-primary-container font-bold uppercase tracking-wide hover:bg-primary transition-colors mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
              <span className="material-symbols-outlined text-[20px]">person_add</span>
            </button>
          </form>

          <p className="text-center text-on-surface-variant text-sm mt-2">
            Already have an account? <Link className="text-primary-container hover:underline" href="/">Sign in</Link>
          </p>

        </div>
      </div>
    </main>
  );
}
