import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UploadPage() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState(""); // Text content state
    const [file, setFile] = useState(null);

    const handleUpload = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            alert("Please login first!");
            navigate("/login");
            return;
        }

        if (!file) {
            alert("Please select a file!");
            return;
        }

        try {
            // Step 1: Request Presigned URL
            const preRes = await fetch("http://localhost:8080/api/photos/presigned-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    filename: file.name,
                    contentType: file.type
                })
            });

            if (!preRes.ok) throw new Error("Failed to get upload URL");
            const { presignedUrl, fileUrl } = await preRes.json();

            // Step 2: Upload to S3 directly
            const uploadRes = await fetch(presignedUrl, {
                method: "PUT",
                headers: { "Content-Type": file.type },
                body: file
            });

            if (!uploadRes.ok) throw new Error("Failed to upload file to S3");

            // Step 3: Save metadata to Backend
            const saveRes = await fetch("http://localhost:8080/api/photos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title,
                    content: content,
                    userId: user.userId,
                    fileUrl: fileUrl
                })
            });

            if (saveRes.ok) {
                alert("Upload successful!");
                navigate("/gallery");
            } else {
                const text = await saveRes.text();
                alert("Upload failed: " + text);
            }

        } catch (err) {
            console.error(err);
            alert("Error uploading file: " + err.message);
        }
    };

    return (
        <div className="ba-container">
            <div style={{ maxWidth: '600px', margin: '50px auto' }}>
                <h1 style={{ color: 'var(--ba-cyan)', marginBottom: '30px', textAlign: 'center' }}>Upload Photo</h1>
                <div className="ba-card" style={{ padding: '30px' }}>
                    <form onSubmit={handleUpload}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Title</label>
                            <input
                                type="text"
                                className="ba-input"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Description</label>
                            <textarea
                                className="ba-input"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows="5"
                                style={{ resize: 'vertical' }}
                                placeholder="Write something about this photo..."
                            />
                        </div>
                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Photo File</label>
                            <input
                                type="file"
                                className="ba-input"
                                onChange={(e) => setFile(e.target.files[0])}
                                accept="image/*"
                                required
                            />
                        </div>
                        <button type="submit" className="ba-btn" style={{ width: '100%', padding: '15px' }}>
                            Upload to Archive
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UploadPage;
