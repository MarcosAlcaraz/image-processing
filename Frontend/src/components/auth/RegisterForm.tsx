import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { registerUser } from '../../services/authService';
import { type RegisterCredentials } from '../../types/credentials';

import FormField from '../common/FormField';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterCredentials>({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // clear field_specific error when user types, It helps in UX
    if (fieldErrors[e.target.name]) {
      setFieldErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsLoading(true);

    // basic Frontend validtaion
    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      setIsLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setIsLoading(false);
      return;
    }

    try {
      const credentialsToSubmit: RegisterCredentials = {
        email: formData.email,
        password: formData.password,
      };
      if (formData.username && formData.username.trim() !== '') {
        credentialsToSubmit.username = formData.username.trim();
      }

      const authResponse = await registerUser(credentialsToSubmit);
      authLogin(authResponse.user, authResponse.token);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Registration failed:', err);
      if (err.errors && Array.isArray(err.errors)) {
        const newFieldErrors: Record<string, string> = {};
        let generalError = '';
        err.errors.forEach((e: any) => {
          if (e.path) {
            newFieldErrors[e.path] = e.msg;
          } else if (e.param) {
             newFieldErrors[e.param] = e.msg;
          }
          else {
            generalError += `${e.msg} `;
          }
        });
        setFieldErrors(newFieldErrors);
        if(generalError.trim()){
            setError(generalError.trim());
        } else if (Object.keys(newFieldErrors).length === 0 && err.errors[0]?.msg) {
            setError(err.errors[0].msg);
        }

      } else if (err.message) {
        setError(err.message);
      } else {
        setError('An unknown error occurred during registration.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
      {error && <p style={{ color: 'red', border: '1px solid red', padding: '10px' }}>{error}</p>}
      <FormField
        label="Username (Optional)"
        type="text"
        name="username"
        value={formData.username || ''}
        onChange={handleChange}
        error={fieldErrors.username}
      />
      <FormField
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={fieldErrors.email}
        required
      />
      <FormField
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={fieldErrors.password}
        required
      />
      <button type="submit" disabled={isLoading} style={{ padding: '10px 15px' }}>
        {isLoading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

export default RegisterForm;