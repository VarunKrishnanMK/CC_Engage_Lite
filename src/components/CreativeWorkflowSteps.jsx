const workflowSteps = [
    { label: "Brief & Wireframe", key: "brief" },
    { label: "AI Analysis", key: "analysis" },
    { label: "Select Variations", key: "variations" },
    { label: "Preview & Export", key: "preview" },
]

export default function CreativeWorkflowSteps({ currentStep }) {
    const currentStepIndex = workflowSteps.findIndex((step) => step.key === currentStep)

    return (
        <div className="d-flex flex-wrap align-items-center gap-2">
            {workflowSteps.map((step, index) => {
                const isComplete = index < currentStepIndex
                const isActive = index === currentStepIndex
                const isGreen = isComplete || isActive
                return (
                    <span key={step.key} className={`badge rounded-pill fw-semibold px-3 py-2 border ${isGreen ? "text-success border-success bg-success-subtle" : "text-secondary border-secondary-subtle bg-body-tertiary"}`}>
                        <i className={`bi ${isGreen ? "bi-check-circle-fill" : "bi-square"} me-2`}></i>
                        {step.label}
                    </span>
                )
            })}
        </div>
    )
}
