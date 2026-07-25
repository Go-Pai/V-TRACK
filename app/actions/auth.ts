'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function registerUser(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const heightRaw = formData.get('height') as string;
    const weightRaw = formData.get('weight') as string;

    if (!email || !password || !name) {
      return { success: false, error: 'Name, email, and password are required.' };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const height = heightRaw ? parseFloat(heightRaw) : null;
    const weight = weightRaw ? parseFloat(weightRaw) : null;

    await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        height,
        weight,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error('Registration error:', error);
    return { success: false, error: 'An unexpected error occurred during registration.' };
  }
}
