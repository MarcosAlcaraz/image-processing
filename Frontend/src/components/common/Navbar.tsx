import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <nav style={navStyle}>
        <div style={navBrandStyle}>ImageApp</div>
        <div>Loading...</div>
      </nav>
    );
  }

  return (
    <nav style={navStyle}>
      <Link to="/" style={navBrandStyle}>
        ImageApp
      </Link>
      <div style={navLinksStyle}>
        <Link to="/" style={linkStyle}>
          Home
        </Link>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" style={linkStyle}>
              Dashboard
            </Link>
            <Link to="/upload" style={linkStyle}>
              Upload Image
            </Link>
            <span style={userInfoStyle}>
              Hello, {user?.username || user?.email}
            </span>
            <button onClick={handleLogout} style={buttonStyle}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>
              Login
            </Link>
            <Link to="/register" style={linkStyle}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

// Basic inline styles (consider moving to a CSS file for larger apps)
const navStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
  backgroundColor: '#333',
  color: 'white',
  marginBottom: '20px',
};

const navBrandStyle: React.CSSProperties = {
  fontSize: '1.5em',
  color: 'white',
  textDecoration: 'none',
};

const navLinksStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};

const linkStyle: React.CSSProperties = {
  color: 'white',
  textDecoration: 'none',
  marginLeft: '15px',
};

const userInfoStyle: React.CSSProperties = {
  marginLeft: '15px',
  fontStyle: 'italic',
};

const buttonStyle: React.CSSProperties = {
  marginLeft: '15px',
  padding: '8px 12px',
  backgroundColor: '#555',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  borderRadius: '4px',
};

export default Navbar;