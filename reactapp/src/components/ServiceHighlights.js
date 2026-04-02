import React from 'react';

export default function ServiceHighlights() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '16px',
      marginTop: '24px'
    }}>
      <div style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px' }}>
        <h3 style={{ color: '#009688' }}>Home Visit</h3>
        <p>Get professional medical care at your doorstep.</p>
      </div>
      <div style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px' }}>
        <h3 style={{ color: '#009688' }}>Online Booking</h3>
        <p>Schedule appointments with just a few clicks.</p>
      </div>
      <div style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px' }}>
        <h3 style={{ color: '#009688' }}>Trusted Doctors</h3>
        <p>Consult verified and experienced professionals.</p>
      </div>
    </div>
  );
}
