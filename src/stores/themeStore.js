import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

const applyThemeToDom = (theme) => {
    if (typeof document === "undefined") {
        return
    }

    const root = document.documentElement
    root.setAttribute("data-theme", theme)
    root.setAttribute("data-bs-theme", theme)
}

export const useThemeStore = create(
    persist(
        (set, get) => ({
            theme: "light",
            hydrated: false,
            setHydrated: (hydrated) => set({ hydrated }),
            setTheme: (theme) => {
                applyThemeToDom(theme)
                set({ theme })
            },
            toggleTheme: () => {
                const nextTheme = get().theme === "light" ? "dark" : "light"
                applyThemeToDom(nextTheme)
                set({ theme: nextTheme })
            },
        }),
        {
            name: "cc-engage-theme",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ theme: state.theme }),
            onRehydrateStorage: () => (state) => {
                const nextTheme = state?.theme ?? "light"
                applyThemeToDom(nextTheme)
                state?.setHydrated(true)
            },
        }
    )
)

if (typeof document !== "undefined") {
    const initialTheme = useThemeStore.getState().theme
    applyThemeToDom(initialTheme)
}
