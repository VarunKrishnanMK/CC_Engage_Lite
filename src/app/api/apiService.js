import axios from "axios"
import toast from "react-hot-toast"

const apiService = axios.create({
    baseURL: "https://dummyjson.com",
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

export default apiService
