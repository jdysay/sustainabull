import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      console.log("Initializing auth context");
      const token = localStorage.getItem('token');
      console.log("Stored token:", token);
      
      if (token) {
        try {
          // Try to get user data with the token
          const response = await axios.get('http://localhost:8000/api/accounts/user/', {
            headers: {
              'Authorization': `Token ${token}`
            }
          });
          
          setUser(response.data);
          console.log("User authenticated:", response.data);
        } catch (error) {
          console.error("Auth error:", error);
          
          // Don't clear the token on server errors (500)
          if (!error.response || error.response.status !== 500) {
            localStorage.removeItem('token');
          }
          
          setUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        console.log("No token found");
        setUser(null);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Step 1: Login to get token
      // Adding content-type header and ensuring data is formatted correctly
      const response = await axios.post(
        'http://localhost:8000/api/accounts/login/',
        { username, password },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      const { token } = response.data;
      localStorage.setItem('token', token);
      
      // Step 2: Get user data with the token (bypassing the 500 error)
      try {
        const userResponse = await axios.get(
          'http://localhost:8000/api/accounts/user/',
          {
            headers: {
              'Authorization': `Token ${token}`
            }
          }
        );
        setUser(userResponse.data);
      } catch (userError) {
        console.log("Couldn't fetch user data, but login was successful");
        // On error, set minimal user data
        setUser({ username });
      }
      
      return { success: true };
    } catch (error) {
      console.error("Login error details:", error.response?.data);
      setError(error.response?.data?.non_field_errors?.[0] || "Login failed");
      return { 
        success: false, 
        error: error.response?.data?.non_field_errors?.[0] || 
               error.response?.data?.detail || 
               "Login failed", 
        statusCode: error.response?.status,
        response: error.response?.data
      };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(
        'http://localhost:8000/api/accounts/register/',
        userData
      );
      
      return { success: true, data: response.data };
    } catch (error) {
      setError(error.response?.data || "Signup failed");
      return { success: false, error: error.response?.data || "Signup failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Simple function to update gold without reloading user
  const updateGold = (newAmount) => {
    if (user) {
      setUser({
        ...user,
        gold: newAmount
      });
    }
  };

  const contextValue = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    updateGold
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;