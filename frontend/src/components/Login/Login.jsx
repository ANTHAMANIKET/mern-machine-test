import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Perform validation here
        const storedUser = JSON.parse(localStorage.getItem('signupData'));
        if (storedUser && storedUser.username === username && storedUser.password === password) {
            onLogin(username, password);
        } else {
            alert('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="username">UserName:</label>
                    <input 
                        type="text" 
                        id="username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password:</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                <button type="submit" className="login-btn">Login</button>
            </form>
            <a href="#" className="signup-link" onClick={() => navigate('/signup')}>Don't have an account? Sign up here</a>
        </div>
    );
};

export default Login;
