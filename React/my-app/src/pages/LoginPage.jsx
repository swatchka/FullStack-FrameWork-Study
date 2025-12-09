import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        // TODO: Connect to Spring Boot Auth API
        fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        })
            .then(async (res) => {
                if (res.ok) {
                    const data = await res.json();
                    localStorage.setItem("user", JSON.stringify(data));
                    navigate("/gallery");
                } else {
                    alert("Login failed! Check your ID/PW.");
                }
            })
            .catch((err) => {
                console.error(err);
                alert("Connection error!");
            });
    };

    return (
        <div className="neon-screen-frame">
            <div className="ba-card" style={{ padding: '40px', width: '400px', textAlign: 'center' }}>
                <h1 style={{ marginBottom: '30px', color: 'var(--ba-cyan)' }}>Archive Login</h1>
                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '20px' }}>
                        <input
                            type="text"
                            className="ba-input"
                            placeholder="ID"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div style={{ marginBottom: '30px' }}>
                        <input
                            type="password"
                            className="ba-input"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="ba-btn" style={{ width: '100%', padding: '15px' }}>
                        Connect
                    </button>
                </form>
                <div style={{ marginTop: '20px' }}>
                    <Link to="/signup" style={{ color: 'var(--ba-cyan)', textDecoration: 'none' }}>
                        No account? Register
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
