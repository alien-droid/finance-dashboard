import { create } from "zustand"; // acount sheet context hook

type NewAccountState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewAccount = create<NewAccountState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
    