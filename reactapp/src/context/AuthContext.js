import React, { createContext, useState, useContext } from "react";
import { login as apiLogin, register as apiRegister, getUserById } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  const login = async (username, password) => {
    const data = await apiLogin(username, password);
    setToken(data.token);
    localStorage.setItem("token", data.token);
    // Fetch full user profile
    const fullUser = await getUserById(data.id, data.token);
    setUser(fullUser);
    localStorage.setItem("user", JSON.stringify(fullUser));
  };

  const register = async (userData) => {
    const res = await apiRegister(userData);
    if (!res.success) {
      throw new Error(res.message || "Registration failed");
    }
    return res.message;
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Optional: custom hook for convenience
export const useAuth = () => useContext(AuthContext);