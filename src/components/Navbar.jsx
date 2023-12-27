import { Link, useNavigate, useLocation } from "react-router-dom"; 
import { useState, useEffect } from "react";
import showToast from "./showToast";
import axios from "axios";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [theme, setTheme] = useState(
        localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
    );

    const handleToggle = (e) => {
        if (e.target.checked) setTheme("dark");
        else setTheme("light");
    };

    const handleLogout = async () => {
        try {
            axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
                token: localStorage.getItem('refreshToken'),
            });
            
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            navigate('/login');
        } catch (error) {
            console.error('Error during logout:', error);
            showToast('err', 'Error during logout.');
        }
    };
  
    useEffect(() => {
        localStorage.setItem("theme", theme);
        const localTheme = localStorage.getItem("theme");
        document.querySelector("html").setAttribute("data-theme", localTheme);
    }, [theme]);

    // Function to check if a given path is active
    const isPathActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="navbar bg-base-100 shadow-md fixed z-50 w-full top-0">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><Link to="/song/user" className={isPathActive('/song/user') ? 'active' : ''}>Your Songs</Link></li>
                        <li><Link to="/song/search" className={isPathActive('/song/search') ? 'active' : ''}>Search Song</Link></li>
                        <li><Link to="/song/add" className={isPathActive('/song/add') ? 'active' : ''}>Add Song</Link></li>
                        <li>
                            <details>
                                <summary>Ratings</summary>
                                <ul className="p-2">
                                    <li><Link to="/rating/song" className={isPathActive('/rating/song') ? 'active' : ''}>Your Song Ratings</Link></li>
                                    <li><Link to="/rating/performer" className={isPathActive('/rating/performer') ? 'active' : ''}>Your Performer Ratings</Link></li>
                                    <li><Link to="/rating/performer/export" className={isPathActive('/rating/performer/export') ? 'active' : ''}>Export Performer Ratings</Link></li>
                                </ul>
                            </details>
                        </li>
                        <li><Link to="/song/import" className={isPathActive('/song/import') ? 'active' : ''}>Import Songs</Link></li>
                        <li><a>Friends</a></li>
                        <li><Link to="/analysis" className={isPathActive('/analysis') ? 'active' : ''}>Analysis</Link></li>
                    </ul>
                </div>
                <button className="btn btn-ghost text-xl">
                    <Link to="/">HarmoniFuse</Link>
                </button>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><Link to="/song/user" className={isPathActive('/song/user') ? 'active' : ''}>Your Songs</Link></li>
                    <li><Link to="/song/search" className={isPathActive('/song/search') ? 'active' : ''}>Search Song</Link></li>
                    <li><Link to="/song/add" className={isPathActive('/song/add') ? 'active' : ''}>Add Song</Link></li>
                    <li>
                        <details>
                            <summary>Ratings</summary>
                            <ul className="p-2">
                                <li><Link to="/rating/song" className={isPathActive('/rating/song') ? 'active' : ''}>Your Song Ratings</Link></li>
                                <li><Link to="/rating/performer" className={isPathActive('/rating/performer') ? 'active' : ''}>Your Performer Ratings</Link></li>
                                <li><Link to="/rating/performer/export" className={isPathActive('/rating/performer/export') ? 'active' : ''}>Export Performer Ratings</Link></li>
                            </ul>
                        </details>
                    </li>
                    <li><Link to="/song/import" className={isPathActive('/song/import') ? 'active' : ''}>Import Songs</Link></li>
                    <li><a>Friends</a></li>
                    <li><Link to="/analysis" className={isPathActive('/analysis') ? 'active' : ''}>Analysis</Link></li>
                </ul>
            </div>
            <div className="navbar-end">
                <button className="btn btn-ghost">
                    <label className="swap swap-rotate">
                        <input
                            type="checkbox"
                            onChange={handleToggle}
                            checked={theme === "light" ? false : true}
                        />
                        <svg className="swap-off fill-current h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>
                        <svg className="swap-on fill-current h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/></svg>
                    </label>
                </button>
                <div className="ml-4">
                    <button 
                        className="btn btn-error"
                        onClick={handleLogout}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512">
                            <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
};

export default Navbar;
