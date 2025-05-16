import React from 'react';
import { Link } from 'react-router-dom'; // a kind of router button, it works

import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Create an Account</h2>
      <RegisterForm />
      <p style={{ marginTop: '20px' }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default RegisterPage;