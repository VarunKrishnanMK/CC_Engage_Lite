import { useLoader } from "../contexts/LoadingContext"

export default function Loader() {
    const { isLoading } = useLoader();

    if (!isLoading) return null;

    return (
        <div className="bg-body-secondary opacity-75 vh-100 position-fixed top-0 start-0 w-100 d-flex align-items-center justify-content-center z-2">
            <div className="text-primary spinner-grow" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}
