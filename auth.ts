import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { authConfig } from './auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig, // Gabungkan konfigurasi ringan
  adapter: PrismaAdapter(prisma), // Beban berat 1
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = (credentials.email as string).toLowerCase().trim();
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(
           credentials.password as string,
           user.password
        ); // Beban berat 2

        if (!isPasswordValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          // image: user.image || undefined, // JANGAN MASUKKAN KE JWT JIKA BASE64! Akan menyebabkan HTTP 431 Error
        } as any;
      },
    }),
  ],
});
