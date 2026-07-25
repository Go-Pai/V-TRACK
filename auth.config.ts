import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/',
  },
  session: { strategy: 'jwt' },
  providers: [], // Kosongkan dulu, kita injeksi beban beratnya di auth.ts
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl, cookies } }) {
      const isLoggedIn = !!auth?.user;
      const isGuest = cookies.get('vtrack-guest')?.value === 'true';
      const isProtectedRoute = ['/dashboard', '/history', '/profile', '/workout'].some(
        (path) => nextUrl.pathname.startsWith(path)
      );

      if (isProtectedRoute) {
        if (isLoggedIn || isGuest) return true;
        return false; // Tendang balik ke '/' kalau belum login & bukan guest
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
