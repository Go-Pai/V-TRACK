'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateProfileInfo(formData: {
  name?: string;
  weight?: string;
  height?: string;
  image?: string;
}) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const { name, weight, height, image } = formData;

  const updateData: any = {};
  if (name !== undefined) updateData.name = name;
  if (weight !== undefined) updateData.weight = weight ? parseFloat(weight) : null;
  if (height !== undefined) updateData.height = height ? parseFloat(height) : null;
  // NOTE: In a real prod app, uploading base64 to DB isn't great, but works for MVP.
  if (image !== undefined) updateData.image = image;

  await prisma.user.update({
    where: { id: session.user.id },
    data: updateData,
  });

  revalidatePath('/profile');
  revalidatePath('/dashboard');
  revalidatePath('/history');
  revalidatePath('/workout/active');
  
  return { success: true };
}

export async function getUserProfile() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, weight: true, height: true, image: true }
  });

  return user;
}
