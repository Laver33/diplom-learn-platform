import { create } from 'zustand'

interface MobileMenuState {
  isOpen: boolean
  toggle: () => void
  close: () => void
  open: () => void
}

export const useMobileMenuStore = create<MobileMenuState>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set({ isOpen: false }),
  open: () => set({ isOpen: true }),
}))