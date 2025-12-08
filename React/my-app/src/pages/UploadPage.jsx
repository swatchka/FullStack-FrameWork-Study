import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UploadPage() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState(""); // Text content state
    const [file, setFile] = useState(null);

    const handleUpload = (e) => {
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

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("content", content); // Append content
        formData.append("userId", user.userId);

        fetch("http://localhost:8080/api/photos", {
            method: "POST",
            body: formData,
        })
            .then((res) => {
                if (res.ok) {
                    alert("Upload successful!");
                    navigate("/gallery");
                } else {
                    res.text().then(text => alert("Upload failed: " + text));
                }
            })
            .catch((err) => {
                console.error(err);
                alert("Error uploading file.");
            });
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
