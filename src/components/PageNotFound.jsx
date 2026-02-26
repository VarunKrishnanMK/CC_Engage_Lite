import { useTheme } from "../contexts/ThemeContext";

function NotFoundPage() {
    const { theme } = useTheme();

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100" data-bs-theme={theme}>
            <div className="container text-center">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                        <div className="p-4 p-md-5 border rounded-4 shadow-sm bg-body">
                            <h1 className="display-4 fw-bold mb-3">404</h1>
                            <h2 className="h4 mb-3">Page not found</h2>
                            <p className="text-body-secondary mb-4">
                                The page you are looking for doesn’t exist or has been moved.
                            </p>

                            <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                                <button type="button" className="btn btn-primary" onClick={() => window.history.back()}>Go back</button>
                                <a href="/" className="btn btn-outline-secondary">Go to homepage</a>
                            </div>
                        </div>

                        <p className="mt-3 mb-0 text-body-secondary small">
                            If you believe this is an error, please contact support.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotFoundPage;
