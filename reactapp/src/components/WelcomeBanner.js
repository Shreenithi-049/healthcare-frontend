import React from 'react';

export default function WelcomeBanner() {
  return (
    <div style={{
      backgroundColor: '#E0F2F1',
      padding: '16px 24px',
      borderRadius: 8,
      marginBottom: 24,
      textAlign: 'center'
    }}>
      <h2 style={{ color: '#009688', marginBottom: 8 }}>Welcome to HealthCare Appointment System</h2>
      <p style={{ color: '#555', fontStyle: 'italic', fontSize: '16px' }}>
        "Your health, our priority — book, manage, and care with ease."
      </p>
    </div>
  );
}
