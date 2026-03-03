import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AIChatSection from "../../components/AIChatSection";
import toast from "react-hot-toast";
import { confirmBrief, getBrief, getBriefStatus, updateBrief, uploadBriefFile } from "../api/apiService";
import { useThemeStore } from "../../stores/themeStore";

const getBriefUploadCacheKey = (file, assetType) => ["brief-upload", file.name, file.size, file.lastModified, assetType]
const getBriefStatusCacheKey = (campaignRunId) => ["brief-status", campaignRunId]
const getBriefByIdCacheKey = (campaignRunId) => ["brief", campaignRunId]
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const fieldConfig = [
    {
        key: "business_background",
        label: "Business Background",
        hint: "Business background, competitive scenario, industry drivers/challenges, opportunity areas",
        control: "textarea",
        rows: 3,
        size: "long",
    },
    {
        key: "business_objectives",
        label: "Business Objectives",
        hint: "Measurable business objectives",
        control: "textarea",
        rows: 3,
        size: "long",
    },
    {
        key: "target_audience",
        label: "Target Audience",
        hint: "Demographics, locations, behavior. If ETB, include internal BIU data",
        control: "textarea",
        rows: 3,
        size: "long",
    },
    {
        key: "audience_insight",
        label: "What is your insight about this target group?",
        control: "textarea",
        rows: 3,
        size: "long",
    },
    {
        key: "top_barriers",
        label: "What are the top 3 barriers faced to achieve your business objectives?",
        control: "textarea",
        rows: 3,
        size: "long",
    },
    {
        key: "barriers_addressed",
        label: "Which of these barriers are being addressed by this brief?",
        control: "textarea",
        rows: 3,
        size: "long",
    },
    {
        key: "problem_statement",
        label: "What problem are we solving for this TG?",
        control: "textarea",
        rows: 3,
        size: "long",
    },
    {
        key: "single_minded_proposition",
        label: "What is \"the one thing / single-minded proposition\" we want the TG to take away from this campaign?",
        control: "textarea",
        rows: 3,
        size: "long",
    },
    {
        key: "reasons_to_believe",
        label: "What are the Reasons to Believe?",
        control: "textarea",
        rows: 3,
        size: "long",
    },
    {
        key: "competition",
        label: "Who is our competition and are we doing anything different than the competition?",
        control: "textarea",
        rows: 3,
        size: "long",
    },
    {
        key: "differentiation",
        label: "What we do differently",
        control: "textarea",
        rows: 3,
        size: "long",
    },
    {
        key: "success_metrics",
        label: "How will we measure success?",
        control: "textarea",
        rows: 3,
        size: "long",
    },
    {
        key: "campaign_rationale",
        label: "Why do we think this campaign will help us be successful?",
        control: "textarea",
        rows: 3,
        size: "long",
    },
    {
        key: "deliverables",
        label: "Any specific campaign deliverables/execution elements?",
        control: "textarea",
        rows: 3,
        size: "long",
    },
    {
        key: "campaign_start_date",
        label: "Campaign Start Date",
        control: "input",
        inputType: "date",
        size: "short",
    },
    {
        key: "campaign_end_date",
        label: "Campaign End Date",
        control: "input",
        inputType: "date",
        size: "short",
    },
    {
        key: "campaign_duration",
        label: "Duration (Days)",
        control: "input",
        inputType: "number",
        size: "short",
    },
    {
        key: "budget",
        label: "Budget",
        control: "input",
        inputType: "number",
        size: "short",
    },
    {
        key: "cta_text",
        label: "Call to Action",
        control: "input",
        inputType: "text",
        size: "short",
    },
    {
        key: "cta_url",
        label: "Call to Action URL",
        control: "input",
        inputType: "text",
        size: "short",
    },
    {
        key: "priority_locations",
        label: "Priority Locations for the Campaign",
        control: "textarea",
        rows: 3,
        size: "long",
    },
    {
        key: "budget_breakdown",
        label: "Budget Breakdown",
        control: "textarea",
        rows: 3,
        size: "long",
    },
    {
        key: "previous_campaigns",
        label: "If any previous campaigns have been executed, share results and learnings",
        control: "textarea",
        rows: 3,
        size: "long",
    },
    {
        key: "compliance_requirements",
        label: "Any mandatory/compliance elements to be considered?",
        control: "textarea",
        rows: 3,
        size: "long",
    },
]

const emptyForm = {
    business_background: "",
    business_objectives: "",
    target_audience: "",
    audience_insight: "",
    top_barriers: "",
    barriers_addressed: "",
    problem_statement: "",
    single_minded_proposition: "",
    reasons_to_believe: "",
    competition: "",
    differentiation: "",
    success_metrics: "",
    campaign_rationale: "",
    campaign_start_date: "",
    campaign_end_date: "",
    campaign_duration: "",
    priority_locations: "",
    budget: "",
    budget_breakdown: "",
    cta_text: "",
    cta_url: "",
    deliverables: "",
    previous_campaigns: "",
    compliance_requirements: "",
}

export default function NewCreative() {
    const [formValues, setFormValues] = useState(emptyForm)
    const [initialFormValues, setInitialFormValues] = useState(emptyForm)
    const [uploadedFileName, setUploadedFileName] = useState("")
    const [uploadedRefFileName, setUploadedRefFileName] = useState("")
    const [campaignRunId, setCampaignRunId] = useState("")
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [isFormLocked, setIsFormLocked] = useState(false)
    const [channel, setChannel] = useState("email")
    const navigate = useNavigate()
    const theme = useThemeStore((state) => state.theme)
    const queryClient = useQueryClient()

    const uploadBriefMutation = useMutation({
        mutationFn: uploadBriefFile,
        retry: 1,
    })
    const updateBriefMutation = useMutation({
        mutationFn: ({ id, payload }) => updateBrief(id, payload),
        retry: 1,
    })
    const confirmBriefMutation = useMutation({
        mutationFn: ({ id, payload }) => confirmBrief(id, payload),
        retry: 1,
    })

    const isFormComplete = fieldConfig.every((field) => {
        const value = formValues[field.key]
        return String(value ?? "").trim().length > 0
    })
    const selectedAssetType = channel || "email"
    const canContinue = !isFormLocked && isFormComplete

    const handleFieldChange = (key, value) => {
        setFormValues((prev) => ({ ...prev, [key]: value }))
    }

    const normalizeFieldValue = (rawValue, fieldType, inputType) => {
        if (rawValue === null || rawValue === undefined) {
            return ""
        }
        if (Array.isArray(rawValue)) {
            if (rawValue.length === 0) {
                return ""
            }
            const hasOnlyPrimitiveItems = rawValue.every((item) => item === null || ["string", "number", "boolean"].includes(typeof item))
            if (hasOnlyPrimitiveItems) {
                return rawValue.map((item) => String(item ?? "")).join("\n")
            }
            return JSON.stringify(rawValue, null, 2)
        }
        if (typeof rawValue === "object") {
            return JSON.stringify(rawValue, null, 2)
        }

        if (typeof rawValue === "boolean") {
            return rawValue ? "true" : "false"
        }
        if (inputType === "number") {
            const parsed = Number(rawValue)
            return Number.isFinite(parsed) ? String(parsed) : ""
        }
        if (fieldType === "text" && typeof rawValue === "string") {
            return rawValue
        }
        return String(rawValue)
    }

    const mapBriefResponseToFormValues = (responseData) => {
        const questions = responseData?.brief_ui?.panel_brief?.questions
        if (!Array.isArray(questions) || questions.length === 0) {
            return null
        }
        const formKeys = new Set(Object.keys(emptyForm))
        const fieldMetaByKey = Object.fromEntries(fieldConfig.map((field) => [field.key, field]))
        const mapped = {}
        questions.forEach((question) => {
            if (!Array.isArray(question?.fields)) {
                return
            }
            question.fields.forEach((field) => {
                if (!formKeys.has(field?.key)) {
                    return
                }
                const fieldMeta = fieldMetaByKey[field.key]
                mapped[field.key] = normalizeFieldValue(field?.value, field?.field_type, fieldMeta?.inputType)
            })
        })
        return mapped
    }

    const buildUpdatedFieldsPayload = () => {
        const changedFields = {}
        Object.keys(formValues).forEach((key) => {
            const currentValue = formValues[key] ?? ""
            const initialValue = initialFormValues[key] ?? ""
            if (String(currentValue).trim() !== String(initialValue).trim()) {
                changedFields[key] = currentValue
            }
        })
        return changedFields
    }

    const fetchBriefStatusById = (campaignRunId, staleTime = 0) =>
        queryClient.fetchQuery({
            queryKey: getBriefStatusCacheKey(campaignRunId),
            queryFn: () => getBriefStatus(campaignRunId),
            staleTime,
            gcTime: 10 * 60 * 1000,
        })

    const fetchBriefById = (campaignRunId) =>
        queryClient.fetchQuery({
            queryKey: getBriefByIdCacheKey(campaignRunId),
            queryFn: () => getBrief(campaignRunId),
            staleTime: 0
        })

    const handleBriefFileUpload = async (event) => {
        const file = event.target.files?.[0]
        if (!file) {
            return
        }
        const cacheKey = getBriefUploadCacheKey(file, selectedAssetType)
        const cachedResponse = queryClient.getQueryData(cacheKey)
        if (cachedResponse) {
            const mappedValues = mapBriefResponseToFormValues(cachedResponse)
            if (!mappedValues) {
                toast.error("Brief loaded from cache, but no mappable fields were found.")
                event.target.value = ""
                return
            }
            setFormValues((prev) => ({ ...prev, ...mappedValues }))
            setInitialFormValues((prev) => ({ ...prev, ...mappedValues }))
            setUploadedFileName(file.name)
            setCampaignRunId(cachedResponse?.campaign_run_id || "")
            toast.success("Brief loaded from cache and fields auto-filled.")
            event.target.value = ""
            return
        }
        try {
            const uploadResponse = await uploadBriefMutation.mutateAsync({
                file,
                channel: selectedAssetType,
            })
            if (uploadResponse?.message || uploadResponse?.status) {
                const message = uploadResponse?.message || "Brief upload initiated."
                const statusText = uploadResponse?.status ? `Status: ${uploadResponse.status}` : null
                toast.success(statusText ? `${message} ${statusText}` : message)
            }

            const campaignRunId = uploadResponse?.campaign_run_id
            if (!campaignRunId) {
                throw new Error("Upload response missing campaign_run_id")
            }
            setCampaignRunId(campaignRunId)

            let briefStatusResponse = await fetchBriefStatusById(campaignRunId)
            if (briefStatusResponse?.status) {
                toast.success(`Brief parsing status: ${briefStatusResponse.status}`)
            }
            if (briefStatusResponse?.status !== "parsed") {
                for (let attempt = 0; attempt < 4; attempt += 1) {
                    await wait(1500)
                    briefStatusResponse = await fetchBriefStatusById(campaignRunId, 0)
                    if (briefStatusResponse?.status === "parsed") {
                        break
                    }
                }
            }

            if (briefStatusResponse?.status !== "parsed") {
                toast.error("Brief is not parsed yet. Please try again in a moment.")
                return
            }

            const briefResponse = await fetchBriefById(campaignRunId)
            const mappedValues = mapBriefResponseToFormValues(briefResponse)
            if (!mappedValues) {
                toast.error("Brief uploaded, but no mappable fields were found in response.")
                return
            }
            setFormValues((prev) => ({ ...prev, ...mappedValues }))
            setInitialFormValues((prev) => ({ ...prev, ...mappedValues }))
            setUploadedFileName(file.name)
            queryClient.setQueryData(cacheKey, briefResponse)
            toast.success("Brief uploaded and fields auto-filled.")
        } catch (error) {
            console.error("Brief upload failed", error)
        } finally {
            event.target.value = ""
        }
    }

    const handleStartBriefAnalysis = async () => {
        if (!campaignRunId) {
            toast.error("Campaign run id is missing. Please upload a brief first.")
            return
        }
        try {
            const payload = buildUpdatedFieldsPayload()
            const updateResponse = await updateBriefMutation.mutateAsync({
                id: campaignRunId,
                payload,
            })
            toast.success(updateResponse?.message || "Brief updated successfully.")
            setInitialFormValues((prev) => ({ ...prev, ...payload }))
            setShowConfirmModal(true)
        } catch (error) {
            console.error("Brief update failed", error)
        }
    }

    const handleConfirmBrief = async () => {
        if (!campaignRunId) {
            toast.error("Campaign run id is missing. Please upload a brief first.")
            return
        }
        try {
            const confirmResponse = await confirmBriefMutation.mutateAsync({
                id: campaignRunId,
                payload: {},
            })
            toast.success(confirmResponse?.message || "Brief confirmed successfully.")
            setShowConfirmModal(false)
            navigate("/creatives/select-variations", { state: { assetType: selectedAssetType } })
        } catch (error) {
            console.error("Brief confirm failed", error)
        }
    }

    const handleReferenceFileUpload = (event) => {
        const file = event.target.files?.[0]
        if (!file) {
            return
        }
        setUploadedRefFileName(file.name)
        event.target.value = ""
    }

    return (
        <>
            <div>
                <div className={`p-2 ${theme === 'light' ? "headerBg" : "bg-dark"}`}>
                    <h4 className="fw-bold text-light">Create New Creative</h4>
                </div>
                <div className="container-fluid my-2">
                    <div className="row g-2">
                        <div className="col-12 col-lg-8 order-2 order-lg-1 d-flex">
                            <div className="card border-0 rounded-3 shadow-sm flex-fill">
                                <div className="card-header p-3 border-bottom d-flex justify-content-between">
                                    <div><i className="bi bi-file-earmark-fill text-primary"></i> Creative Brief Form</div>
                                    <div className="text-secondary">Fill manually or upload documents <i className="bi bi-arrow-right"></i></div>
                                </div>
                                <div className="card-body">
                                    <div className="row g-2 requirement-form-body">
                                        {fieldConfig.map((field) => (
                                            <div className={field.size === "short" ? "col-12 col-md-6 col-xl-4" : "col-12 col-xl-6"} key={field.key}>
                                                <label className="form-label fw-semibold mb-1">{field.label}</label>
                                                {field.hint ? <p className="small text-secondary mb-1">{field.hint}</p> : null}
                                                {field.control === "input" ? (
                                                    <input className="form-control" type={field.inputType || "text"} placeholder="Enter your answer..." value={formValues[field.key]} disabled={isFormLocked} onChange={(event) => handleFieldChange(field.key, event.target.value)} />
                                                ) : (
                                                    <textarea className="form-control" rows={field.rows} placeholder="Enter your answer..." value={formValues[field.key]} disabled={isFormLocked} onChange={(event) => handleFieldChange(field.key, event.target.value)} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="card-footer border-0">
                                    <div className="d-flex flex-wrap gap-2 justify-content-end">
                                        {isFormLocked ? (
                                            <button className="btn btn-sm btn-outline-warning" type="button" onClick={() => setIsFormLocked(false)}>
                                                <i className="bi bi-pencil-square me-2"></i>
                                                Edit
                                            </button>
                                        ) : (
                                            <button className="btn btn-sm btn-danger" type="button" disabled={!canContinue} onClick={() => setIsFormLocked(true)}>
                                                <i className="bi bi-stars me-2"></i>
                                                Continue
                                            </button>
                                        )}
                                        <button className="btn btn-sm btn-danger" type="button" disabled={!isFormLocked || updateBriefMutation.isPending || confirmBriefMutation.isPending} onClick={handleStartBriefAnalysis}>
                                            <i className="bi bi-lightning-charge me-2"></i>
                                            Start Brief Analysis
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-4 order-1 order-lg-2">
                            <div className="card border-0 shadow-sm mb-3">
                                <div className="card-body">
                                    <h2 className="h6 fw-semibold mb-3">
                                        Select Asset Type
                                    </h2>
                                    <div className="row">
                                        <div className="col-6 col-md-4  mb-3">
                                            <input type="radio" className="btn-check" name="options-base" id="option1" autoComplete="off" value="email" checked={selectedAssetType === "email"} onChange={(event) => setChannel(event.target.value)} />
                                            <label className="btn btn-outline-danger w-100" htmlFor="option1"><i className="bi bi-envelope-at-fill"></i><br />E-Mailer</label>
                                        </div>
                                        <div className="col-6 col-md-4  mb-3">
                                            <input type="radio" className="btn-check" name="options-base" id="option2" autoComplete="off" value="whatsapp" checked={selectedAssetType === "whatsapp"} onChange={(event) => setChannel(event.target.value)} />
                                            <label className="btn btn-outline-danger w-100" htmlFor="option2"><i className="bi bi-whatsapp"></i> <br />WhatsApp</label>
                                        </div>
                                        <div className="col-6 col-md-4  mb-3">
                                            <input type="radio" className="btn-check" name="options-base" id="option3" autoComplete="off" value="banner" checked={selectedAssetType === "banner"} onChange={(event) => setChannel(event.target.value)} />
                                            <label className="btn btn-outline-danger w-100" htmlFor="option3"><i className="bi bi-patch-check-fill"></i><br />Banner</label>
                                        </div>
                                        <div className="col-6 col-md-4  mb-3">
                                            <input type="radio" className="btn-check" name="options-base" id="option4" autoComplete="off" value="social_media_post" checked={selectedAssetType === "social_media_post"} onChange={(event) => setChannel(event.target.value)} />
                                            <label className="btn btn-outline-danger w-100" htmlFor="option4"><i className="bi bi-phone"></i> <br />Socila Media Post</label>
                                        </div>
                                        <div className="col-6 col-md-4  mb-3">
                                            <input type="radio" className="btn-check" name="options-base" id="option5" autoComplete="off" value="landing_page" checked={selectedAssetType === "landing_page"} onChange={(event) => setChannel(event.target.value)} />
                                            <label className="btn btn-outline-danger w-100" htmlFor="option5"><i className="bi bi-browser-chrome"></i> <br />Landing Page</label>
                                        </div>
                                        <div className="col-6 col-md-4  mb-3">
                                            <input type="radio" className="btn-check" name="options-base" id="option6" autoComplete="off" value="newsletter" checked={selectedAssetType === "newsletter"} onChange={(event) => setChannel(event.target.value)} />
                                            <label className="btn btn-outline-danger w-100" htmlFor="option6"><i className="bi bi-newspaper"></i><br /> Newsletter</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row g-2">
                                <div className="col-6 mb-3">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body">
                                            <h2 className="h6 fw-semibold mb-2">
                                                <i className="bi bi-upload me-2"></i>
                                                Upload Brief
                                            </h2>
                                            <div className="border-0 shadow-sm rounded-3 p-2 text-center bg-body-tertiary">
                                                <div className="d-flex justify-content-between">
                                                    <div className="rounded-circle bg-danger-subtle text-danger mb-2 p-2 lh-1 me-2">
                                                        <i className="bi bi-upload"></i>
                                                    </div>
                                                    <input className="form-control form-control-sm" type="file" disabled={isFormLocked || uploadBriefMutation.isPending} onChange={handleBriefFileUpload} />
                                                </div>
                                                {uploadBriefMutation.isPending ? <small className="small text-secondary mt-2">Uploading brief...</small> : null}
                                                {uploadedFileName ? <small className="small text-success mt-2">Loaded: {uploadedFileName}</small> : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6 mb-3">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body">
                                            <h2 className="h6 fw-semibold mb-2">
                                                <i className="bi bi-upload me-2"></i>
                                                Upload Reference
                                            </h2>
                                            <div className="border-0 shadow-sm rounded-3 p-2 text-center bg-body-tertiary">
                                                <div className="d-flex justify-content-between">
                                                    <div className="rounded-circle bg-danger-subtle text-danger mb-2 p-2 lh-1 me-2">
                                                        <i className="bi bi-upload"></i>
                                                    </div>
                                                    <input className="form-control form-control-sm" type="file" disabled={isFormLocked} onChange={handleReferenceFileUpload} />
                                                </div>
                                                {uploadedRefFileName ? <small className="small text-success mt-2">Loaded: {uploadedRefFileName}</small> : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <AIChatSection />
                        </div>
                    </div>
                </div>
            </div>
            {showConfirmModal ? (
                <>
                    <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirm Submit</h5>
                                    <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowConfirmModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <p className="mb-0">Do you want to confirm this brief and continue to variation selection?</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowConfirmModal(false)} disabled={confirmBriefMutation.isPending}>
                                        Cancel
                                    </button>
                                    <button type="button" className="btn btn-danger" onClick={handleConfirmBrief} disabled={confirmBriefMutation.isPending}>
                                        {confirmBriefMutation.isPending ? "Confirming..." : "Confirm"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </>
    )
}
