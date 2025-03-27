// store/packCounter.ts
import { create } from 'zustand';

interface UserPackState {
  userPack: string | null;
  userPackClassesIncluded: number | null;
  packExpirationDate: string | null;
  setUserPack: (pack: string | null) => void;
  setUserPackClassesIncluded: (classes: number | null) => void;
  setPackExpirationDate: (date: string | null) => void;
}

export const useUserPackStore = create<UserPackState>((set) => ({
  userPack: null,
  userPackClassesIncluded: null,
  packExpirationDate: null,
  setUserPack: (pack) => set({ userPack: pack }),
  setUserPackClassesIncluded: (classes) => set({ userPackClassesIncluded: classes }),
  setPackExpirationDate: (date) => set({ packExpirationDate: date }),
}));