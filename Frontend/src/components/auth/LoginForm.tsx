import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { loginUser } from '../../services/authService';

import { type LoginCredentials } from '../../types/credentials';

import FormField from '../common/FormField';

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      setIsLoading(false);
      return;
    }

    try {
      const authResponse = await loginUser(formData);
      authLogin(authResponse.user, authResponse.token);
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Login failed:', err);
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
        setError('An unknown error occurred during login.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
      {error && <p style={{ color: 'red', border: '1px solid red', padding: '10px' }}>{error}</p>}
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
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;