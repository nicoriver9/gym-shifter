// store/packCounter.ts
import { create } from 'zustand';

// store/packCounter.ts
interface UserPackState {
  userPack: string | null;
  userPackClassesIncluded: number | null;
  packExpirationDate: string | null;
  weeklyCycleStartDate: string | null; // 🔥 nuevo
  setUserPack: (pack: string | null) => void;
  setUserPackClassesIncluded: (classes: number | null) => void;
  setPackExpirationDate: (date: string | null) => void;
  setWeeklyCycleStartDate: (date: string | null) => void; // 🔥 nuevo
}

export const useUserPackStore = create<UserPackState>((set) => ({
  userPack: null,
  userPackClassesIncluded: null,
  packExpirationDate: null,
  weeklyCycleStartDate: null, // 🔥 nuevo
  setUserPack: (pack) => set({ userPack: pack }),
  setUserPackClassesIncluded: (classes) => set({ userPackClassesIncluded: classes }),
  setPackExpirationDate: (date) => set({ packExpirationDate: date }),
  setWeeklyCycleStartDate: (date) => set({ weeklyCycleStartDate: date }), // 🔥 nuevo
}));
