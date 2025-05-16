// import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Removed Link as it's used in Navbar now
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/common/Navbar'; // Import Navbar

function App() {
  return (
    <>
      <Navbar />
      <div style={{ padding: '0 20px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

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
      </div>
    </>
  );
}

export default App;