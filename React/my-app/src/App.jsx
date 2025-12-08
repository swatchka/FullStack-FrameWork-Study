import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import GalleryPage from './pages/GalleryPage';
import UploadPage from './pages/UploadPage';
import PhotoDetailPage from './pages/PhotoDetailPage';
import MusicPlayer from './components/MusicPlayer';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/photo/:id" element={<PhotoDetailPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
        <MusicPlayer />
      </div>
    </Router>
  );
}

export default App;