import { useCallback, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useLoadingStore } from "../stores/loadingStore";
import { useThemeStore } from "../stores/themeStore";


export default function AIChatSection() {
    const [prompt, setPrompt] = useState("");
    const isLoading = useLoadingStore((state) => state.isLoading);
    const theme = useThemeStore((state) => state.theme);
    const [listening, setListening] = useState(false);
    const recognitionRef = useRef(null);

    const startRecording = useCallback(() => {
        try {
            recognitionRef.current?.start();
        } catch { /* ignore */ }
    }, []);

    const stopRecording = useCallback(() => {
        try {
            recognitionRef.current?.stop();
        } catch { /* ignore */ }
    }, []);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.onstart = () => setListening(true);
        recognition.onend = () => setListening(false);
        recognition.onerror = () => setListening(false);
        recognition.onresult = (event) => {
            const transcript = event.results?.[0]?.[0]?.transcript;
            if (transcript) {
                setPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
            }
        };
        recognitionRef.current = recognition;
        return () => {
            try {
                recognition.stop();
            } catch { /* noop */ }
            recognitionRef.current = null;
        };
    }, []);

    return (
        <div className="card border-0 ai-chat-assistance shadow-sm">
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

            </div>
            <div className="card-footer">
                <form className="w-100 ">
                    <TextareaAutosize className="form-control border border-bottom-0 rounded-top" id="promptField" data-bs-theme={theme} minRows={1} maxRows={3} placeholder="Type your prompt..." value={prompt} onChange={(e) => setPrompt(e.target.value)} disabled={isLoading} />
                    <div className={`w-100 border border-top-0 rounded-bottom ${theme === 'dark' ? "bg-dark" : "bg-white"}`}>
                        <div className="align-self-end text-end">
                            <button className="btn border-0" type="button" onClick={startRecording} aria-pressed={listening}>
                                {listening ? (<><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden />Listening...</>) : (<i className="bi bi-mic-fill" aria-hidden />)}
                            </button>
                            {listening && (
                                <button className="btn border-0" type="button" onClick={stopRecording} disabled={!listening}>
                                    <i className="bi bi-stop-circle-fill" />
                                </button>
                            )}
                            <button type="submit" className="btn border-0" disabled={isLoading || !prompt.trim()} aria-disabled={isLoading || !prompt.trim()}>
                                {isLoading ? (<span className="spinner-border spinner-border-sm me-2" role="status" />) : (<b><i className="bi bi-send-fill text-danger" /></b>)}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

    )
}
