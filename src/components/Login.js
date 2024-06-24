import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api';
import './Login.css';
import walletIcon from './images/logo.png'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      const data = await loginUser({ email, password });
      if (data.token) { // Verifica que haya un token en la respuesta
        localStorage.setItem('token', data.token);
        navigate('/'); // Navega a la página principal
      } else {
        setError('Invalid email or password'); // Muestra un error si no hay token
      }
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <img src={walletIcon} alt="Flow Logo" className="logo"/>
        <h2>Sign in to your account</h2>
        {error && <p className="error-message">{error}</p>}
        <label htmlFor="email">Your email</label>
        <input
          type="email"
          id="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        <div className="options">
          <label className="remember-me">
            <input type="checkbox" />
            Remember me
          </label>
          <a href="/forgot-password">Forgot password?</a>
        </div>
        <button type="submit" className="submit-button">Sign in</button>
        <p>
          Don’t have an account yet? <Link to="/register">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
