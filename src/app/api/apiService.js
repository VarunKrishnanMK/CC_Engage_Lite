import axios from "axios"
import toast from "react-hot-toast"

const apiService = axios.create({
    baseURL: "http://localhost:8001/api",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 20000,
})

let activeRequestCount = 0
let showLoader = () => { }
let hideLoader = () => { }
let interceptorsInitialized = false

const getErrorMessage = (error) => {
    const responseMessage = error?.response?.data?.message
    if (typeof responseMessage === "string" && responseMessage.trim()) {
        return responseMessage
    }

    if (error?.code === "ECONNABORTED") {
        return "Request timed out. Please try again."
    }

    if (error?.message && typeof error.message === "string") {
        return error.message
    }

    return "Something went wrong. Please try again."
}

const startLoading = () => {
    activeRequestCount += 1
    if (activeRequestCount === 1) {
        showLoader()
    }
}

const stopLoading = () => {
    activeRequestCount = Math.max(0, activeRequestCount - 1)
    if (activeRequestCount === 0) {
        hideLoader()
    }
}

export const configureApiService = ({ onStartLoading, onStopLoading } = {}) => {
    showLoader = typeof onStartLoading === "function" ? onStartLoading : () => { }
    hideLoader = typeof onStopLoading === "function" ? onStopLoading : () => { }

    if (interceptorsInitialized) {
        return
    }

    apiService.interceptors.request.use(
        (config) => {
            startLoading()
            return config
        },
        (error) => {
            stopLoading()
            return Promise.reject(error)
        }
    )

    apiService.interceptors.response.use(
        (response) => {
            stopLoading()
            return response
        },
        (error) => {
            stopLoading()
            const normalizedMessage = getErrorMessage(error)
            error.normalizedMessage = normalizedMessage
            toast.error(normalizedMessage)
            return Promise.reject(error)
        }
    )

    interceptorsInitialized = true
}

export const loginUser = async ({ username, password, expiresInMins = 30 }) => {
    const response = await apiService.post("/auth/login", {
        username,
        password,
        expiresInMins,
    })
    return response.data
}

export const fetchGoogleUserProfile = async (accessToken) => {
    const response = await apiService.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })

    return response.data
}

export const uploadBriefFile = async ({ file, channel = "email", category = "normal", campaignName = "SSY 2025" }) => {
    const payload = new FormData()
    payload.append("file", file)
    payload.append("channel", channel)
    payload.append("category", category)
    payload.append("initiated_by", "human_upload")
    payload.append("mock", false)
    payload.append("campaign_name", campaignName)
    const response = await apiService.post("/activity1/briefs/upload", payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    return response.data
}

export const getBriefStatus = async (id) => {
    const response = await apiService.get(`/activity1/briefs/${id}/status`, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    return response.data
}

export const getBrief = async (id) => {
    const response = await apiService.get(`/activity1/briefs/${id}`, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    return response.data
}

export const updateBrief = async (id, payload = {}) => {
    const response = await apiService.put(`/activity1/briefs/${id}`, payload)
    return response.data
}

export const confirmBrief = async (id, payload = {}) => {
    const response = await apiService.post(`/activity1/briefs/${id}/confirm`, payload)
    return response.data
}


export default apiService
