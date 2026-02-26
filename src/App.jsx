import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./app/auth/Login"
import Dashboard from "./app/dashboard/Dashboard"
import NewCreative from "./app/creatives/NewCreative"
import BriefAnalysis from "./app/briefAnalysis/BriefAnalysis"
import SelectVariations from "./app/selectVariations/SelectVariations"
import PreviewExport from "./app/previewExport/PreviewExport"
import CampaignSuccess from "./app/success/CampaignSuccess"
import NotFound from "./components/PageNotFound"
import { Suspense, useEffect } from "react"
import { ThemeProvider } from "./contexts/ThemeContext"
import { Toaster } from "react-hot-toast"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { UserDetailsProvider } from "./contexts/UserContext"
import { LoadingProvider, useLoader } from "./contexts/LoadingContext"
import { configureApiService } from "./app/api/apiService"

function AppInitializer() {
    const { showLoading, hideLoading } = useLoader()

    useEffect(() => {
        configureApiService({
            onStartLoading: showLoading,
            onStopLoading: hideLoading,
        })
    }, [showLoading, hideLoading])

    return null
}

function App() {
    const OAuthClientId = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID;

    return (
        <GoogleOAuthProvider clientId={OAuthClientId}>
            <LoadingProvider>
                <AppInitializer />
                <Suspense fallback={null}>
                    <UserDetailsProvider>
                        <ThemeProvider>
                            <BrowserRouter>
                                <Routes>
                                    <Route path="/" element={<Login />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/creatives/new" element={<NewCreative />} />
                                    <Route path="/creatives/brief-analysis" element={<BriefAnalysis />} />
                                    <Route path="/creatives/select-variations" element={<SelectVariations />} />
                                    <Route path="/creatives/preview-export" element={<PreviewExport />} />
                                    <Route path="/creatives/success" element={<CampaignSuccess />} />
                                    <Route path="/*" element={<NotFound />} />
                                </Routes>
                            </BrowserRouter>
                            <Toaster position="top-right" reverseOrder={false} />
                        </ThemeProvider>
                    </UserDetailsProvider>
                </Suspense>
            </LoadingProvider>
        </GoogleOAuthProvider>
    )
}

export default App
