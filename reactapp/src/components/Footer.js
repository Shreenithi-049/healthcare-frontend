import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      marginTop: '40px',
      backgroundColor: '#E0F2F1',
      padding: '16px',
      textAlign: 'center',
      fontSize: '14px',
      color: '#555',
      borderTop: '1px solid #ccc'
    }}>
      <img src="/logo.png" alt="HealthCare Logo" style={{ height: 40, marginBottom: 8 }} />
      <div>© 2025 HealthCare Appointment System — Trusted care, delivered with compassion.</div>
    </footer>
  );
}
