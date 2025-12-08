import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Define playlist
const PLAYLIST = [
    { title: "It's going down", file: "https://swatchka-archive.s3.ap-northeast-2.amazonaws.com/bgm1.mp3" },
    { title: "Unwelcome School", file: "https://swatchka-archive.s3.ap-northeast-2.amazonaws.com/bgm2.mp3" },
    { title: "Constant Moderato", file: "https://swatchka-archive.s3.ap-northeast-2.amazonaws.com/bgm3.mp3" }
];

function MusicPlayer() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);

    const audioRef = useRef(null);

    // Play/Pause effect
    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.log("Auto-play blocked", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrackIndex]);

    // Volume effect
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const togglePlayer = () => setIsOpen(!isOpen);

    const playTrack = (index) => {
        if (currentTrackIndex === index) {
            setIsPlaying(!isPlaying);
        } else {
            setCurrentTrackIndex(index);
            setIsPlaying(true);
        }
    };

    const nextTrack = () => {
        let next = (currentTrackIndex + 1) % PLAYLIST.length;
        setCurrentTrackIndex(next);
        setIsPlaying(true);
    };

    const currentTrack = PLAYLIST[currentTrackIndex];

    // Width of the player card
    const PLAYER_WIDTH = 340;

    // Hide player on login/signup pages
    if (location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/') {
        return null;
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '30px',
            left: 0,
            zIndex: 1000,
            transition: 'transform 0.3s ease-in-out', // Removed bounce (cubic-bezier)
            transform: isOpen ? 'translateX(0)' : `translateX(-${PLAYER_WIDTH + 20}px)`, // Completely hidden (extra buffer)
            display: 'flex',
            alignItems: 'flex-end'
        }}>
            {/* Main Player Body */}
            <div className="ba-card" style={{
                width: `${PLAYER_WIDTH}px`,
                height: '92px', // Reduced height
                background: 'rgba(26, 26, 29, 0.95)',
                border: '1px solid var(--ba-cyan)',
                borderLeft: 'none',
                borderRadius: '0 12px 12px 0',
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                backdropFilter: 'blur(10px)',
                boxShadow: '5px 5px 20px rgba(0,0,0,0.5)',
                position: 'relative',
                zIndex: 2,
                justifyContent: 'center'
            }}>
                {/* Track Info & Controls */}
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    {/* CD Animation */}
                    <div style={{
                        width: '56px', // Reduced from 60px
                        height: '56px',
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #000, #333, #000)',
                        border: '1px solid var(--ba-cyan)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: isPlaying ? 'spin 3s linear infinite' : 'none',
                        boxShadow: isPlaying
                            ? '0 0 12px var(--ba-cyan), 0 0 25px rgba(215, 38, 56, 0.4)'
                            : 'none',
                        flexShrink: 0,
                        transition: 'box-shadow 0.5s ease'
                    }}>
                        {/* Inner hole */}
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#1A1A1D', border: '1px solid var(--ba-cyan)' }}></div>
                    </div>
                    <style>{`
            @keyframes spin { 100% { transform: rotate(360deg); } }
          `}</style>

                    <div style={{ overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <div style={{
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            color: 'var(--ba-cyan)',
                            fontFamily: 'var(--ba-font)'
                        }}>
                            {currentTrack.title}
                        </div>

                        {/* Controls Row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => setIsPlaying(!isPlaying)} className="ba-btn" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                                    {isPlaying ? 'PAUSE' : 'PLAY'}
                                </button>
                                <button onClick={nextTrack} className="ba-btn" style={{ padding: '4px 10px', fontSize: '0.75rem', background: '#555' }}>
                                    NEXT
                                </button>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <button
                                    onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}
                                    className="ba-btn"
                                    style={{ padding: '4px 8px', fontSize: '0.75rem', background: isPlaylistOpen ? 'var(--ba-cyan)' : '#333' }}
                                >
                                    LIST
                                </button>
                                <input
                                    type="range"
                                    min="0" max="1" step="0.1"
                                    value={volume}
                                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                                    style={{ width: '50px', accentColor: 'var(--ba-cyan)', height: '4px' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Audio Element */}
                <audio
                    ref={audioRef}
                    src={currentTrack.file}
                    onEnded={nextTrack}
                    loop={false}
                    onError={(e) => console.error("Audio error", e)}
                />

                {/* Sliding Playlist */}
                <div style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: 0,
                    width: '100%',
                    background: 'rgba(26, 26, 29, 0.98)',
                    border: '1px solid var(--ba-cyan)',
                    borderBottom: 'none',
                    borderRadius: '12px 12px 0 0',
                    padding: '0',
                    transition: 'max-height 0.3s ease, opacity 0.3s ease', // Smoother simple easing
                    maxHeight: isPlaylistOpen ? '180px' : '0',
                    opacity: isPlaylistOpen ? 1 : 0,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    pointerEvents: isPlaylistOpen ? 'auto' : 'none'
                }}>
                    {PLAYLIST.map((track, idx) => (
                        <div
                            key={idx}
                            onClick={() => playTrack(idx)}
                            style={{
                                padding: '10px 15px',
                                cursor: 'pointer',
                                background: currentTrackIndex === idx ? 'rgba(215, 38, 56, 0.2)' : 'transparent',
                                color: currentTrackIndex === idx ? 'var(--ba-cyan)' : '#aaa',
                                borderBottom: '1px solid #444',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: '0.85rem'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(215, 38, 56, 0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = currentTrackIndex === idx ? 'rgba(215, 38, 56, 0.2)' : 'transparent'}
                        >
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>{track.title}</span>
                            {currentTrackIndex === idx && <span style={{ fontSize: '0.7rem' }}>▶</span>}
                        </div>
                    ))}
                </div>

            </div>

            {/* Toggle Tab (Visible when closed) */}
            <div
                onClick={togglePlayer}
                style={{
                    width: '40px',
                    height: '50px', // Even shorter to match new body
                    background: 'var(--ba-cyan)',
                    borderRadius: '0 8px 8px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '3px 0 10px rgba(215, 38, 56, 0.4)',
                    position: 'relative',
                    left: '-1px',
                    marginBottom: '20px', // Adjusted alignment
                    fontSize: '1rem',
                    color: 'white'
                }}
            >
                {isOpen ? '◀' : '▶'}
            </div>
        </div>
    );
}

export default MusicPlayer;
