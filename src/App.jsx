import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./app/auth/Login"
import Dashboard from "./app/dashboard/Dashboard"
import NewCreative from "./app/creatives/NewCreative"
import SelectVariations from "./app/selectVariations/SelectVariations"
import PreviewExport from "./app/previewExport/PreviewExport"
import CampaignSuccess from "./app/success/CampaignSuccess"
import NotFound from "./components/PageNotFound"
import { Suspense, useEffect } from "react"
import { Toaster } from "react-hot-toast"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { configureApiService } from "./app/api/apiService"
import Loader from "./components/Loader"
import { useLoadingStore } from "./stores/loadingStore"
import { useThemeStore } from "./stores/themeStore"

function AppInitializer() {
    const showLoading = useLoadingStore((state) => state.showLoading)
    const hideLoading = useLoadingStore((state) => state.hideLoading)
    const hydrated = useThemeStore((state) => state.hydrated)

    useEffect(() => {
        configureApiService({
            onStartLoading: showLoading,
            onStopLoading: hideLoading,
        })
    }, [showLoading, hideLoading])

    if (!hydrated) {
        return <div style={{ visibility: "hidden" }} />
    }

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/creatives/new" element={<NewCreative />} />
                    <Route path="/creatives/select-variations" element={<SelectVariations />} />
                    <Route path="/creatives/preview-export" element={<PreviewExport />} />
                    <Route path="/creatives/success" element={<CampaignSuccess />} />
                    <Route path="/*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
            <Toaster position="top-right" reverseOrder={false} toastOptions={{ duration: 5000, removeDelay: 2000 }} />
            <Loader />
        </>
    )
}

function App() {
    const OAuthClientId = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID;

    return (
        <GoogleOAuthProvider clientId={OAuthClientId}>
            <Suspense fallback={null}>
                <AppInitializer />
            </Suspense>
        </GoogleOAuthProvider>
    )
}

export default App
