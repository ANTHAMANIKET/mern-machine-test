import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = ({ onSignup }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        if (username && password) {
            onSignup(username, password);
            navigate('/'); // Redirect to home page after successful signup
        } else {
            alert('Please complete all fields.');
        }
    };

    return (
        <div className="login-container">
            <h2>Sign Up</h2>
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
                <div className="input-group">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input 
                        type="password" 
                        id="confirmPassword" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                    />
                </div>
                <button type="submit" className="login-btn">Sign Up</button>
            </form>
            <a href="#" className="signup-link" onClick={() => navigate('/')}>Already have an account? Login here</a>
        </div>
    );
};

export default Signup;
