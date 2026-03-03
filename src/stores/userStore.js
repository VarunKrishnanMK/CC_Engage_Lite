import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export const useUserStore = create(
    persist(
        (set) => ({
            userDetails: {},
            setUserDetails: (userDetails) => set({ userDetails }),
            clearUserDetails: () => set({ userDetails: {} }),
        }),
        {
            name: "cc-engage-user",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ userDetails: state.userDetails }),
        }
    )
)
