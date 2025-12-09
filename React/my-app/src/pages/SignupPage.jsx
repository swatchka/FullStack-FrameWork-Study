import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function SignupPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = (e) => {
        e.preventDefault();
        fetch("http://localhost:8080/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        })
            .then((res) => {
                if (res.ok) {
                    alert("Registration complete! Please login.");
                    navigate("/login");
                } else {
                    res.text().then(text => alert("Failed: " + text));
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
                <h1 style={{ marginBottom: '30px', color: 'var(--ba-cyan)' }}>REGISTER</h1>
                <form onSubmit={handleSignup}>
                    <div style={{ marginBottom: '20px' }}>
                        <input
                            type="text"
                            className="ba-input"
                            placeholder="Choose ID"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div style={{ marginBottom: '30px' }}>
                        <input
                            type="password"
                            className="ba-input"
                            placeholder="Choose Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="ba-btn" style={{ width: '100%', padding: '15px' }}>
                        Sign up
                    </button>
                </form>
                <div style={{ marginTop: '20px' }}>
                    <Link to="/login" style={{ color: 'var(--ba-cyan)', textDecoration: 'none' }}>
                        Already have an account? Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;
