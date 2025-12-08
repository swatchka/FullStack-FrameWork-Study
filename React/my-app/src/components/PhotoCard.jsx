import React from 'react';

function PhotoCard({ photo, onLike }) {
    const imageUrl = `http://localhost:8080/uploads/${photo.fileName}`;

    return (
        <div className="ba-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '200px', overflow: 'hidden', backgroundColor: '#eee' }}>
                <img
                    src={imageUrl}
                    alt={photo.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                />
            </div>
            <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{photo.title}</h3>
                <p style={{ color: '#636e72', fontSize: '0.9rem', marginBottom: '15px' }}>
                    by {photo.author ? photo.author.username : 'Unknown'}
                </p>

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', color: 'var(--ba-cyan)' }}>
                        ♥ {photo.likeCount}
                    </span>
                    <button
                        className="ba-btn"
                        style={{ padding: '5px 15px', fontSize: '0.9rem' }}
                        onClick={() => onLike(photo.id)}
                    >
                        Like
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PhotoCard;
