import React, { useState } from 'react';
import PropTypes from 'prop-types';

const LoginForm = ({ onSubmit, isLoading, error }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        <label htmlFor="email">Institutional Email</label>
        <input 
          id="email"
          type="email" 
          name="email" 
          className="login-input" 
          placeholder="user@mips.edu" 
          value={formData.email} 
          onChange={handleChange} 
          required 
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input 
          id="password"
          type="password" 
          name="password" 
          className="login-input" 
          placeholder="••••••••" 
          value={formData.password} 
          onChange={handleChange} 
          required 
          disabled={isLoading}
        />
      </div>

      {error && <div className="status-msg error">{error}</div>}

      <button className="primary-btn login-btn" disabled={isLoading}>
        {isLoading ? 'Authenticating...' : 'Sign In'}
      </button>
    </form>
  );
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
};

export default LoginForm;