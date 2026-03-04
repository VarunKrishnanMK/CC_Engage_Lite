import { useThemeStore } from "../../stores/themeStore"
import CreativeWorkflowSteps from "../../components/CreativeWorkflowSteps"
import { useLocation, useNavigate } from "react-router-dom"
import { useRef, useState } from "react"
import GrapesMjmlEditorPanel from "../../components/GrapesMjmlEditorPanel"
import { useCreativeFlowStore } from "../../stores/creativeFlowStore"

export default function PreviewExport() {
    const theme = useThemeStore((state) => state.theme)
    const navigate = useNavigate()
    const location = useLocation()
    const editorPanelRef = useRef(null)
    const [isDownloadingHtml, setIsDownloadingHtml] = useState(false)
    const [isDownloadingBundle, setIsDownloadingBundle] = useState(false)
    const orderedMjmlFromStore = useCreativeFlowStore((state) => state.selectedOrderedMjml)
    const orderedMjml = location?.state?.orderedMjml || orderedMjmlFromStore || ""

    const handleDownloadHtml = async () => {
        if (!editorPanelRef.current || isDownloadingHtml) {
            return
        }

        setIsDownloadingHtml(true)
        try {
            await editorPanelRef.current.downloadHtml()
        } finally {
            setIsDownloadingHtml(false)
        }
    }

    const handleDownloadBundle = async () => {
        if (!editorPanelRef.current || isDownloadingBundle) {
            return
        }

        setIsDownloadingBundle(true)
        try {
            await editorPanelRef.current.downloadBundle()
        } finally {
            setIsDownloadingBundle(false)
        }
    }

    return (
        <div>
            <div className={`p-2 ${theme === "light" ? "headerBg" : "bg-dark"}`}>
                <h4 className="fw-bold text-light mb-0">Preview & Export</h4>
            </div>
            <div className="container-fluid mt-3">
                <CreativeWorkflowSteps currentStep="preview" />

                <div className="row g-2 mt-1">
                    <div className="col-12 col-xl-3">
                        <div className="card border shadow-sm mb-3">
                            <div className="card-body">
                                <h5 className="fw-bold h6 mb-3">
                                    <i className="bi bi-download me-2 text-danger"></i>
                                    Export Options
                                </h5>
                                <div className="row g-2">
                                    <div className="col-md-6">
                                        <button type="button" className="button-primary w-100 mb-2" onClick={handleDownloadHtml} disabled={isDownloadingHtml || isDownloadingBundle}>
                                            {isDownloadingHtml ? "Preparing..." : "Download HTML"}
                                        </button>
                                    </div>
                                    <div className="col-md-6">
                                        <button type="button" className="button-primary w-100 mb-2" onClick={handleDownloadBundle} disabled={isDownloadingHtml || isDownloadingBundle}>
                                            {isDownloadingBundle ? "Preparing..." : "Download Bundle"}
                                        </button>
                                        <p className="small text-secondary mb-0">Bundle includes: HTML, CSS, Assets</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card border shadow-sm mb-3">
                            <div className="card-body">
                                <h5 className="fw-bold h6 mb-3">
                                    <i className="bi bi-envelope me-2 text-danger"></i>
                                    Test Creative
                                </h5>
                                <p className="small text-secondary mb-1">Send test email to:</p>
                                <div className="input-group mb-3">
                                    <input className="form-control" type="email" placeholder="your@email.com" />
                                    <button type="button" className="btn btn-danger"><i className="bi bi-send"></i></button>
                                </div>
                                <p className="small text-secondary mb-1">Email Provider Tests:</p>
                                <div className="row">
                                    <div className="col-6 col-md-4  mb-3">
                                        <input type="radio" className="btn-check" name="emailProvider" id="gmail" autoComplete="off" defaultChecked />
                                        <label className="btn btn-outline-danger w-100" htmlFor="gmail"><i className="bi bi-envelope-at-fill"></i><br />G-mail</label>
                                    </div>
                                    <div className="col-6 col-md-4  mb-3">
                                        <input type="radio" className="btn-check" name="emailProvider" id="outlook" autoComplete="off" />
                                        <label className="btn btn-outline-danger w-100" htmlFor="outlook"><i className="bi bi-whatsapp"></i> <br />Outlook</label>
                                    </div>
                                    <div className="col-6 col-md-4  mb-3">
                                        <input type="radio" className="btn-check" name="emailProvider" id="yahoo" autoComplete="off" />
                                        <label className="btn btn-outline-danger w-100" htmlFor="yahoo"><i className="bi bi-patch-check-fill"></i><br />Yahoo</label>
                                    </div>
                                    <div className="col-6 col-md-4  mb-3">
                                        <input type="radio" className="btn-check" name="emailProvider" id="appleMail" autoComplete="off" />
                                        <label className="btn btn-outline-danger w-100" htmlFor="appleMail"><i className="bi bi-phone"></i> <br />Apple Mail</label>
                                    </div>
                                </div>
                                <button type="button" className="btn btn-outline-primary w-100 mb-3">Run Provider Tests</button>
                                <p className="small text-secondary mb-1">Dark Mode Test:</p>
                                <div className="btn-group w-100 mb-2">
                                    <div className="col-6 mb-3">
                                        <input type="radio" className="btn-check" name="themeSetup" id="lightTheme" autoComplete="off" defaultChecked />
                                        <label className="btn btn-light w-100" htmlFor="lightTheme">Light</label>
                                    </div>
                                    <div className="col-6 mb-3">
                                        <input type="radio" className="btn-check" name="themeSetup" id="darkTheme" autoComplete="off" />
                                        <label className="btn btn-outline-dark w-100" htmlFor="darkTheme">Dark</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card border shadow-sm">
                            <div className="card-body">
                                <h5 className="fw-bold h6 mb-3">Test Results</h5>
                                <div className="row g-2">
                                    {["Gmail", "Outlook", "Dark Mode", "Mobile"].map((item) => (
                                        <div key={item} className="col-sm-6">
                                            <div className="d-flex justify-content-between align-items-center bg-success-subtle border border-success-subtle rounded px-2 py-1 mb-2">
                                                <span className="small">{item}</span>
                                                <span className="badge text-bg-success">Passed</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" className="button-primary w-100 mt-2" onClick={() => navigate("/creatives/success")}>
                                    Complete
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-xl-9">
                        <GrapesMjmlEditorPanel ref={editorPanelRef} initialMjml={orderedMjml} />
                    </div>
                </div>
            </div>
        </div>
    )
}
