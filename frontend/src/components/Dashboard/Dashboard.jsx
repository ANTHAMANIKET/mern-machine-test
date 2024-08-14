import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate(); 

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('username'); 
        navigate('/');
    };

    return (
        <div className="dashboard-container">
            <nav className={`dashboard-nav ${isMenuOpen ? 'active' : ''}`}>
                <div className="hamburger" onClick={handleMenuToggle}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/create-employee" className="dashboard-link">Create Employee</Link>
                    <Link to="/employee-list" className="dashboard-link">Employee List</Link>
                    <button className="dashboard-logout" onClick={handleLogout}>Logout</button>
                </div>
            </nav>
            <div className="dashboard-welcome">
                <h3>Welcome to the Admin Panel</h3>
            </div>
        </div>
    );
};

export default Dashboard;
