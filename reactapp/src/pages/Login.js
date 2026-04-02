import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const nav = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    const cached = localStorage.getItem('rememberedCredentials');
    if (cached) {
      const { username, password } = JSON.parse(cached);
      setUsername(username);
      setPassword(password);
      setRemember(true);
    }
  }, []);

  const redirectToDashboard = (role) => {
    if (role === 'ADMIN') nav('/admin');
    else if (role === 'DOCTOR') nav('/doctor');
    else if (role === 'PATIENT') nav('/patient');
    else nav('/');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username.trim(), password);
      // user is set after login, so get from localStorage
      const storedUser = JSON.parse(localStorage.getItem('user'));
      redirectToDashboard(storedUser?.role);
    } catch (e) {
      setErr('Invalid credentials');
    }
  };
  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <h2 style={{ color: '#009688' }}>Login</h2>
      {err && <div style={{ color: 'crimson', marginBottom: 8 }}>{err}</div>}
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }} autoComplete="on">
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          autoComplete="username"
          name="username"
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          name="password"
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            checked={remember}
            onChange={e => setRemember(e.target.checked)}
          />
          Remember me
        </label>
        <button type="submit">Login</button>
      </form>
      <div style={{ marginTop: 12 }}>
        New user? <Link to="/register">Register</Link>
      </div>
    </div>
  );
}
