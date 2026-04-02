import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell.js';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const goHome = () => {
    if (!user) return; // Do nothing if not logged in
    if (user.role === 'DOCTOR') navigate('/doctor');
    else if (user.role === 'PATIENT') navigate('/patient');
    else if (user.role === 'ADMIN') navigate('/admin');
  };

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 24px',
      backgroundColor: '#E0F2F1',
      borderBottom: '1px solid #ccc'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img
          src="/logo.png"
          alt="HealthCare Logo"
          style={{ height: 40, borderRadius: 4 }}
        />
        <button
          onClick={goHome}
          style={{
            background: 'none',
            border: 'none',
            color: '#009688',
            fontWeight: 'bold',
            fontSize: '18px',
            cursor: 'pointer'
          }}
        >
          HealthCare System
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {!user ? (
          <>
            <Link to="/login">
              <button style={{
                backgroundColor: '#009688',
                color: 'white',
                padding: '8px 16px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer'
              }}>
                Login
              </button>
            </Link>
            <Link to="/register">
              <button style={{
                backgroundColor: '#009688',
                color: 'white',
                padding: '8px 16px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer'
              }}>
                Register
              </button>
            </Link>
          </>
        ) : (
          <>
            <NotificationBell />
            <span style={{ fontWeight: '500', color: '#555' }}>
              {user.username} ({user.role})
            </span>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              style={{
                backgroundColor: '#ff5252',
                color: 'white',
                padding: '8px 16px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
