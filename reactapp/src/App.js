import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import DoctorDashboard from './pages/DoctorDashboard.js';
import PatientDashboard from './pages/PatientDashboard.js';
import AdminDashboard from './pages/AdminDashboard.js';
import ProtectedRoute from './router/ProtectedRoute.js';
import Navbar from './components/NavBar.js';
import Footer from './components/Footer.js';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ flex: 1, padding: '16px 24px' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute allowedRoles={['DOCTOR']} />}>
            <Route path="/doctor" element={<DoctorDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
            <Route path="/patient" element={<PatientDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}
