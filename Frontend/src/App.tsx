import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
// You might want a basic Navbar component
// import Navbar from './components/common/Navbar';

function App() {
  return (
    <>
      {/* <Navbar /> You can add a Navbar here */}
      <nav style={{ marginBottom: '20px', padding: '10px', background: '#f0f0f0' }}>
        <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
        <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
        <Link to="/register" style={{ marginRight: '10px' }}>Register</Link>
        <Link to="/dashboard" style={{ marginRight: '10px' }}>Dashboard</Link>
        <Link to="/upload" style={{ marginRight: '10px' }}>Upload Image</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/upload" 
          element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          } 
        />
        {/* Add more routes here */}
      </Routes>
    </>
  );
}

export default App;