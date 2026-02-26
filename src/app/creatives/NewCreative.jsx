import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../../contexts/ThemeContext"

const fieldConfig = [
    {
        key: "background",
        label: "Background",
        hint: "Business background, competitive scenario, industry drivers/challenges, opportunity areas",
        control: "textarea",
        rows: 3,
        size: "long",
    },
    {
        key: "businessObjectives",
        label: "Business Objectives",
        hint: "Measurable business objectives",
        control: "textarea",
        rows: 3,
        size: "long",
    },
    {
        key: "targetAudience",
        label: "Target Audience",
        hint: "Demographics, locations, behavior. If ETB, include internal BIU data",
        control: "textarea",
        rows: 3,
        size: "long",
    },
    {
        key: "targetGroupInsight",
        label: "What is your insight about this target group?",
        control: "textarea",
        rows: 3,
        size: "long",
    },
    {
        key: "topBarriers",
        label: "What are the top 3 barriers faced to achieve your business objectives?",
        control: "textarea",
        rows: 3,
        size: "long",
    },
    {
        key: "addressedBarriers",
        label: "Which of these barriers are being addressed by this brief?",
        control: "textarea",
        rows: 3,
        size: "long",
    },
    {
        key: "problemForTargetGroup",
        label: "What problem are we solving for this TG?",
        control: "textarea",
        rows: 3,
        size: "long",
    },
    {
        key: "singleMindedProposition",
        label: "What is \"the one thing / single-minded proposition\" we want the TG to take away from this campaign?",
        control: "textarea",
        rows: 3,
        size: "long",
    },
    {
        key: "reasonsToBelieve",
        label: "What are the Reasons to Believe?",
        control: "textarea",
        rows: 3,
        size: "long",
    },
    {
        key: "competitionDifferentiation",
        label: "Who is our competition and are we doing anything different than the competition?",
        control: "textarea",
        rows: 3,
        size: "long",
    },
    {
        key: "measureSuccess",
        label: "How will we measure success?",
        control: "textarea",
        rows: 3,
        size: "long",
    },
    {
        key: "whySuccessful",
        label: "Why do we think this campaign will help us be successful?",
        control: "textarea",
        rows: 3,
        size: "long",
    },
    {
        key: "campaignTimeline",
        label: "Campaign Timeline",
        control: "input",
        inputType: "date",
        size: "short",
    },
    {
        key: "campaignDuration",
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
        key: "callToAction",
        label: "Call to Action",
        control: "input",
        inputType: "text",
        size: "short",
    },
    {
        key: "priorityLocations",
        label: "Priority Locations for the Campaign",
        control: "input",
        inputType: "text",
        size: "short",
    },
    {
        key: "campaignDeliverables",
        label: "Any specific campaign deliverables/execution elements?",
        control: "textarea",
        rows: 3,
        size: "long",
    },
    {
        key: "previousCampaignResults",
        label: "If any previous campaigns have been executed, share results and learnings",
        control: "textarea",
        rows: 3,
        size: "long",
    },
    {
        key: "mandatoryCompliance",
        label: "Any mandatory/compliance elements to be considered?",
        control: "textarea",
        rows: 3,
        size: "long",
    },
]

const emptyForm = {
    background: "",
    businessObjectives: "",
    topBarriers: "",
    addressedBarriers: "",
    targetAudience: "",
    targetGroupInsight: "",
    problemForTargetGroup: "",
    singleMindedProposition: "",
    reasonsToBelieve: "",
    competitionDifferentiation: "",
    measureSuccess: "",
    whySuccessful: "",
    campaignTimeline: "",
    campaignDuration: "",
    budget: "",
    callToAction: "",
    priorityLocations: "",
    campaignDeliverables: "",
    previousCampaignResults: "",
    mandatoryCompliance: "",
    creativeDescription: "",
}

const keyMap = {
    background: ["background", "businessbackground", "context"],
    businessObjectives: ["businessobjectives", "objectives", "goals", "objective"],
    topBarriers: ["top3barriers", "barriers", "keybarriers"],
    addressedBarriers: ["addressedbarriers", "barriersaddressed", "addressingbarriers"],
    targetAudience: ["targetaudience", "audience", "tg"],
    targetGroupInsight: ["targetgroupinsight", "insightabouttargetgroup", "audienceinsight", "tginsight"],
    problemForTargetGroup: ["problemsolvingfortg", "problemfortg", "targetgroupproblem"],
    singleMindedProposition: ["singlemindedproposition", "onething", "takeaway", "smp"],
    reasonsToBelieve: ["reasonstobelieve", "rtb"],
    competitionDifferentiation: ["competition", "differentiation", "competitors"],
    measureSuccess: ["measuresuccess", "kpi", "successmetrics"],
    whySuccessful: ["whysuccessful", "campaignsuccessreason", "whycampaignsuccessful"],
    campaignTimeline: ["campaigntimeline", "timeline", "campaignstartdate", "startdate"],
    campaignDuration: ["campaignduration", "durationdays", "duration"],
    budget: ["budget", "campaignbudget"],
    callToAction: ["calltoaction", "cta"],
    priorityLocations: ["prioritylocationsforthecampaign", "prioritylocations", "locations"],
    campaignDeliverables: ["campaigndeliverables", "deliverables", "executionelements"],
    previousCampaignResults: ["previouscampaigns", "resultsandlearnings", "previouscampaignresults"],
    mandatoryCompliance: ["mandatorycompliance", "compliance", "mandatoryelements"],
    creativeDescription: ["creativedescription", "description", "notes", "additionalnotes"],
}

const normalizeKey = (value = "") => value.toLowerCase().replace(/[^a-z0-9]/g, "")

const findFieldByKey = (rawKey = "") => {
    const normalized = normalizeKey(rawKey)
    return Object.keys(keyMap).find((fieldKey) => keyMap[fieldKey].some((alias) => normalized.includes(alias)))
}

const extractValuesFromObject = (source) => {
    const nextValues = {}

    Object.entries(source).forEach(([k, v]) => {
        const fieldKey = findFieldByKey(k)
        if (!fieldKey) {
            return
        }

        if (typeof v === "string") {
            nextValues[fieldKey] = v.trim()
            return
        }

        if (Array.isArray(v)) {
            nextValues[fieldKey] = v.filter(Boolean).join(", ")
            return
        }

        if (v && typeof v === "object") {
            nextValues[fieldKey] = Object.values(v).filter(Boolean).join(", ")
        }
    })

    return nextValues
}

const extractValuesFromText = (rawText) => {
    const nextValues = {}
    const lines = rawText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)

    lines.forEach((line) => {
        const [keyPart, ...restParts] = line.split(":")
        if (!keyPart || restParts.length === 0) {
            return
        }

        const fieldKey = findFieldByKey(keyPart)
        if (!fieldKey) {
            return
        }

        const value = restParts.join(":").trim()
        if (value) {
            nextValues[fieldKey] = value
        }
    })

    if (Object.keys(nextValues).length === 0) {
        const paragraphs = rawText
            .split(/\n\s*\n/)
            .map((part) => part.trim())
            .filter(Boolean)

        fieldConfig.forEach((field, index) => {
            if (paragraphs[index]) {
                nextValues[field.key] = paragraphs[index]
            }
        })
    }

    return nextValues
}

export default function NewCreative() {
    const [formValues, setFormValues] = useState(emptyForm)
    const [uploadedFileName, setUploadedFileName] = useState("")
    const [isFormLocked, setIsFormLocked] = useState(false)
    const navigate = useNavigate()
    const { theme } = useTheme();

    const isFormComplete = fieldConfig.every((field) => {
        const value = formValues[field.key]
        return String(value ?? "").trim().length > 0
    })
    const canContinue = !isFormLocked && isFormComplete

    const handleFieldChange = (key, value) => {
        setFormValues((prev) => ({ ...prev, [key]: value }))
    }

    const handleFileUpload = (event) => {
        const file = event.target.files?.[0]
        if (!file) {
            return
        }

        setUploadedFileName(file.name)

        const reader = new FileReader()
        reader.onload = () => {
            const text = typeof reader.result === "string" ? reader.result : ""
            if (!text.trim()) {
                return
            }

            let extractedValues = {}

            try {
                const parsed = JSON.parse(text)
                if (parsed && typeof parsed === "object") {
                    extractedValues = extractValuesFromObject(parsed)
                }
            } catch {
                extractedValues = extractValuesFromText(text)
            }

            if (Object.keys(extractedValues).length === 0) {
                extractedValues = extractValuesFromText(text)
            }

            if (Object.keys(extractedValues).length > 0) {
                setFormValues((prev) => ({ ...prev, ...extractedValues }))
            }
        }

        reader.readAsText(file)
    }

    return (
        <div>
            <div className={`p-2 ${theme === 'light' ? "headerBg" : "bg-dark"}`}>
                <h4 className="fw-bold text-light">Creative Requirements</h4>
            </div>
            <div className="container-fluid my-2">
                <div className="row g-2">
                    <div className="col-12 col-lg-8 order-2 order-lg-1 d-flex">
                        <div className="card border shadow-sm flex-fill">
                            <div className="card-header bg-primary-subtle border-bottom">
                                <h1 className="h5 mb-1 fw-semibold">Creative Requirements Form</h1>
                                <p className="mb-0 small text-secondary">Fill in your campaign details below</p>
                            </div>
                            <div className="card-body">
                                <div className="row g-3 requirement-form-body">
                                    {fieldConfig.map((field) => (
                                        <div className={field.size === "short" ? "col-12 col-md-6 col-xl-4" : "col-12 col-xl-6"} key={field.key}>
                                            <label className="form-label fw-semibold mb-1">{field.label}</label>
                                            {field.hint ? <p className="small text-secondary mb-1">{field.hint}</p> : null}
                                            {field.control === "input" ? (
                                                <input
                                                    className="form-control"
                                                    type={field.inputType || "text"}
                                                    placeholder="Enter your answer..."
                                                    value={formValues[field.key]}
                                                    disabled={isFormLocked}
                                                    onChange={(event) => handleFieldChange(field.key, event.target.value)}
                                                />
                                            ) : (
                                                <textarea
                                                    className="form-control"
                                                    rows={field.rows}
                                                    placeholder="Enter your answer..."
                                                    value={formValues[field.key]}
                                                    disabled={isFormLocked}
                                                    onChange={(event) => handleFieldChange(field.key, event.target.value)}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="card-footer border-0">
                                <div className="d-flex flex-wrap gap-2 justify-content-end">
                                    {isFormLocked ? (
                                        <button className="btn btn-outline-secondary" type="button" onClick={() => setIsFormLocked(false)}>
                                            <i className="bi bi-pencil-square me-2"></i>
                                            Edit
                                        </button>
                                    ) : (
                                        <button className="btn btn-danger" type="button" disabled={!canContinue} onClick={() => setIsFormLocked(true)}>
                                            <i className="bi bi-stars me-2"></i>
                                            Continue
                                        </button>
                                    )}
                                    <button className="btn btn-danger" type="button" disabled={!isFormLocked} onClick={() => navigate("/creatives/brief-analysis")}>
                                        <i className="bi bi-lightning-charge me-2"></i>
                                        Start Brief Analysis
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-4 order-1 order-lg-2">
                        <div className="card border shadow-sm mb-3">
                            <div className="card-body">
                                <h2 className="h6 fw-semibold mb-3">
                                    <i className="bi bi-upload me-2"></i>
                                    Upload Brief
                                </h2>
                                <div className="border rounded-3 p-4 text-center bg-body-tertiary">
                                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-danger-subtle text-danger mb-3 p-3 lh-1">
                                        <i className="bi bi-upload"></i>
                                    </div>
                                    <p className="text-secondary mb-3">Upload creative brief document</p>
                                    <input className="form-control" type="file" disabled={isFormLocked} onChange={handleFileUpload} />
                                    {uploadedFileName ? <p className="small text-success mt-2 mb-0">Loaded: {uploadedFileName}</p> : null}
                                </div>
                            </div>
                        </div>

                        <div className="card border shadow-sm mb-3">
                            <div className="card-body">
                                <h2 className="h6 fw-semibold mb-3">
                                    <i className="bi bi-file-earmark-text me-2"></i>
                                    Creative Description
                                </h2>
                                <textarea className="form-control" rows={4} placeholder="Add any additional notes or context about your campaign..." value={formValues.creativeDescription} disabled={isFormLocked} onChange={(event) => handleFieldChange("creativeDescription", event.target.value)} />
                            </div>
                        </div>

                        <div className="card border shadow-sm">
                            <div className="card-header bg-danger-subtle">
                                <h2 className="h6 fw-semibold mb-0">
                                    <i className="bi bi-stars me-2"></i>
                                    AI Assistant
                                </h2>
                                <p className="small mb-0 text-secondary">Get help filling the form</p>
                            </div>
                            <div className="card-body">
                                <div className="bg-body-tertiary rounded-3 p-3 small mb-3">
                                    Hello! I&apos;m here to help you fill out your creative requirements. I can suggest content, refine your answers, or answer questions about any field.
                                </div>
                                <div className="input-group">
                                    <input className="form-control" type="text" placeholder="Ask AI for help..." />
                                    <button className="btn btn-danger" type="button">
                                        <i className="bi bi-send"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
