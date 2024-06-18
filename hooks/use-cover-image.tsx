import { create } from "zustand";

type CoverImageStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useCoverImahge = create<CoverImageStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
