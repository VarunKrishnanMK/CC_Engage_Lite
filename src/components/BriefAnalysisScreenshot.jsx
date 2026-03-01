import { useState } from "react"

const wireframeSections = [
    {
        id: "hero",
        title: "1. HERO SECTION",
        body: (
            <div className="d-grid gap-2 p-3">
                <div className="border rounded bg-body p-2">
                    <label className="form-label fw-bold text-primary small mb-1">HEADLINE:</label>
                    <p className="mb-0">Secure Her Future with Axis Bank SSY</p>
                </div>
                <div className="border rounded bg-body p-2">
                    <label className="form-label fw-bold text-primary small mb-1">SUB_HEADLINE:</label>
                    <p className="mb-0">Start Early, Invest Wisely for Her Bright Future</p>
                </div>
                <div className="border rounded bg-body p-2">
                    <label className="form-label fw-bold text-primary small mb-1">HERO_VISUAL:</label>
                    <p className="mb-0">Image of a young girl with her parents, symbolizing future security.</p>
                </div>
            </div>
        ),
    },
    { id: "greeting", title: "2. GREETING BLOCK" },
    { id: "description", title: "3. DESCRIPTION" },
    { id: "feature", title: "4. PRODUCT / FEATURE / STEPS - Section A" },
    { id: "steps", title: "5. STEPS / GET STARTED / LOGIN - Section B" },
    { id: "reach", title: "6. REACH US - Section C (OPTIONAL)" },
    { id: "terms", title: "7. TERMS & CONDITIONS" },
    { id: "footer", title: "8. FOOTER" },
]

const analysisProgressRows = [
    { label: "Hero Section", done: true },
    { label: "Greeting Block", done: true },
    { label: "Description", done: true },
    { label: "Features Section", done: true },
    { label: "Steps Section", done: true },
    { label: "Contact Section", done: true },
    { label: "Terms & Conditions", done: true },
    { label: "Call to Action", done: false },
    { label: "Footer", done: false },
]

export default function BriefAnalysisScreenshot({ isAnalyzing, onStartAnalysis, onAnalysisComplete }) {
    const [expandedIds, setExpandedIds] = useState(["hero"])

    const toggleSection = (id) => {
        setExpandedIds((prev) => (
            prev.includes(id)
                ? prev.filter((sectionId) => sectionId !== id)
                : [...prev, id]
        ))
    }

    if (isAnalyzing) {
        return (
            <section className="row justify-content-center">
                <div className="col-12 col-xl-8">
                    <article className="card shadow-sm border">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-center mb-3">
                                <span className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center" style={{ width: "56px", height: "56px" }}>
                                    <i className="bi bi-stars"></i>
                                </span>
                            </div>
                            <h3 className="h3 fw-bold text-center mb-1">Analyzing Your Email Creative</h3>
                            <p className="text-secondary text-center mb-3">Our AI is generating 4 unique variations for each section</p>

                            <div className="d-flex justify-content-between small text-secondary mb-1">
                                <span>Overall Progress</span>
                                <strong className="text-primary">7 / 9 Sections</strong>
                            </div>
                            <div className="progress mb-3" role="progressbar" aria-label="Analysis progress" aria-valuenow={78} aria-valuemin={0} aria-valuemax={100}>
                                <div className="progress-bar bg-primary" style={{ width: "78%" }}></div>
                            </div>

                            <div className="d-grid gap-2">
                                {analysisProgressRows.map((row) => (
                                    <div key={row.label} className={`d-flex justify-content-between align-items-center border rounded p-3 ${row.done ? "bg-success-subtle border-success-subtle" : "bg-body-tertiary border-secondary-subtle"}`}>
                                        <div>
                                            <p className="mb-1">{row.label}</p>
                                            {row.done ? <span className="badge text-success border border-success bg-transparent fw-normal">4 Variations Ready</span> : null}
                                        </div>
                                        <i className={`bi ${row.done ? "bi-check-circle text-success" : "bi-circle text-secondary"}`}></i>
                                    </div>
                                ))}
                            </div>
                            <div className="d-flex justify-content-end pt-3">
                                <button type="button" className="btn btn-primary" onClick={onAnalysisComplete}>
                                    Continue to Select Variations
                                </button>
                            </div>
                        </div>
                    </article>
                </div>
            </section>
        )
    }

    return (
        <div className="row g-3">
            <aside className="col-12 col-lg-4 col-xl-3">
                <div className="card border shadow-sm">
                    <div className="card-body">
                        <h6 className="fw-bold mb-3">
                            <i className="bi bi-collection me-2"></i>
                            Library Overview
                        </h6>
                        <ul className="list-unstyled mb-3">
                            <li className="d-flex justify-content-between align-items-center border-bottom py-2"><span className="small text-secondary">Emails</span><strong>2</strong></li>
                            <li className="d-flex justify-content-between align-items-center border-bottom py-2"><span className="small text-secondary">Heroes</span><strong>1</strong></li>
                            <li className="d-flex justify-content-between align-items-center border-bottom py-2"><span className="small text-secondary">Icons</span><strong>0</strong></li>
                        </ul>
                        <div className="mb-3">
                            <p className="small text-secondary mb-1">Total Assets</p>
                            <strong>3</strong>
                        </div>
                        <p className="small text-secondary mb-1">3 analyses cached</p>
                        <ul className="small mb-0">
                            <li>Email Creative</li>
                            <li>Hero Image</li>
                            <li>Icon Set</li>
                        </ul>
                    </div>
                </div>
            </aside>

            <section className="col-12 col-lg-8 col-xl-9">
                <article className="card border shadow-sm">
                    <div className="card-body d-flex flex-column" style={{ height: "78vh", minHeight: "620px" }}>
                        <h4 className="h3 fw-bold mb-2">
                            <i className="bi bi-layout-text-window-reverse me-2"></i>
                            Mailer Outline Wireframe
                        </h4>
                        <p className="small text-primary">Wireframe will populate here after you upload a brief.</p>

                        <div className="mt-2 flex-grow-1 overflow-auto pe-1">
                            <div className="accordion">
                                {wireframeSections.map((section) => {
                                    const isExpanded = expandedIds.includes(section.id)
                                    return (
                                        <div className="accordion-item border mb-2 rounded overflow-hidden" key={section.id}>
                                            <h2 className="accordion-header">
                                                <button type="button" className={`accordion-button ${isExpanded ? "" : "collapsed"} py-2`} onClick={() => toggleSection(section.id)}>
                                                    <span className="d-flex w-100 justify-content-between align-items-center me-2">
                                                        <span className="small fw-semibold">{section.title}</span>
                                                        <span className="badge rounded-pill text-success border border-success bg-success-subtle fw-normal">Populated</span>
                                                    </span>
                                                </button>
                                            </h2>
                                            {isExpanded ? (
                                                <div className="accordion-collapse show">
                                                    <div className="accordion-body bg-body-tertiary p-0">
                                                        {section.body || <div className="small text-secondary p-3">Content generated from uploaded brief.</div>}
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="d-flex justify-content-center pt-3">
                            <button type="button" className="btn btn-danger" onClick={onStartAnalysis}>
                                <i className="bi bi-stars me-2"></i>
                                Start AI Analysis
                            </button>
                        </div>
                    </div>
                </article>
            </section>
        </div>
    )
}
