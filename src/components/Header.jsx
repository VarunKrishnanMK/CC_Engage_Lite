import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useThemeStore } from "../stores/themeStore";
import { useUserStore } from "../stores/userStore";

export default function Header() {
    const theme = useThemeStore((state) => state.theme);
    const toggleTheme = useThemeStore((state) => state.toggleTheme);
    const userDetails = useUserStore((state) => state.userDetails);
    const clearUserDetails = useUserStore((state) => state.clearUserDetails);
    const queryClient = useQueryClient();

    const handleLogout = () => {
        clearUserDetails();
        queryClient.clear();
        window.location.href = "/";
    }

    return (
        <div className={`${theme === 'light' ? "headerBg" : "bg-dark"}`}>
            <nav className="navbar navbar-expand-md">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/dashboard">
                        <img className='img-fluid' src='/Logo.svg' alt='Logo' />
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                        <i className="bi bi-list fs-3"></i>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarTogglerDemo02">
                        <ul className="navbar-nav">
                            <li className="nav-item me-3">
                                <form role="search">
                                    <input className="form-control text-danger" type="search" placeholder="Search " aria-label="Search" />
                                </form>
                            </li>
                            <li className="nav-item me-3">
                                <Link to="/creatives/new" className="btn button-primary-outline" ><i className="bi bi-plus"></i> New Creative</Link>
                            </li>
                            <li className="nav-item">
                                <div className="dropdown">
                                    <button className="btn button-primary-outline dropdown rounded-circle fw-bold text-danger" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        {userDetails.shortName || "U"}
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end w-50">
                                        <li><button className="dropdown-item">My Profile</button></li>
                                        <li><button className="dropdown-item" onClick={toggleTheme} aria-label="Toggle theme">Theme : {theme === 'light' ? '🌙' : '☀️'}</button></li>
                                        <li><button className="dropdown-item" onClick={handleLogout}>Log out</button></li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}
