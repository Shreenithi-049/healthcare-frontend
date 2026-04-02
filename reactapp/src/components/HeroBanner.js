import React from 'react';

export default function HeroBanner() {
  return (
    <div style={{
      background: 'linear-gradient(to right, #e0f2f1, #ffffff)',
      padding: '32px 24px',
      textAlign: 'center',
      borderRadius: '8px',
      marginBottom: '24px'
    }}>
      <h1 style={{ color: '#009688', fontSize: '28px', marginBottom: '12px' }}>
        Doctor Consultation at Your Doorstep
      </h1>
      <p style={{ color: '#555', fontSize: '16px' }}>
        Trusted care delivered to your home. Book appointments, manage health, and consult professionals with ease.
      </p>
    </div>
  );
}
