import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../App';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSubmitting && !error) {
      navigate('/');
    }
  }, [isSubmitting, error, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(formData.username, formData.password);
    
    if (success) {
      setFormData({ username: '', password: '' });
      setError('');
      setIsSubmitting(true);
    } else {
      setError('Invalid credentials');
      setFormData(prev => ({ ...prev, password: '' }));
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
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
        <button type="submit" className="login-button">Login</button>
        <p className="signup-link">
          Don't have an account? <Link to="/Signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;