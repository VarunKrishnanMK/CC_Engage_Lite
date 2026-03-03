import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { DEFAULT_MJML_TEMPLATE } from "../app/editor/mjmlTemplate"

export const useEditorStore = create(
  persist(
    (set) => ({
      mjmlDraft: DEFAULT_MJML_TEMPLATE,
      setMjmlDraft: (mjmlDraft) => set({ mjmlDraft }),
      resetMjmlDraft: () => set({ mjmlDraft: DEFAULT_MJML_TEMPLATE }),
    }),
    {
      name: "cc-engage-editor",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ mjmlDraft: state.mjmlDraft }),
    }
  )
)
