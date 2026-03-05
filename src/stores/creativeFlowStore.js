import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export const useCreativeFlowStore = create(
    persist(
        (set) => ({
            assetType: "email",
            campaignRunId: "",
            selectedOrderedMjml: "",
            selectedPathwayFooterBlock: null,
            setAssetType: (assetType) => set({ assetType }),
            setCampaignRunId: (campaignRunId) => set({ campaignRunId }),
            setSelectedOrderedMjml: (selectedOrderedMjml) => set({ selectedOrderedMjml }),
            setSelectedPathwayFooterBlock: (selectedPathwayFooterBlock) => set({ selectedPathwayFooterBlock }),
            setCreativeFlowContext: ({ assetType, campaignRunId }) =>
                set((state) => ({
                    assetType: assetType ?? state.assetType,
                    campaignRunId: campaignRunId ?? state.campaignRunId,
                })),
            clearCreativeFlowContext: () =>
                set({
                    assetType: "email",
                    campaignRunId: "",
                    selectedOrderedMjml: "",
                    selectedPathwayFooterBlock: null,
                }),
        }),
        {
            name: "cc-engage-creative-flow",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                assetType: state.assetType,
                campaignRunId: state.campaignRunId,
                selectedOrderedMjml: state.selectedOrderedMjml,
                selectedPathwayFooterBlock: state.selectedPathwayFooterBlock,
            }),
        }
    )
)
