import { useNavigate } from "react-router-dom"
import { useThemeStore } from "../../stores/themeStore"

export default function CampaignSuccess() {
    const navigate = useNavigate()
    const theme = useThemeStore((state) => state.theme)

    return (
        <div>
            <div className={`p-2 ${theme === "light" ? "headerBg" : "bg-dark"}`}>
                <h4 className="fw-bold text-light mb-0">Creative Status</h4>
            </div>
            <div className="container mt-2">
                <div className="success-card d-flex justify-content-center align-items-center">
                    <div className="card border-0 rounded-5 shadow-sm">
                        <div className="card-body card-padding">
                            <div className="d-flex justify-content-center mb-4">
                                <span className="rounded-circle bg-success text-white text-center pt-3" style={{ width: "75px", height: "75px" }}>
                                    <i className="bi bi-check-lg rounded-circle border border-3 border-light fs-2"></i>
                                </span>
                            </div>
                            <h2 className="h2 fw-bold text-center mb-1">Creative Generated Successfully!</h2>
                            <p className="text-secondary text-center mb-3">Your email creative  has been sent to all recipients</p>
                            <div className="row g-3 mb-3">
                                <div className="col-sm-4">
                                    <div className="rounded p-3 bg-primary-subtle text-center h-100">
                                        <i className="bi bi-envelope fs-4 text-primary"></i>
                                        <div className="fs-3 fw-bold text-primary mt-2">1,247</div>
                                        <div className="small text-primary-emphasis">Emails Sent</div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="rounded p-3 bg-body-secondary text-center h-100">
                                        <i className="bi bi-people fs-4 text-info"></i>
                                        <div className="fs-3 fw-bold text-info mt-2">1,247</div>
                                        <div className="small text-info-emphasis">Recipients</div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="rounded p-3 bg-success-subtle text-center h-100">
                                        <i className="bi bi-graph-up-arrow fs-4 text-success"></i>
                                        <div className="fs-3 fw-bold text-success mt-2">98.5%</div>
                                        <div className="small text-success-emphasis">Delivery Rate</div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded border-0 shadow-sm bg-body-tertiary border p-3 mb-3">
                                <h5 className="h5 fw-bold mb-3">CreativeDetails</h5>
                                <div className="d-flex justify-content-between mb-2"><span className="text-secondary">Creative Name:</span><span>Axis Bank SSY Creative</span></div>
                                <div className="d-flex justify-content-between mb-2"><span className="text-secondary">Sent Date:</span><span>Feb 17, 2026 at 2:45 PM</span></div>
                                <div className="d-flex justify-content-between mb-2"><span className="text-secondary">Template:</span><span>Sukanya Samriddhi Yojana</span></div>
                                <div className="d-flex justify-content-between"><span className="text-secondary">Status:</span><span className="badge text-bg-success">Delivered</span></div>
                            </div>

                            <button type="button" className="button-primary w-100 mb-2" onClick={() => navigate("/creatives/new")}>
                                <i className="bi bi-plus-lg me-2"></i>
                                Create New Creative
                            </button>
                            <div className="row g-2 mb-2">
                                <div className="col-12 col-md-4"><button type="button" className="btn btn-outline-secondary w-100">View Report</button></div>
                                <div className="col-12 col-md-4"><button type="button" className="btn btn-outline-secondary w-100">Download</button></div>
                                <div className="col-12 col-md-4"><button type="button" className="btn btn-outline-secondary w-100">Share</button></div>
                            </div>
                            <div className="text-center">
                                <button type="button" className="btn btn-link text-decoration-none" onClick={() => navigate("/dashboard")}>
                                    <i className="bi bi-house-door me-2"></i>
                                    Back to Dashboard
                                </button>
                            </div>
                            <p className="small text-secondary text-center mb-0">
                                <i className="bi bi-graph-up-arrow me-1"></i>
                                Track your creative  performance in the Analytics dashboard
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
