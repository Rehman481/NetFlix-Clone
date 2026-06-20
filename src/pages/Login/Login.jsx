import React, { useState } from 'react';
import './Login.css';
import logo from '../../assets/logo.png';
import { signup, login } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import netflix_spinner from '../../assets/netflix_spinner.gif';

const Login = () => {
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!name.trim()) {
          setError('Please enter your name');
          setIsLoading(false);
          return;
        }

        const res = await signup(name, email, password);

        if (!res.success) {
          setError(res.message);
          setIsLoading(false);
          return;
        }

        navigate('/');
      } else {
        const res = await login(email, password,rememberMe);

        if (!res.success) {
          setError(res.message);
          setIsLoading(false);
          return;
        }

        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="login">
      <img src={logo} className="login-logo" alt="Netflix Logo" />

      <div className="login-form">
        <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <button
            type="submit"
            disabled={isLoading}
            className={isLoading ? 'loading' : ''}
          >
            {isLoading
              ? 'Please wait...'
              : isSignUp
              ? 'Sign Up'
              : 'Sign In'}
          </button>

          {/* ADDED NETFLIX SPINNER ONLY */}
          {isLoading && (
            <img
              src={netflix_spinner}
              alt="loading"
              style={{ width: '40px', marginTop: '10px' }}
            />
          )}

          <div className="form-help">
            <label className="remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember Me
            </label>

            <a href="#">Need Help?</a>
          </div>
        </form>

        <div className="divider">OR</div>

        <div className="social-login">
          <button type="button" className="social-btn google">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.36 1.15-1.33 2.12-2.65 2.56l2.05 1.59c1.54-.87 2.83-2.54 2.83-4.56 0-.43-.04-.87-.1-1.28z" />
              <path fill="#34A853" d="M8.98 17c2.37 0 4.36-.78 5.81-2.13l-2.05-1.59c-.7.47-1.6.74-2.56.74-1.97 0-3.64-1.33-4.24-3.12l-2.22 1.72C4.8 14.94 6.77 17 8.98 17z" />
              <path fill="#FBBC05" d="M4.74 11.9c-.14-.44-.22-.91-.22-1.4 0-.49.08-.96.22-1.4l-2.22-1.72C2.13 8.07 1.88 8.98 1.88 8.98s0 1.84.44 2.84l2.42-1.92z" />
              <path fill="#EA4335" d="M8.98 3.58c1.31 0 2.48.45 3.41 1.34l2.56-2.56C13.49.93 11.41 0 8.98 0 6.77 0 4.8 1.8 3.92 4.4l2.22 1.72c.6-1.79 2.27-2.54 2.84-2.54z" />
            </svg>
            Google
          </button>
        </div>

        <div className="form-switch">
          {isSignUp ? (
            <p>
              Already have an account?
              <span onClick={toggleMode}> Sign In Now</span>
            </p>
          ) : (
            <p>
              New to Netflix?
              <span onClick={toggleMode}> Sign Up Now</span>
            </p>
          )}
        </div>

        <div className="captcha-text">
          This page is protected by Google reCAPTCHA to ensure you're not a bot.
          <a href="#"> Learn more.</a>
        </div>
      </div>
    </div>
  );
};

export default Login;