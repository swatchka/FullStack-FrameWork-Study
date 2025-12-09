# React Project Structure Guide

This document explains the role of key files in the project and how styling is handled.

## 1. Project Structure

### Entry Point (Starting Line)
*   **`src/main.jsx`**: The very first file executed. It takes `App.jsx` and renders it into the HTML (`index.html`).

### Core Structure (Skeleton & Routing)
*   **`src/App.jsx`**: Defines the overall layout and navigation.
    *   **Router**: Decides which page to show based on the URL (e.g., `/gallery` -> `<GalleryPage />`).
    *   **Common Elements**: Includes components that appear on every page, like `<Header />`, `<MusicPlayer />`, and `<FloatingWriteButton />`.
*   **`src/index.css`**: The global stylesheet. Defines the "Gehenna" theme variables (colors, fonts) and common utility classes (like `.ba-btn`, `.ba-card`).

### Pages (Screens)
Files in `src/pages/` represent full-screen views.
*   **`LoginPage.jsx`**: Handles user login and token storage.
*   **`SignupPage.jsx`**: Handles new user registration.
*   **`GalleryPage.jsx`**: Main feed displaying the grid of photos.
*   **`UploadPage.jsx`**: Form for creating new posts (uploading images).
*   **`PhotoDetailPage.jsx`**: Displays a single photo in detail, with Edit/Delete/Like features.

### Components (Building Blocks)
Files in `src/components/` are reusable parts.
*   **`Header.jsx`**: The top navigation bar containing the logo, search, and user actions (Logout).
*   **`FloatingWriteButton.jsx`**: The static (+) button for quick uploads.
*   **`MusicPlayer.jsx`**: The persistent background music player.

---

## 2. Styling (CSS) Explained

You will notice two different ways of applying styles in the code:

### 1. Global CSS (The "Standard" Way)
*   **What**: Using `className="ba-btn"` or `className="ba-card"`.
*   **Where**: Defined in **`src/index.css`**.
*   **Why**: Used for consistent theming across the entire app. If you change `.ba-btn` in `index.css`, every button in the app updates instantly.

### 2. Inline CSS (The "Ad-Hoc" Way)
*   **What**: Using `style={{ color: 'red', marginTop: '20px' }}` inside the JSX.
*   **Where**: Written directly inside the component file (e.g., `PhotoDetailPage.jsx`).
*   **Why**: Used for specific, one-time adjustments (like exact padding or positioning) that don't need a reusable class name. It's quick and keeps the style explicitly close to the element.
