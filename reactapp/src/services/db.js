// Simple localStorage "DB" with helper methods
const K = {
  USERS: 'users',
  DOCTORS: 'doctors',
  PATIENTS: 'patients',
  APPTS: 'appointments',
  NOTIFS: 'notifications',
};

function read(key) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36)}`;
}

function usersRepo() {
  return {
    all: () => read(K.USERS),
    findByEmail: (email) => read(K.USERS).find(u => u.email === email),
    findById: (id) => read(K.USERS).find(u => u.id === id),
    create: ({ name, email, password, role }) => {
      const all = read(K.USERS);
      const user = { id: uid('usr'), name, email, password, role };
      all.push(user);
      write(K.USERS, all);
      return user;
    },
  };
}

function doctorsRepo() {
  return {
    all: () => read(K.DOCTORS),
    findByUserId: (userId) => read(K.DOCTORS).find(d => d.userId === userId),
    findById: (id) => read(K.DOCTORS).find(d => d.id === id),
    create: ({ userId, name = '', specialization = '', imageUrl = '', experienceYears = 0, about = '' }) => {
      const all = read(K.DOCTORS);
      const doc = { id: uid('doc'), userId, name, specialization, imageUrl, experienceYears, about };
      all.push(doc);
      write(K.DOCTORS, all);
      return doc;
    },
    update: (id, patch) => {
      const all = read(K.DOCTORS);
      const idx = all.findIndex(d => d.id === id);
      if (idx === -1) throw new Error('Doctor not found');
      all[idx] = { ...all[idx], ...patch };
      write(K.DOCTORS, all);
      return all[idx];
    },
  };
}

function patientsRepo() {
  return {
    all: () => read(K.PATIENTS),
    findByUserId: (userId) => read(K.PATIENTS).find(p => p.userId === userId),
    findById: (id) => read(K.PATIENTS).find(p => p.id === id), // ✅ Added to support notifications
    create: ({ userId, name = '', age = '', gender = '' }) => {
      const all = read(K.PATIENTS);
      const p = { id: uid('pat'), userId, name, age, gender };
      all.push(p);
      write(K.PATIENTS, all);
      return p;
    },
    update: (id, patch) => {
      const all = read(K.PATIENTS);
      const idx = all.findIndex(p => p.id === id);
      if (idx === -1) throw new Error('Patient not found');
      all[idx] = { ...all[idx], ...patch };
      write(K.PATIENTS, all);
      return all[idx];
    },
  };
}

function appointmentsRepo() {
  return {
    all: () => read(K.APPTS),
    byDoctor: (doctorId) => read(K.APPTS).filter(a => a.doctorId === doctorId),
    byPatient: (patientId) => read(K.APPTS).filter(a => a.patientId === patientId),
    findById: (id) => read(K.APPTS).find(a => a.id === id),
    create: ({ doctorId, patientId, date, time, reason }) => {
      const all = read(K.APPTS);
      const appt = { id: uid('apt'), doctorId, patientId, date, time, reason, status: 'PENDING' };
      all.push(appt);
      write(K.APPTS, all);
      return appt;
    },
    updateStatus: (id, status) => {
      const all = read(K.APPTS);
      const idx = all.findIndex(a => a.id === id);
      if (idx === -1) throw new Error('Appointment not found');
      all[idx] = { ...all[idx], status };
      write(K.APPTS, all);
      return all[idx];
    },
  };
}

function notificationsRepo() {
  return {
    all: () => read(K.NOTIFS),
    listByUser: (userId) => read(K.NOTIFS).filter(n => n.userId === userId),
    push: (userId, message) => {
      const all = read(K.NOTIFS);
      all.push({ id: uid('ntf'), userId, message, read: false });
      write(K.NOTIFS, all);
    },
    markAllRead: (userId) => {
      const all = read(K.NOTIFS).map(n =>
        n.userId === userId ? { ...n, read: true } : n
      );
      write(K.NOTIFS, all);
    }
  };
}

export const db = {
  users: usersRepo(),
  doctors: doctorsRepo(),
  patients: patientsRepo(),
  appointments: appointmentsRepo(),
  notifications: notificationsRepo(),
};
