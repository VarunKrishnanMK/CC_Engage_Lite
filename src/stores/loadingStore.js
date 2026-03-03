import { create } from "zustand"

export const useLoadingStore = create((set) => ({
    isLoading: false,
    showLoading: () => set({ isLoading: true }),
    hideLoading: () => set({ isLoading: false }),
}))
