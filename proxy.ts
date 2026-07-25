import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// Proxy aman membaca ini karena tidak ada unsur Prisma & Bcrypt
export default NextAuth(authConfig).auth;

export const config = {
  // Melindungi semua route kecuali file statis
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

// Override logika middleware di sini (sebaiknya digabung dengan authConfig jika memungkinkan)
// Tapi karena kita pakai next-auth middleware, kita bisa menyisipkan logika khusus.
// Auth.js Middleware otomatis mengecek `authorized` di `auth.config.ts`.
// Kita perlu mengupdate auth.config.ts untuk membaca cookie.
