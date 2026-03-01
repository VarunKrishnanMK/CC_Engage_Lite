import { useTheme } from "../../contexts/ThemeContext"
import CreativeWorkflowSteps from "../../components/CreativeWorkflowSteps"
import { useNavigate } from "react-router-dom"

export default function PreviewExport() {
    const { theme } = useTheme()
    const navigate = useNavigate()

    return (
        <div>
            <div className={`p-2 ${theme === "light" ? "headerBg" : "bg-dark"}`}>
                <h4 className="fw-bold text-light mb-0">Preview & Export</h4>
            </div>
            <div className="container-fluid my-3">
                <CreativeWorkflowSteps currentStep="preview" />

                <div className="row g-3 mt-1">
                    <div className="col-12 col-xl-4">
                        <div className="card border shadow-sm mb-3">
                            <div className="card-body">
                                <h5 className="fw-bold h6 mb-3">
                                    <i className="bi bi-download me-2 text-danger"></i>
                                    Export Options
                                </h5>
                                <div className="row g-2">
                                    <div className="col-md-6">
                                        <button type="button" className="button-primary w-100 mb-2">Download HTML</button>
                                    </div>
                                    <div className="col-md-6">
                                        <button type="button" className="button-primary w-100 mb-2">Download Creative Bundle</button>
                                        <p className="small text-secondary mb-0">Bundle includes: HTML, CSS, Images, Assets</p>
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

                    <div className="col-12 col-xl-8">
                        <div className="card border shadow-sm">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <b className="fw-bold h6 mb-0">Email Preview</b>
                                    <div className="btn-group">
                                        <ul className="nav nav-pills me-2 border border-1 bg-dark-subtle rounded-3" id="pills-tab" role="tablist">
                                            <li className="nav-item me-2" role="presentation">
                                                <button className="nav-link active" id="pills-preview-tab" data-bs-toggle="pill" data-bs-target="#pills-preview" type="button" role="tab" aria-controls="pills-preview" aria-selected="true"><i className="bi bi-eye-fill"></i> Preview</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id="pills-html-tab" data-bs-toggle="pill" data-bs-target="#pills-html" type="button" role="tab" aria-controls="pills-html" aria-selected="false"><i className="bi bi-code-slash"></i> Html</button>
                                            </li>
                                        </ul>
                                        <div>
                                            <input type="radio" className="btn-check" name="siteVite" id="desktopView" autoComplete="off" defaultChecked />
                                            <label className="btn btn-outline-secondary btn-sm me-1 rounded-3" htmlFor="desktopView"><i className="bi bi-pc-display-horizontal"></i></label>
                                        </div>
                                        <div>
                                            <input type="radio" className="btn-check" name="siteVite" id="mobileView" autoComplete="off" />
                                            <label className="btn btn-outline-secondary btn-sm rounded-3" htmlFor="mobileView"><i className="bi bi-tablet"></i></label>
                                        </div>
                                    </div>
                                </div>

                                <div className="border rounded p-3 bg-body-tertiary">
                                    <div className="tab-content" id="pills-tabContent">
                                        <div className="tab-pane fade show active" id="pills-preview" role="tabpanel" aria-labelledby="pills-preview-tab" tabindex="0">
                                            <h2 className="h2 text-center text-danger fw-bold mb-2">Secure Her Future with Axis Bank SSY</h2>
                                            <p className="text-center fw-semibold mb-2">Start Early, Invest Wisely for Her Bright Future</p>
                                            <p className="small text-center mb-3">Axis Bank&apos;s Sukanya Samriddhi Yojana (SSY) offers a simple, trusted, and rewarding investment option for your girl child&apos;s future education and marriage expenses.</p>
                                            <img className="img-fluid mb-3 w-100" src="/Image (Family Bonding).svg" />
                                            <p className="mb-3">Dear {"{Customer_Name}"}, ensure a prosperous future for your daughter today.</p>
                                            <h5 className="fw-bold mb-2">Why Choose Us?</h5>
                                            <div className="bg-warning-subtle rounded px-2 py-2 mb-2 fw-semibold"><span className="badge text-bg-warning me-2">1</span>Government-Backed Scheme</div>
                                            <div className="bg-warning-subtle rounded px-2 py-2 mb-2 fw-semibold"><span className="badge text-bg-warning me-2">2</span>Tax Benefits</div>
                                            <div className="text-center my-4"><button type="button" className="btn btn-warning text-white fw-semibold">Open an SSY Account Today</button></div>
                                            <hr />
                                            <p className="small text-center text-secondary mb-1">Terms and conditions apply. Rates and offers subject to change.</p>
                                            <p className="small text-center text-secondary mb-0">© 2026 Axis Bank. All rights reserved.</p></div>
                                        <div className="tab-pane fade" id="pills-html" role="tabpanel" aria-labelledby="pills-html-tab" tabindex="0">html</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
