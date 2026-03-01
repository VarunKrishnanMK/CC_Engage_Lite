import { useState } from "react"
import { useTheme } from "../../contexts/ThemeContext"
import CreativeWorkflowSteps from "../../components/CreativeWorkflowSteps"
import { useNavigate } from "react-router-dom"
import AIChatSection from "../../components/AIChatSection"

const sectionConfig = [
    {
        key: "hero",
        label: "Hero",
        icon: <i className="bi bi-transparency"></i>,
        heading: "Select Hero Layout",
        subheading: "Choose the layout that best captures attention.",
        previewType: "hero",
        variations: [
            { image: "/Image (Family Bonding) (1).svg", title: "Family Bonding", sub: "Secure Her Future with Axis Bank SSY", tags: ["Centered", "Family", "Orange"] },
            { image: "/Image (Empowerment).svg", title: "Empowerment", sub: "Build Her Dreams Today", tags: ["Split 50:50", "Girl studying"] },
            { image: "/Image (Future Success).svg", title: "Future Success", sub: "Invest in Her Future", tags: ["Overlay", "Graduation"] },
            { image: "/Image (Parent & Child).svg", title: "Parent & Child", sub: "Secure Tomorrow Today", tags: ["Side by side", "Parent-child"] },
        ],
    },
    {
        key: "greeting",
        label: "Greeting",
        icon: "👋",
        heading: "Select Greeting Style",
        subheading: "Choose the tone that fits your brand.",
        previewType: "greeting",
        variations: [
            { title: "Formal & Respectful", sub: "Dear {Customer_Name}, ensure a prosperous future for your daughter today.", tags: ["Formal", "Serif", "Left"] },
            { title: "Warm & Friendly", sub: "Hello {Customer_Name}! Ready to invest in your child future?", tags: ["Warm", "Simple"] },
            { title: "Personal & Caring", sub: "Hi {Customer_Name}, we have something special for your family.", tags: ["Personal", "Modern"] },
            { title: "Professional & Direct", sub: "Greetings {Customer_Name}, discover our exclusive SSY plan.", tags: ["Professional", "Direct"] },
        ],
    },
    {
        key: "description",
        label: "Description",
        icon: "📝",
        heading: "Select Description Layout",
        subheading: "Choose the most readable format.",
        previewType: "description",
        variations: [
            { title: "Paragraph Style", sub: "Axis Bank Sukanya Samriddhi Yojana (SSY) offers a simple, trusted, rewarding plan.", tags: ["Paragraph", "Medium", "Bold"] },
            { title: "Bullet Points", sub: "Simple, Trusted, Government-backed and attractive returns.", tags: ["Bullet", "Compact"] },
            { title: "Short & Punchy", sub: "Give your daughter the future she deserves. SSY made easy.", tags: ["Short", "Punchy"] },
            { title: "Detailed Explanation", sub: "The Sukanya Samriddhi Yojana is a government-backed long-term plan.", tags: ["Detailed", "Long copy"] },
        ],
    },
    {
        key: "features",
        label: "Features",
        icon: "✨",
        heading: "Select Features/Benefits Layout",
        subheading: "Choose how to present key features.",
        previewType: "features",
        variations: [
            { title: "Icon List Vertical", sub: "Three features with icons on separate rows.", tags: ["Vertical", "48px icons", "Minimal"] },
            { title: "Card Grid", sub: "Three feature cards in a 3-column structure.", tags: ["3-column", "56px icons"] },
            { title: "Numbered Steps", sub: "Features as numbered benefits.", tags: ["Numbered", "Circles"] },
            { title: "Icon Badges", sub: "Horizontal badges with icon labels.", tags: ["Horizontal", "32px icons"] },
        ],
    },
    {
        key: "steps",
        label: "Steps",
        icon: "🚀",
        heading: "Select Steps/Get Started Layout",
        subheading: "Choose the most scannable format.",
        previewType: "steps",
        variations: [
            { title: "Numbered Vertical", sub: "Steps with large numbers on separate lines.", tags: ["Vertical", "Circle badges", "Spacious"] },
            { title: "Timeline Style", sub: "Steps connected with a line.", tags: ["Timeline", "Connected"] },
            { title: "Card Steps", sub: "Each step in its own card.", tags: ["Horizontal", "Badge"] },
            { title: "Compact List", sub: "Minimal numbered list.", tags: ["Simple", "Inline"] },
        ],
    },
    {
        key: "contact",
        label: "Contact",
        icon: "📞",
        heading: "Select Contact Section Layout",
        subheading: "Choose the most accessible format.",
        previewType: "contact",
        variations: [
            { title: "Icon List", sub: "Contact details with icons and clear labels.", tags: ["Vertical", "24px icons", "Simple"] },
            { title: "Card CTA", sub: "Contact info in a highlighted action card.", tags: ["Centered", "32px icons"] },
            { title: "Button Links", sub: "Contact options as buttons.", tags: ["Horizontal", "Button icons"] },
            { title: "Split Info", sub: "Contact split into sections.", tags: ["2-column", "Headers"] },
        ],
    },
    {
        key: "terms",
        label: "Terms",
        icon: "📄",
        heading: "Select Terms & Conditions Layout",
        subheading: "Choose the most readable format.",
        previewType: "terms",
        variations: [
            { title: "Compact Footer", sub: "Small text at bottom", tags: ["10px", "Gray", "Compact"] },
            { title: "Separated Box", sub: "Terms in a light box", tags: ["11px", "Dark gray"] },
            { title: "Expandable", sub: "Collapsible terms section", tags: ["10px", "Gray"] },
            { title: "Bullet List", sub: "Terms as bullet points", tags: ["11px", "Gray"] },
        ],
    },
    {
        key: "cta",
        label: "CTA",
        icon: "🎯",
        heading: "Select Call-to-Action Layout",
        subheading: "Choose the most compelling format.",
        previewType: "cta",
        variations: [
            { title: "Bold Center", sub: "Large centered button", tags: ["Center", "Large", "Gradient"] },
            { title: "Dual Buttons", sub: "Primary and secondary action", tags: ["Center", "Medium"] },
            { title: "Full Width", sub: "Edge-to-edge button", tags: ["Full width", "Large"] },
            { title: "Icon Button", sub: "Button with icon", tags: ["Center", "Large"] },
        ],
    },
    {
        key: "footer",
        label: "Footer",
        icon: "📎",
        heading: "Select Footer Layout",
        subheading: "Choose your preferred style.",
        previewType: "footer",
        variations: [
            { title: "Simple Links", sub: "Unsubscribe | Privacy | Contact", tags: ["Single line", "Pipe", "Minimal"] },
            { title: "Multi-line", sub: "Links stacked vertically", tags: ["Stacked", "Lines"] },
            { title: "Social + Links", sub: "Social icons with links", tags: ["Two rows", "Icons"] },
            { title: "Grid Footer", sub: "Links in columns", tags: ["3 columns", "Grouped"] },
        ],
    },
]

export default function SelectVariations() {
    const { theme } = useTheme()
    const navigate = useNavigate()
    const [activeSection, setActiveSection] = useState("hero")
    const [selectedVariationBySection, setSelectedVariationBySection] = useState(
        sectionConfig.reduce((acc, section) => ({ ...acc, [section.key]: 0 }), {})
    )
    const currentSection = sectionConfig.find((item) => item.key === activeSection) || sectionConfig[0]
    const currentVariationIndex = selectedVariationBySection[activeSection] ?? 0
    const currentVariation = currentSection.variations[currentVariationIndex]

    const renderPreview = () => {
        switch (currentSection.previewType) {
            case "hero":
                return (
                    <div>
                        <h6 className="text-center fw-bold text-danger mb-2">Secure Her Future with Axis Bank SSY</h6>
                        <img className="img-fluid w-100" src="/Image (Family Bonding).svg" />
                    </div>
                )
            case "greeting":
                return <div className="border rounded p-3 bg-body-tertiary">Dear {"{Customer_Name}"}, ensure a prosperous future for your daughter today.</div>
            case "description":
                return <div className="border rounded p-3 bg-body-tertiary">Axis Bank&apos;s Sukanya Samriddhi Yojana (SSY) offers a simple, trusted, and rewarding investment option for your girl child&apos;s future education and marriage expenses.</div>
            case "features":
                return (
                    <div className="border rounded p-3 bg-body-tertiary">
                        <div className="fw-semibold mb-2">Why Choose Us?</div>
                        {["Government-Backed", "Tax Benefits", "Flexible Deposits"].map((item, index) => (
                            <div key={item} className="bg-warning-subtle rounded px-2 py-2 mb-2 fw-semibold">
                                <span className="badge text-bg-warning me-2">{index + 1}</span>
                                {item}
                            </div>
                        ))}
                    </div>
                )
            case "steps":
                return (
                    <div className="border rounded p-3 bg-body-tertiary">
                        <div className="fw-semibold text-warning-emphasis">Get Started</div>
                        <div className="mt-1"><span className="badge text-bg-warning me-2">1</span><span className="fw-semibold">Visit Branch</span></div>
                        <div className="mt-1"><span className="badge text-bg-warning me-2">2</span><span className="fw-semibold">Digital Contributions</span></div>
                    </div>
                )
            case "contact":
                return (
                    <div className="border rounded p-3 bg-body-tertiary text-center">
                        <div className="mb-1"><i className="bi bi-envelope me-1"></i>support@axisbank.com</div>
                        <div><i className="bi bi-telephone me-1"></i>1800-123-4567</div>
                    </div>
                )
            case "terms":
                return <div className="border rounded p-3 bg-body-tertiary text-center">Terms and conditions apply. Interest rates subject to change.</div>
            case "cta":
                return (
                    <div className="border rounded p-3 bg-body-tertiary text-center">
                        <div className="fw-semibold">Ready to Get Started?</div>
                        <button type="button" className="btn btn-warning text-white fw-semibold mt-1">Open an SSY Account Today</button>
                    </div>
                )
            case "footer":
                return <div className="border rounded p-3 bg-body-tertiary text-center small">Unsubscribe | Privacy | Contact</div>
            default:
                return null
        }
    }

    return (
        <div>
            <div className={`p-2 ${theme === "light" ? "headerBg" : "bg-dark"}`}>
                <h4 className="fw-bold text-light mb-0">Select Variations</h4>
            </div>
            <div className="container-fluid my-2">
                <div className="card border-0 p-2 mb-2">
                    <CreativeWorkflowSteps currentStep="variations" />
                    <div className="py-2">
                        <div className="d-flex flex-wrap align-items-center gap-1">
                            {sectionConfig.map((section) => (
                                <button key={section.key} type="button" className={`btn btn-sm rounded-pill border ${section.key === activeSection ? "btn-danger text-white" : "btn-white text-secondary border-danger"}`} onClick={() => setActiveSection(section.key)}>
                                    <span className="me-1">{section.icon}</span>{section.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="row g-2">
                    <div className="col-xl-5">
                        <div className="mb-2">
                            <h5 className="fw-bold mb-1">{currentSection.heading}</h5>
                            <small clssName="small text-secondary mb-2">{currentSection.subheading}</small>
                            <p className="my-2 fw-bold">Choose Variation</p>
                            <div className="row g-2">
                                {currentSection.variations.map((card, index) => (
                                    <div className="col-lg-6">
                                        <button key={`${currentSection.key}-${card.title}`} type="button" className={`btn text-start w-100 border ${index === currentVariationIndex ? "border-primary bg-primary-subtle" : "border-danger"}`} onClick={() => setSelectedVariationBySection((prev) => ({ ...prev, [activeSection]: index }))}>
                                            <div className="d-flex gap-2">
                                                <img className="img-fluid" src={card.image} />
                                                <div className="flex-grow-1">
                                                    <div className="fw-semibold">{card.title}</div>
                                                    <div className="small text-secondary">{card.sub}</div>
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
                            </div>
                        </div>
                        <AIChatSection />
                    </div>
                    <div className="col-xl-7">
                        <div className="card border-0 pt-2">
                            <div className="d-flex justify-content-between pt-2 px-3">
                                <h6 className="fw-semibold">Live Preview</h6>
                                <button type="button" className="btn btn-sm button-primary" onClick={() => navigate("/creatives/preview-export")}>
                                    Continue
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
