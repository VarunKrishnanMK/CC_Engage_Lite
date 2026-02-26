import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useUserContext } from "../contexts/UserContext";

export default function Header() {
    const { theme, toggleTheme } = useTheme();
    const { userDetails } = useUserContext();

    const handleLogout = () => {
        localStorage.clear();
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
                                    <input className="form-control" type="search" placeholder="Search " aria-label="Search" />
                                </form>
                            </li>
                            <li className="nav-item me-3">
                                <Link to="/creatives/new" className="btn button-primary-outline" ><i className="bi bi-plus"></i> New Creative</Link>
                            </li>
                            <li className="nav-item">
                                <div className="dropdown">
                                    <button className="btn btn-light dropdown rounded-circle fw-bold" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        {userDetails.shortName}
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
