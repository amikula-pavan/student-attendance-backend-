import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', marginBottom: '2rem' }}>
      {user ? (
        <>
          <Link to="/students" style={{ marginRight: '1rem' }}>Students</Link>
          <Link to="/attendance" style={{ marginRight: '1rem' }}>Attendance</Link>
          <Link to="/reports" style={{ marginRight: '1rem' }}>Reports</Link>
          <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}

export default Navbar; 