import { db } from './db.js';

export function seedIfEmpty() {
  const users = db.users.all();
  if (users.length > 0) return;

  const admin = db.users.create({
    name: 'Admin',
    email: 'admin@demo.com',
    password: 'admin123',
    role: 'ADMIN',
  });

  const dUser = db.users.create({
    name: 'Dr. Kavya',
    email: 'doctor@demo.com',
    password: 'doctor123',
    role: 'DOCTOR',
  });
  const doc = db.doctors.create({
    userId: dUser.id,
    name: 'Dr. Kavya N',
    specialization: 'Cardiology',
    imageUrl: '',
    experienceYears: 7,
    about: 'Focused on preventive cardiology and patient education.',
  });

  const pUser = db.users.create({
    name: 'Pranav',
    email: 'patient@demo.com',
    password: 'patient123',
    role: 'PATIENT',
  });
  const pat = db.patients.create({
    userId: pUser.id, name: 'Pranav', age: 28, gender: 'Male'
  });

  db.appointments.create({
    doctorId: doc.id,
    patientId: pat.id,
    date: '2025-09-15',
    time: '10:00',
    reason: 'Routine check-up',
  });
}
