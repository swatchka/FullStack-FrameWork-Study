import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function FloatingWriteButton() {
    const navigate = useNavigate();
    const location = useLocation();

    // Check auth
    const user = JSON.parse(localStorage.getItem("user"));
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/';

    if (!user || isAuthPage) return null;

    return (
        <button
            onClick={() => navigate('/upload')}
            style={{
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'var(--ba-cyan)',
                color: 'var(--ba-bg)',
                border: 'none',
                boxShadow: '0 4px 15px rgba(215, 38, 56, 0.6)',
                fontSize: '2rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                zIndex: 1000,
                transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
            +
        </button>
    );
}

export default FloatingWriteButton;
