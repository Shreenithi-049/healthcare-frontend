import React, { useEffect, useMemo, useState } from 'react';
import { AuthContext, useAuth } from '../context/AuthContext';
import { getAppointmentsByDoctor, updateUserById, updateAppointmentStatus, deleteAppointment } from '../services/api';
import WelcomeBanner from '../components/WelcomeBanner.js';

function ProfileForm({ doctor, onSave }) {
  const [form, setForm] = useState({
    name: doctor?.name || '',
    specialization: doctor?.specialization || '',
    gender: doctor?.gender || '',
    imageUrl: doctor?.imageUrl || '',
    experienceYears: doctor?.experienceYears || 0,
    about: doctor?.about || '',
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} style={{ display: 'grid', gap: 12 }}>
      <input
        placeholder="Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        required
      />
      <input
        placeholder="Specialization"
        value={form.specialization}
        onChange={e => setForm({ ...form, specialization: e.target.value })}
        required
      />
      <select
        value={form.gender}
        onChange={e => setForm({ ...form, gender: e.target.value })}
        required
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <input
        placeholder="Image/Logo URL"
        value={form.imageUrl}
        onChange={e => setForm({ ...form, imageUrl: e.target.value })}
      />
      <input
        placeholder="Experience (years)"
        type="number"
        min="0"
        value={form.experienceYears}
        onChange={e => setForm({ ...form, experienceYears: Number(e.target.value) })}
      />
      <textarea
        placeholder="About"
        value={form.about}
        onChange={e => setForm({ ...form, about: e.target.value })}
      />
      <button type="submit">Save Profile</button>
    </form>
  );
}

function ProfileView({ doctor }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
      <img
        src={doctor.imageUrl || 'https://via.placeholder.com/80?text=Dr'}
        alt="Doctor"
        width="80"
        height="80"
        style={{ borderRadius: '50%', objectFit: 'cover' }}
      />
      <div>
        <div><strong>Name:</strong> {doctor.name || '-'}</div>
        <div><strong>Specialization:</strong> {doctor.specialization || '-'}</div>
        <div><strong>Gender:</strong> {doctor.gender || '-'}</div>
        <div><strong>Experience:</strong> {doctor.experienceYears || 0} years</div>
        <div><strong>About:</strong> {doctor.about || '-'}</div>
      </div>
    </div>
  );
}

export default function DoctorDashboard() {
  const { user, token } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [mode, setMode] = useState('VIEW');
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (user && user.id) {
      setDoctor({
        name: user.username,
        specialization: user.specialization || '',
        gender: user.gender || '',
        imageUrl: user.imageUrl || '',
        experienceYears: user.experienceYears || 0,
        about: user.about || '',
      });
      getAppointmentsByDoctor(user.id, token).then(setAppointments);
    }
  }, [user, token]);


  const saveProfile = async (form) => {
    if (!user || !token) return;
    // Map form fields to backend fields
    const updatedUser = {
      username: form.name,
      specialization: form.specialization,
      gender: form.gender,
      experienceYears: form.experienceYears,
      imageUrl: form.imageUrl,
      about: form.about,
    };
    console.log('Updating user with payload:', updatedUser);
    try {
      const updated = await updateUserById(user.id, updatedUser, token);
      setDoctor({
        name: updated.username,
        specialization: updated.specialization,
        gender: updated.gender,
        experienceYears: updated.experienceYears,
        imageUrl: updated.imageUrl,
        about: updated.about,
      });
      setMode('VIEW');
    } catch (e) {
      alert('Failed to update profile.');
    }
  };

  const updateStatus = async (id, status) => {
    if (!token) return;
    try {
      await updateAppointmentStatus(id, status, token);
      // Refresh appointments from backend
      const updated = await getAppointmentsByDoctor(user.id, token);
      setAppointments(updated);
    } catch (e) {
      alert('Failed to update appointment status.');
    }
  };

  const markAsComplete = async (id) => {
    if (!token) return;
    try {
      await deleteAppointment(id, token);
      const updated = await getAppointmentsByDoctor(user.id, token);
      setAppointments(updated);
    } catch (e) {
      alert('Failed to mark appointment as complete.');
    }
  };

  if (!doctor) return <div style={{ padding: 24 }}>Loading doctor data...</div>;

  return (
    <div style={{ maxWidth: 960, margin: '24px auto', display: 'grid', gap: 32 }}>
      <WelcomeBanner />

      <section>
        <h2 style={{ color: '#009688' }}>Your Profile</h2>
        {mode === 'EDIT' ? (
          <ProfileForm doctor={doctor} onSave={saveProfile} />
        ) : (
          <div>
            <ProfileView doctor={doctor} />
            <button style={{ marginTop: 12 }} onClick={() => setMode('EDIT')}>Edit Profile</button>
          </div>
        )}
      </section>

      <section>
        <h2 style={{ color: '#009688' }}>Appointments</h2>
        {appointments.length === 0 ? (
          <div>No appointments yet.</div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {appointments.map(a => (
              <div key={a.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
                <div>
                  <strong>Date:</strong> {a.appointmentDate ? a.appointmentDate.split('T')[0] : '-'}
                  <strong> Time:</strong> {a.appointmentDate ? a.appointmentDate.split('T')[1]?.slice(0,5) : '-'}
                </div>
                <div><strong>Reason:</strong> {a.reason || '-'}</div>
                <div><strong>Status:</strong> {a.status}</div>
                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                  {a.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => updateStatus(a.id, 'APPROVED')}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(a.id, 'REJECTED')}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {a.status === 'APPROVED' && (
                    <button
                      onClick={() => markAsComplete(a.id)}
                    >
                      Mark as Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
