import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  name: string;
  weight: string;
  height: string;
  profilePicture: string | null;
  isGuest: boolean;
  updateProfile: (data: Partial<UserState>) => void;
  loginAsGuest: () => void;
  loginAsUser: (name?: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: 'Alex Thorne',
      weight: '85',
      height: '182',
      profilePicture: null,
      isGuest: false,
      updateProfile: (data) => set((state) => ({ ...state, ...data })),
      loginAsGuest: () =>
        set({
          name: 'Guest User',
          weight: '70',
          height: '170',
          profilePicture: null,
          isGuest: true,
        }),
      loginAsUser: (name = 'Alex Thorne') =>
        set({
          name,
          weight: '85',
          height: '182',
          profilePicture: null,
          isGuest: false,
        }),
    }),
    {
      name: 'v-track-user', // Disimpan di Local Storage
    }
  )
);

