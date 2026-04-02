import React, { useEffect, useState } from 'react';
import { getAllDoctors, getAllPatients, deleteDoctor } from '../services/api';
import { useAuth } from '../context/AuthContext';
import WelcomeBanner from '../components/WelcomeBanner.js';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) return;
    try {
      await deleteDoctor(id, token);
      setDoctors(doctors => doctors.filter(d => d.id !== id));
      alert('Doctor deleted successfully.');
    } catch (err) {
      alert(err?.response?.data || 'Failed to delete doctor.');
    }
  };

  useEffect(() => {
    if (token) {
      getAllDoctors(token).then(setDoctors);
      getAllPatients(token).then(setPatients);
    }
  }, [token]);

  return (
    <div style={{ maxWidth: 1000, margin: '24px auto', display: 'grid', gap: 32 }}>
      <WelcomeBanner />

      <section>
        <h2 style={{ color: '#009688', marginBottom: 12 }}>Doctors List</h2>
        {doctors.length === 0 ? (
          <div>No doctors found.</div>
        ) : (
          <div style={{ overflowX: 'auto', border: '1px solid #ddd', borderRadius: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#e0f2f1' }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Specialization</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Experience</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map(d => (
                  <tr key={d.id}>
                    <td style={{ padding: '12px' }}>{d.username || '-'}</td>
                    <td style={{ padding: '12px' }}>{d.specialization || '-'}</td>
                    <td style={{ padding: '12px' }}>{d.experienceYears || 0} yrs</td>
                    <td style={{ padding: '12px' }}>
                      <button
                        style={{ background: '#e53935', color: 'white', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}
                        onClick={() => handleDeleteDoctor(d.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 style={{ color: '#009688', marginBottom: 12 }}>Patients List</h2>
        {patients.length === 0 ? (
          <div>No patients found.</div>
        ) : (
          <div style={{ overflowX: 'auto', border: '1px solid #ddd', borderRadius: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#e0f2f1' }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Age</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Gender</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(p => (
                  <tr key={p.id}>
                    <td style={{ padding: '12px' }}>{p.username || '-'}</td>
                    <td style={{ padding: '12px' }}>{p.age || '-'}</td>
                    <td style={{ padding: '12px' }}>{p.gender || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
