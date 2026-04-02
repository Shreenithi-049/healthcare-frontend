import axios from "axios";

// ✅ LIVE BACKEND URL
const API_BASE = "https://healthcare-system-backend-bzjj.onrender.com/api";

// =======================
// AUTH
// =======================
export const login = async (username, password) => {
  const res = await axios.post(`${API_BASE}/auth/login`, { username, password });
  return res.data;
};

export const register = async (user) => {
  const res = await axios.post(`${API_BASE}/auth/register`, user);
  return res.data;
};

// =======================
// APPOINTMENTS
// =======================
export const createAppointment = async (appointment, token) => {
  const res = await axios.post(`${API_BASE}/appointments/`, appointment, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getAppointmentsByDoctor = async (doctorId, token) => {
  const res = await axios.get(`${API_BASE}/appointments/doctor/${doctorId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getAppointmentsByPatient = async (patientId, token) => {
  const res = await axios.get(`${API_BASE}/appointments/patient/${patientId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateAppointmentStatus = async (id, status, token) => {
  const res = await axios.put(
    `${API_BASE}/appointments/${id}/status?status=${status}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return res.data;
};

export const deleteAppointment = async (id, token) => {
  const res = await axios.delete(`${API_BASE}/appointments/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// =======================
// USERS
// =======================
export const getAllDoctors = async (token) => {
  const res = await axios.get(`${API_BASE}/users/doctors`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getAllPatients = async (token) => {
  const res = await axios.get(`${API_BASE}/users/patients`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getUserById = async (id, token) => {
  const res = await axios.get(`${API_BASE}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateUserById = async (id, user, token) => {
  const res = await axios.put(`${API_BASE}/users/${id}`, user, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  return res.data;
};

export const deleteDoctor = async (id, token) => {
  const res = await axios.delete(`${API_BASE}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};