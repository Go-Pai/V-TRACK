'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function setGuestCookie() {
  const cookieStore = await cookies();
  cookieStore.set('vtrack-guest', 'true', { path: '/' });
}

export async function clearGuestCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('vtrack-guest');
  redirect('/');
}

export async function clearGuestCookieOnly() {
  const cookieStore = await cookies();
  cookieStore.delete('vtrack-guest');
}
