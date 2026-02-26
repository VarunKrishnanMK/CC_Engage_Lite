import BriefAnalysisScreenshot from "../../components/BriefAnalysisScreenshot"
import CreativeWorkflowSteps from "../../components/CreativeWorkflowSteps"
import { useTheme } from "../../contexts/ThemeContext"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function BriefAnalysis() {
    const { theme } = useTheme()
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState("brief")

    useEffect(() => {
        if (currentStep !== "analysis") {
            return
        }

        const timerId = window.setTimeout(() => {
            setCurrentStep("variations")
            navigate("/creatives/select-variations")
        }, 2500)

        return () => window.clearTimeout(timerId)
    }, [currentStep, navigate])

    return (
        <div>
            <div className={`p-2 ${theme === "light" ? "headerBg" : "bg-dark"}`}>
                <h4 className="fw-bold text-light mb-0">Brief Analysis</h4>
            </div>
            <div className="container-fluid my-3">
                <CreativeWorkflowSteps currentStep={currentStep} />
                <div className="container my-3">
                    <BriefAnalysisScreenshot
                        isAnalyzing={currentStep === "analysis"}
                        onStartAnalysis={() => setCurrentStep("analysis")}
                        onAnalysisComplete={() => {
                            setCurrentStep("variations")
                            navigate("/creatives/select-variations")
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
