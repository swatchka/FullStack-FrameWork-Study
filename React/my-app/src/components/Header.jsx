import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Header() {
    const location = useLocation();
    const navigate = useNavigate();


    // Hide header on login/signup pages if desired, or just hide search bar
    // Let's keep the header but maybe hide search on auth pages?
    // User requested "Search bar in the top center".

    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/';

    if (isAuthPage) return null; // Or render a minimal header? Let's hide it for Gehenna immersion as auth pages are "entry".
    const [searchQuery, setSearchQuery] = useState("");
    const handleSearch = (e) => {
        e.preventDefault();
        // Navigate to Gallery with query param
        navigate(`/gallery?query=${searchQuery}`);
    };

    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 30px',
            background: 'rgba(26, 26, 29, 0.95)',
            borderBottom: '1px solid var(--ba-cyan)',
            backdropFilter: 'blur(10px)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            {/* Logo / Home Link */}
            <Link to="/gallery" style={{ textDecoration: 'none' }}>
                <div style={{
                    fontFamily: 'var(--ba-title-font)',
                    fontSize: '1.5rem',
                    color: 'var(--ba-cyan)',
                    letterSpacing: '2px',
                    textTransform: 'uppercase'
                }}>
                    ARCHIVE
                </div>
            </Link>

            {/* Centered Search Bar */}
            <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '500px', display: 'flex', margin: '0 20px' }}>
                <input
                    type="text"
                    placeholder="Search archives..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="ba-input"
                    style={{
                        borderRadius: '20px 0 0 20px',
                        borderRight: 'none',
                        background: 'rgba(0,0,0,0.5)'
                    }}
                />
                <button type="submit" className="ba-btn" style={{
                    borderRadius: '0 20px 20px 0',
                    padding: '10px 20px',
                    minWidth: 'auto'
                }}>
                    Search
                </button>
            </form>

            {/* Right Side: User Info & Write Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {user && <span style={{ fontWeight: 'bold', color: '#dfe6e9' }}>{user.username}</span>}
                <Link to="/upload">
                    <button className="ba-btn" style={{ fontSize: '0.9rem', padding: '8px 15px' }}>
                        + Write
                    </button>
                </Link>
            </div>
        </header>
    );
}

export default Header;
