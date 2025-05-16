import React from 'react';
import { Link } from 'react-router-dom';

import LoginForm from '../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Login to Your Account</h2>
      <LoginForm />
      <p style={{ marginTop: '20px' }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default LoginPage;