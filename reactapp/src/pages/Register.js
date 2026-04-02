import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    role: "PATIENT",
    specialization: "",
    age: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const msg = await register(form);
      setSuccess(msg || "Registration successful! Please login.");
      setError("");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err.message || "Registration failed");
      setSuccess("");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '40px auto' }}>
      <h2 style={{ color: '#009688' }}>Create Account</h2>
      <p style={{ color: '#555', fontStyle: 'italic' }}>
        "Join the HealthCare Appointment System — your care journey starts here."
      </p>
      {error && <div style={{ color: 'crimson', marginBottom: 8 }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <input
          name="username"
          placeholder="Full name"
          value={form.username}
          onChange={handleChange}
          required
          autoComplete="name"
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />
        <select name="role" value={form.role} onChange={handleChange} required>
          <option value="PATIENT">Patient</option>
          <option value="DOCTOR">Doctor</option>
          <option value="ADMIN">Admin</option>
        </select>
        {form.role === "DOCTOR" && (
          <input
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
            placeholder="Specialization"
            required
          />
        )}
        {form.role === "PATIENT" && (
          <input
            name="age"
            value={form.age}
            onChange={handleChange}
            placeholder="Age"
            required
          />
        )}
        <button type="submit">Register</button>
      </form>
      <div style={{ marginTop: 12 }}>
        Already have an account? <Link to="/login">Login</Link>
      </div>
      {success && <div style={{ color: 'green', marginTop: 12 }}>{success}</div>}
    </div>
  );
};

export default Register;
