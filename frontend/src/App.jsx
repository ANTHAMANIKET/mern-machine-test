import React from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Signup from './Signup/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import EmployeeList from './components/EmployeeList/EmployeeList';
import CreateEmployee from './components/CreateEmployee/CreateEmployee';
import EditEmployee from './components/EditEmployee/EditEmployee';
import './App.css';

const App = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const username = localStorage.getItem('username');
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const onLogin = (username, password) => {
        localStorage.setItem('username', username);
        navigate('/dashboard');
    };

    const onSignup = (username, password) => {
        localStorage.setItem('signupData', JSON.stringify({ username, password }));
        navigate('/');
    };

    const onLogout = () => {
        localStorage.removeItem('username');
        navigate('/');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Determine whether to show the navigation bar based on the current path
    const shouldShowNavigation = location.pathname !== '/dashboard';

    return (
        <>
            {shouldShowNavigation && (
                <nav>
                    <div className="nav-brand">MyApp</div>
                    <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <ul className={isMenuOpen ? 'show' : ''}>
                        {!username && (
                            <li>
                                <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
                            </li>
                        )}
                        {username && (
                            <>
                                <li>
                                    <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link>
                                </li>
                                <li>
                                    <Link to="/create-employee" className={location.pathname === '/create-employee' ? 'active' : ''}>Create Employee</Link>
                                </li>
                                <li>
                                    <Link to="/employee-list" className={location.pathname === '/employee-list' ? 'active' : ''}>Employee List</Link>
                                </li>
                                <li>
                                    <button onClick={onLogout} className="logout-btn">Logout</button>
                                </li>
                            </>
                        )}
                        {!username && (
                            <li>
                                <Link to="/signup" className={location.pathname === '/signup' ? 'active' : ''}>Sign Up</Link>
                            </li>
                        )}
                    </ul>
                </nav>
            )}
            <Routes>
                <Route path="/" element={<Login onLogin={onLogin} />} />
                <Route path="/signup" element={<Signup onSignup={onSignup} />} />
                {username && (
                    <>
                        <Route path="/dashboard" element={<Dashboard username={username} />} />
                        <Route path="/create-employee" element={<CreateEmployee />} />
                        <Route path="/employee-list" element={<EmployeeList />} />
                        <Route path="/edit-employee/:id" element={<EditEmployee />} />
                    </>
                )}
            </Routes>
        </>
    );
};

export default App;
