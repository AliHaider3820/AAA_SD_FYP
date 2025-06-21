import React, { useState, useContext } from 'react';
import { AuthContext } from '../App';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',  
    password: ''
  });
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        setFormData({ email: '', password: '' });
        setError('');
        window.location.href = '/';
      } else {
        setError('Invalid email or password');
        setFormData(prev => ({ ...prev, password: '' }));
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    }
  };

  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
        <p className="signup-link">
          Don't have an account? <Link className='nav-link' to="/signup" >Sign Up</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;