import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, useAuth } from '../context/AuthContext';
import { getAppointmentsByPatient, getUserById, updateUserById, getAllDoctors, createAppointment } from '../services/api';
import WelcomeBanner from '../components/WelcomeBanner.js';

function DoctorCard({ d, onSelect }) {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <img
          src={d.imageUrl || 'https://via.placeholder.com/64?text=Dr'}
          width="64"
          height="64"
          style={{ borderRadius: '50%', objectFit: 'cover' }}
          alt="Doctor"
        />
        <div>
          <div><strong>{d.username || 'Unnamed Doctor'}</strong></div>
          <div>{d.specialization || 'General'}</div>
          <div>{d.experienceYears || 0} yrs experience</div>
        </div>
      </div>
      <button style={{ marginTop: 12 }} onClick={() => onSelect(d)}>Book Appointment</button>
    </div>
  );
}

function BookForm({ doctor, onBook, onCancel }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !time) return;
    const selected = new Date(`${date}T${time}:00`);
    const now = new Date();
    if (selected <= now) {
      alert('Please select a future date and time for your appointment.');
      return;
    }
    onBook({ date, time, reason });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
      <div><strong>Doctor:</strong> {doctor.username} ({doctor.specialization})</div>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
      <input type="time" value={time} onChange={e => setTime(e.target.value)} required />
      <input placeholder="Reason" value={reason} onChange={e => setReason(e.target.value)} required />
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit">Book</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

function PatientProfileForm({ patient, onSave, onCancel }) {
  const [form, setForm] = useState({
    age: patient?.age || '',
    gender: patient?.gender || '',
  });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} style={{ display: 'grid', gap: 12 }}>
      <input
        type="number"
        placeholder="Age"
        value={form.age}
        onChange={e => setForm({ ...form, age: e.target.value })}
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
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit">Save Profile</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default function PatientDashboard() {
  const { user, token } = useAuth();
  const [patient, setPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [mode, setMode] = useState('VIEW');

  useEffect(() => {
    if (user && token) {
      getUserById(user.id, token).then(setPatient);
      getAllDoctors(token).then(setDoctors);
      getAppointmentsByPatient(user.id, token).then(setAppointments);
    }
  }, [user, token]);

  const onBook = async ({ date, time, reason }) => {
    if (!patient || !selectedDoctor || !token) return;
    // Extra frontend validation (defensive)
    if (!date || !time) return;
    const selected = new Date(`${date}T${time}:00`);
    const now = new Date();
    if (selected <= now) {
      alert('Please select a future date and time for your appointment.');
      return;
    }
    try {
      // Combine date and time into ISO string for backend
      const appointmentDate = `${date}T${time}:00`;
      await createAppointment({
        doctorId: selectedDoctor.id,
        patientId: patient.id,
        appointmentDate,
        reason
      }, token);
      // Re-fetch appointments from backend
      const updated = await getAppointmentsByPatient(patient.id, token);
      setAppointments(updated);
      setSelectedDoctor(null);
    } catch (e) {
      if (e?.response?.data?.message) {
        alert(e.response.data.message);
      } else if (e?.response?.data) {
        alert(e.response.data);
      } else {
        alert('Failed to book appointment.');
      }
    }
  };

  const saveProfile = async ({ age, gender }) => {
    if (!patient || !user || !token) return;
    const updated = await updateUserById(user.id, { age, gender }, token);
    setPatient(updated);
    setMode('VIEW');
  };

  if (!patient) return <div style={{ padding: 24 }}>Loading patient data...</div>;

  return (
    <div style={{ maxWidth: 1000, margin: '24px auto', display: 'grid', gap: 32 }}>
      <WelcomeBanner />

      <section>
        <h2 style={{ color: '#009688' }}>Your Profile</h2>
        {mode === 'EDIT' ? (
          <PatientProfileForm patient={patient} onSave={saveProfile} onCancel={() => setMode('VIEW')} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div><strong>Name:</strong> {patient.username || '-'}</div>
            <div><strong>Age:</strong> {patient.age || '-'}</div>
            <div><strong>Gender:</strong> {patient.gender || '-'}</div>
            <button style={{ marginTop: 12, maxWidth: 120 }} onClick={() => setMode('EDIT')}>Edit Profile</button>
          </div>
        )}
      </section>

      <section>
        <h2 style={{ color: '#009688' }}>Available Doctors</h2>
        {doctors.length === 0 ? (
          <div>No doctors available.</div>
        ) : (
          <div style={{
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))'
          }}>
            {doctors.map(d => <DoctorCard key={d.id} d={d} onSelect={setSelectedDoctor} />)}
          </div>
        )}
      </section>

      {selectedDoctor && (
        <section style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
          <h3 style={{ marginBottom: 12 }}>Book Appointment</h3>
          <BookForm doctor={selectedDoctor} onBook={onBook} onCancel={() => setSelectedDoctor(null)} />
        </section>
      )}

      <section>
        <h2 style={{ color: '#009688' }}>Your Appointments</h2>
        {appointments.length === 0 ? (
          <div>No appointments booked.</div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {appointments.map(a => {
              const doc = doctors.find(d => d.id === a.doctorId);
              return (
                <div key={a.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
                  <div><strong>Doctor:</strong> {doc?.username} ({doc?.specialization})</div>
                  <div>
                    <strong>Date:</strong> {a.appointmentDate ? a.appointmentDate.split('T')[0] : '-'}
                    <strong> Time:</strong> {a.appointmentDate ? a.appointmentDate.split('T')[1]?.slice(0,5) : '-'}
                  </div>
                  <div><strong>Reason:</strong> {a.reason}</div>
                  <div><strong>Status:</strong> {a.status}</div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
