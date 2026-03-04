import { useEffect, useMemo, useState } from "react"
import { useThemeStore } from "../../stores/themeStore"
import CreativeWorkflowSteps from "../../components/CreativeWorkflowSteps"
import { useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import AIChatSection from "../../components/AIChatSection"
import { generateTemplate, generateVariation, getAllVariations } from "../api/apiService"
import { useCreativeFlowStore } from "../../stores/creativeFlowStore"

const sectionConfig = [
    {
        key: "hero",
        label: "Hero",
        heading: "Select Hero Layout",
        subheading: "Choose the layout that best captures attention.",
    },
    {
        key: "greeting",
        label: "Greeting",
        heading: "Select Greeting Style",
        subheading: "Choose the tone that fits your brand.",
    },
    {
        key: "description",
        label: "Description",
        heading: "Select Description Layout",
        subheading: "Choose the most readable format.",
    },
    {
        key: "features",
        label: "Features",
        heading: "Select Features/Benefits Layout",
        subheading: "Choose how to present key features.",
    },
    {
        key: "steps",
        label: "Steps",
        heading: "Select Steps/Get Started Layout",
        subheading: "Choose the most scannable format.",
    },
    {
        key: "contact",
        label: "Contact",
        heading: "Select Contact Section Layout",
        subheading: "Choose the most accessible format.",
    },
    {
        key: "cta",
        label: "CTA",
        heading: "Select Call-to-Action Layout",
        subheading: "Choose the most compelling format.",
    },
]

const getVariationsCacheKey = (campaignRunId) => ["select-variations-data", campaignRunId]

const sectionSlotMatchers = {
    hero: ["slot_0_hero", "hero"],
    greeting: ["slot_1_greeting", "greeting"],
    description: ["slot_2_description", "description"],
    features: ["slot_3_section_a", "section_a", "features"],
    steps: ["slot_4_section_b", "section_b", "steps", "benefit"],
    contact: ["slot_5_section_c", "section_c", "contact"],
    cta: ["slot_6_cta", "cta"],
}

const toVariationCard = (variant, variantKey) => {
    const variantNumber = Number(variant?.variant_number ?? variantKey)
    const title =
        variant?.headline ||
        variant?.sub_headline ||
        variant?.body_copy ||
        variant?.cta_text ||
        `Variant ${variantNumber || 1}`

    const subCandidates = [variant?.sub_headline, variant?.body_copy, variant?.cta_text].filter(Boolean)
    const subText = subCandidates.find((value) => value !== title) || ""

    const descriptionCandidates = [variant?.body_copy, variant?.sub_headline].filter(Boolean)
    const descriptionText = descriptionCandidates.find((value) => value !== title && value !== subText) || ""
    const ctaText = variant?.cta_text || variant?.json_spec?.cta_text || ""
    const ctaUrl = variant?.cta_url || variant?.json_spec?.cta_url || ""

    return {
        title,
        sub: subText,
        description: descriptionText,
        ctaText,
        ctaUrl,
        tags: [`Tone: ${variant?.tone || "default"}`, `Variant ${variantNumber || 1}`],
        raw: variant,
    }
}

const mapApiVariationsToSections = (variantsResponse = {}) => {
    const slotEntries = Object.entries(variantsResponse)
    const mappedSections = {}

    sectionConfig.forEach((section) => {
        const matchers = sectionSlotMatchers[section.key] || [section.key]
        const matchedSlot = slotEntries.find(([slotId]) =>
            matchers.some((matcher) => slotId === matcher || slotId.includes(matcher))
        )
        if (!matchedSlot) {
            return
        }

        const [, variantsByNumber] = matchedSlot
        const cards = Object.entries(variantsByNumber || {})
            .sort(([left], [right]) => Number(left) - Number(right))
            .map(([variantKey, variant]) => toVariationCard(variant, variantKey))

        if (cards.length > 0) {
            mappedSections[section.key] = cards
        }
    })

    return mappedSections
}

const normalizeMjmlSnippet = (snippet = "") => {
    const content = String(snippet || "").trim()
    if (!content) {
        return ""
    }

    if (/<mjml[\s>]/i.test(content)) {
        const bodyMatch = content.match(/<mj-body[^>]*>([\s\S]*?)<\/mj-body>/i)
        return bodyMatch?.[1]?.trim() || ""
    }

    return content
}

const buildOrderedMjmlDocument = (sectionOrder, selectedVariationBySection, sectionVariations) => {
    const orderedSnippets = sectionOrder
        .map((section) => {
            const selectedIndex = selectedVariationBySection[section.key]
            if (!Number.isInteger(selectedIndex)) {
                return ""
            }

            const selectedVariant = sectionVariations[section.key]?.[selectedIndex]?.raw
            const rawMjml = selectedVariant?.mjml || selectedVariant?.myml || ""
            return normalizeMjmlSnippet(rawMjml)
        })
        .filter(Boolean)

    if (orderedSnippets.length === 0) {
        return ""
    }

    return `<mjml><mj-body>${orderedSnippets.join("\n")}</mj-body></mjml>`
}

export default function SelectVariations() {
    const theme = useThemeStore((state) => state.theme)
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const campaignRunId = useCreativeFlowStore((state) => state.campaignRunId)
    const setSelectedOrderedMjml = useCreativeFlowStore((state) => state.setSelectedOrderedMjml)
    const [activeSection, setActiveSection] = useState("hero")
    const [isLoadingVariations, setIsLoadingVariations] = useState(false)
    const [variationsError, setVariationsError] = useState("")
    const [apiVariationsBySection, setApiVariationsBySection] = useState({})
    const [selectedVariationBySection, setSelectedVariationBySection] = useState(
        sectionConfig.reduce((acc, section) => ({ ...acc, [section.key]: null }), {})
    )
    const sectionVariations = useMemo(() => {
        return sectionConfig.reduce((acc, section) => {
            acc[section.key] = apiVariationsBySection[section.key] || []
            return acc
        }, {})
    }, [apiVariationsBySection])

    const currentSection =
        sectionConfig.find((item) => item.key === activeSection) || sectionConfig[0]

    const currentSectionWithVariations = {
        ...currentSection,
        variations: sectionVariations[currentSection.key] || [],
    }

    const currentVariationIndex = selectedVariationBySection[activeSection]
    const selectedVariation = Number.isInteger(currentVariationIndex)
        ? currentSectionWithVariations.variations[currentVariationIndex]
        : null
    const completedSectionSet = useMemo(
        () =>
            new Set(
                sectionConfig
                    .filter((section) => {
                        const selectedIndex = selectedVariationBySection[section.key]
                        if (!Number.isInteger(selectedIndex)) {
                            return false
                        }
                        const sectionItems = sectionVariations[section.key] || []
                        return selectedIndex >= 0 && selectedIndex < sectionItems.length
                    })
                    .map((section) => section.key)
            ),
        [selectedVariationBySection, sectionVariations]
    )
    const isAllSectionsCompleted = completedSectionSet.size === sectionConfig.length

    useEffect(() => {
        let isMounted = true

        const loadVariations = async () => {
            if (!campaignRunId) {
                setVariationsError("Campaign run id is missing. Please return and confirm brief again.")
                return
            }

            const cacheKey = getVariationsCacheKey(campaignRunId)
            const cachedData = queryClient.getQueryData(cacheKey)
            if (cachedData) {
                if (isMounted) {
                    setApiVariationsBySection(cachedData)
                    setVariationsError("")
                }
                return
            }

            setIsLoadingVariations(true)
            setVariationsError("")

            try {
                await generateTemplate(campaignRunId)
                await generateVariation(campaignRunId)
                const allVariationsResponse = await getAllVariations(campaignRunId)
                const variantsPayload = allVariationsResponse?.variants || allVariationsResponse || {}
                const mappedSections = mapApiVariationsToSections(variantsPayload)
                queryClient.setQueryData(cacheKey, mappedSections)
                if (isMounted) {
                    setApiVariationsBySection(mappedSections)
                }
            } catch (error) {
                console.error("Failed to load variations", error)
                if (isMounted) {
                    setVariationsError("Unable to load variations. Please try again.")
                }
            } finally {
                if (isMounted) {
                    setIsLoadingVariations(false)
                }
            }
        }

        loadVariations()

        return () => {
            isMounted = false
        }
    }, [campaignRunId, queryClient])

    useEffect(() => {
        const sectionItems = sectionVariations[activeSection] || []
        const maxIndex = Math.max(sectionItems.length - 1, 0)
        setSelectedVariationBySection((prev) => {
            const currentIndex = prev[activeSection]
            if (!Number.isInteger(currentIndex)) {
                return prev
            }
            const nextIndex = Math.min(currentIndex, maxIndex)
            if (nextIndex === currentIndex) {
                return prev
            }
            return { ...prev, [activeSection]: nextIndex }
        })
    }, [activeSection, sectionVariations])

    const handleSelectVariation = (index) => {
        setSelectedVariationBySection((prev) => ({ ...prev, [activeSection]: index }))
    }

    const handleContinueToEditor = () => {
        const orderedMjml = buildOrderedMjmlDocument(sectionConfig, selectedVariationBySection, sectionVariations)
        setSelectedOrderedMjml(orderedMjml)
        navigate("/creatives/preview-export", {
            state: {
                orderedMjml,
            },
        })
    }

    const renderPreview = () => {
        if (!selectedVariation) {
            return (
                <div className="border rounded p-3 bg-body-tertiary text-secondary">
                    No preview available.
                </div>
            )
        }

        return (
            <div className="border rounded p-3 bg-body-tertiary">
                <h6 className="fw-semibold mb-2">{selectedVariation.title}</h6>
                {selectedVariation.sub ? (
                    <p className="mb-2 text-secondary">{selectedVariation.sub}</p>
                ) : null}
                {selectedVariation.description ? (
                    <p className="mb-2">{selectedVariation.description}</p>
                ) : null}
                {activeSection === "cta" || selectedVariation.ctaText ? (
                    <div className="small">
                        {selectedVariation.ctaUrl ? (
                            <a className="btn btn-sm button-primary" href={selectedVariation.ctaUrl} target="_blank" rel="noreferrer">
                                {selectedVariation.ctaText || "Call To Action"}
                            </a>
                        ) : (
                            <button type="button" className="btn btn-sm button-primary">
                                {selectedVariation.ctaText || "Call To Action"}
                            </button>
                        )}
                    </div>
                ) : null}
            </div>
        )
    }

    return (
        <div>
            <div className={`p-2 ${theme === "light" ? "headerBg" : "bg-dark"}`}>
                <h4 className="fw-bold text-light mb-0">Select Variations</h4>
            </div>
            <div className="container-fluid my-2">
                <div className="card border-0 p-2 mb-2">
                    <CreativeWorkflowSteps currentStep="variations" />
                    {isLoadingVariations ? <small className="text-secondary">Generating and loading variations...</small> : null}
                    {variationsError ? <small className="text-danger">{variationsError}</small> : null}
                    <div className="py-2">
                        <div className="d-flex flex-wrap align-items-center gap-1">
                            {sectionConfig.map((section, index) => {
                                const isCompleted = completedSectionSet.has(section.key)
                                const isActive = section.key === activeSection
                                const className = isActive
                                    ? "btn-danger text-white"
                                    : isCompleted
                                        ? "btn-success text-white border-success"
                                        : "btn-white text-secondary border-danger"
                                return (
                                    <button key={section.key} type="button" className={`btn btn-sm rounded-pill border ${className}`} onClick={() => setActiveSection(section.key)}>
                                        <span className="me-1">{isCompleted ? <i className="bi bi-check-circle-fill"></i> : index + 1}</span>
                                        {section.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div className="row g-2">
                    <div className="col-xl-4">
                        <div className="mb-2">
                            <h5 className="fw-bold mb-1">{currentSectionWithVariations.heading}</h5>
                            <small className="small text-secondary mb-2">{currentSectionWithVariations.subheading}</small>
                            <p className="my-2 fw-bold">Choose Variation</p>
                            <div className="variation-cards">
                                {currentSectionWithVariations.variations.map((card, index) => (
                                    <div className="mb-2" key={`${currentSectionWithVariations.key}-${card.title}-${index}`}>
                                        <button type="button" className={`btn text-start w-100 border ${index === currentVariationIndex ? "border-primary bg-primary-subtle" : "border-danger"}`} onClick={() => handleSelectVariation(index)}>
                                            <div className="d-flex gap-2">
                                                <div className="flex-grow-1">
                                                    <div className="fw-semibold">{card.title}</div>
                                                    {card.sub ? <div className="small text-secondary">{card.sub}</div> : null}
                                                    <div className="d-flex flex-wrap gap-1 mt-1">
                                                        {card.tags.map((tag) => (
                                                            <span key={`${card.title}-${tag}`} className="badge text-bg-light border">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                ))}
                                {currentSectionWithVariations.variations.length === 0 ? (
                                    <div className="col-12">
                                        <div className="border rounded p-3 text-secondary small">
                                            No variations available for this section.
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <AIChatSection />
                    </div>
                    <div className="col-xl-8">
                        <div className="card border-0 py-2">
                            <div className="d-flex justify-content-between pb-2 px-3">
                                <h6 className="fw-semibold">Live Preview</h6>
                                <button type="button" className="btn btn-sm button-primary" onClick={handleContinueToEditor} disabled={!isAllSectionsCompleted}>
                                    Continue to Editor
                                </button>
                            </div>
                            {renderPreview()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
