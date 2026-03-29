"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  
  // Try to load user from localStorage on mount
  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null;
    if (storedToken) {
      setUser({ authenticated: true }); // Simplistic check
    }
  }, []);

  const openOtpModal = () => setIsOtpModalOpen(true);
  const closeOtpModal = () => setIsOtpModalOpen(false);

  const loginSuccess = (token, userData) => {
    localStorage.setItem('jwt_token', token);
    setUser({ ...userData, authenticated: true });
    setIsOtpModalOpen(false);
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isOtpModalOpen, openOtpModal, closeOtpModal, loginSuccess, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
