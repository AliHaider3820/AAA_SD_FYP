import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../App';
import './Login.css';

const ServiceProviderLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

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
      // Attempt to login as a service provider
      const success = await login(formData.email, formData.password, true);
      
      if (success) {
        // Check if the logged-in user is a service provider
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (currentUser.isServiceProvider) {
          navigate('/business-profile');
        } else {
          // If not a service provider, show error and log them out
          setError('Please use the client login or register as a service provider.');
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
        <h2>Service Provider Login</h2>
        
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
          Login as Service Provider
        </button>
        
        <p className="signup-link">
          Don't have a business account? <Link to="/ServiceProviderSignup" className="nav-link">Register Here</Link>
        </p>
        
        <p className="switch-login">
          <Link to="/login" className="nav-link">Login as Client</Link>
        </p>
      </form>
    </div>
  );
};

export default ServiceProviderLogin;
