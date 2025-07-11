import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../App';
import './Login.css';

function ClientLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated } = useContext(AuthContext);

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/');
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Attempt to login as a client (not a service provider)
      const success = await login(formData.email, formData.password, false);
      
      if (success) {
        // Check if the logged-in user is not a service provider
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (!currentUser.isServiceProvider) {
          // Check for redirect URL in query params
          const searchParams = new URLSearchParams(window.location.search);
          const redirectTo = searchParams.get('redirect') || '/';
          navigate(redirectTo);
        } else {
          // If it's a service provider, show error and log them out
          setError('Please use the service provider login.');
          localStorage.removeItem('currentUser');
          window.location.reload();
        }
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Client Login</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Enter your email"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Enter your password"
            minLength="6"
          />
        </div>
        
        <button type="submit" className="login-button">
          Login as Client
        </button>
        
        <p className="signup-link">
          Don't have an account? <Link to="/signup" className="nav-link">Sign Up</Link>
        </p>
        
        <p className="switch-login">
          <Link to="/service-provider-login" className="nav-link">Login as Service Provider</Link>
        </p>
      </form>
    </div>
  );
}

export default ClientLogin;