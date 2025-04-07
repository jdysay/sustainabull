// AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:8000/api/accounts/login/', credentials);
      const userData = response.data.user;

      // Add logging to check the user data from server
      console.log('User data received from server:', userData);

      // Make sure gold is included in the userData object
      localStorage.setItem('token', response.data.token);
      setUser(userData);
      setLoading(false);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed. Please try again."
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:8000/api/accounts/register/', userData);

      // Add logging to check the user data from server
      console.log('New user data received from server:', response.data.user);

      // Make sure gold is included in the user object
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setLoading(false);

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed. Please try again."
      };
    }
  };

  const fetchUser = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:8000/api/accounts/me/', {
        headers: { 'Authorization': `Token ${token}` }
      });

      // Enhanced debugging to check gold value specifically
      console.log('User data received:', response.data);
      console.log('Gold value:', response.data.gold);
      
      // Force gold value to be at least 100 if missing
      if (response.data.gold === undefined || response.data.gold === null) {
        console.warn('Gold value missing, setting default');
        response.data.gold = 100;
      }
      
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};