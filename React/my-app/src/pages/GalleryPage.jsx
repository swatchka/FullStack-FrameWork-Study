import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function GalleryPage() {
    const [photos, setPhotos] = useState([]);
    const [user, setUser] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate("/login");
        }

        // Parse query param
        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get('query');

        fetchPhotos(query);
    }, [navigate, location.search]);

    const fetchPhotos = (query) => {
        const url = query
            ? `http://localhost:8080/api/photos?query=${encodeURIComponent(query)}`
            : "http://localhost:8080/api/photos";

        fetch(url)
            .then(res => res.json())
            .then(data => setPhotos(data))
            .catch(err => console.error("Error fetching photos", err));
    };

    return (
        <div className="ba-container">
            {/* Header removed (moved to global Header.jsx) */}

            <div className="ba-card" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--ba-dark)' }}>
                    <thead style={{ background: 'var(--ba-grey)', color: 'white' }}>
                        <tr>
                            <th style={{ padding: '15px', textAlign: 'center', width: '80px' }}>No</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Title</th>
                            <th style={{ padding: '15px', textAlign: 'center', width: '150px' }}>Author</th>
                            <th style={{ padding: '15px', textAlign: 'center', width: '80px' }}>Likes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {photos.map((photo, index) => (
                            <tr key={photo.id} style={{ borderBottom: '1px solid var(--ba-grey)' }}>
                                <td style={{ padding: '15px', textAlign: 'center' }}>{photos.length - index}</td>
                                <td style={{ padding: '15px' }}>
                                    <Link
                                        to={`/photo/${photo.id}`}
                                        style={{ color: 'var(--ba-dark)', textDecoration: 'none', fontWeight: 'bold', display: 'block' }}
                                    >
                                        {photo.title}
                                    </Link>
                                </td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>{photo.author ? photo.author.username : 'Unknown'}</td>
                                <td style={{ padding: '15px', textAlign: 'center', color: 'var(--ba-cyan)' }}>{photo.likeCount}</td>
                            </tr>
                        ))}
                        {photos.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ padding: '50px', textAlign: 'center', color: '#B2BEC3' }}>
                                    No posts yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default GalleryPage;
