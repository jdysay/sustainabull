import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Improved initialization to better persist state
  useEffect(() => {
    const initializeAuth = async () => {
      console.log("Initializing auth context");
      setLoading(true);
      
      try {
        // First check if we have a token
        const token = localStorage.getItem('token');
        console.log("Stored token:", token ? "Found" : "Not found");
        
        // Also check if we have cached user data
        const cachedUserData = localStorage.getItem('userData');
        
        if (!token) {
          console.log("No authentication token found");
          setUser(null);
          setLoading(false);
          return;
        }
        
        // If we have cached user data and token, use it immediately to prevent loading state
        if (cachedUserData) {
          try {
            const parsedUser = JSON.parse(cachedUserData);
            setUser(parsedUser);
            console.log("Using cached user data:", parsedUser);
          } catch (e) {
            console.error("Error parsing cached user data:", e);
            // Invalid cache, will be overwritten by API call below
          }
        }
        
        // Always fetch fresh user data with the token
        try {
          const response = await axios.get('http://localhost:8000/api/accounts/user/', {
            headers: {
              'Authorization': `Token ${token}`
            }
          });
          
          // Update state and cache
          setUser(response.data);
          localStorage.setItem('userData', JSON.stringify(response.data));
          console.log("Fresh user data fetched:", response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
          
          // If we have cached data, keep using it even if the refresh failed
          if (!user && cachedUserData) {
            try {
              setUser(JSON.parse(cachedUserData));
              console.log("Continuing with cached user data after fetch failure");
            } catch (e) {
              console.error("Invalid cached user data:", e);
            }
          }
          
          // Only clear data if it's an authentication error
          if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            setUser(null);
          }
        }
      } catch (e) {
        console.error("Auth initialization error:", e);
      } finally {
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
      
      // Step 2: Get user data with the token
      try {
        const userResponse = await axios.get(
          'http://localhost:8000/api/accounts/user/',
          {
            headers: {
              'Authorization': `Token ${token}`
            }
          }
        );
        // Store user data both in state and localStorage
        setUser(userResponse.data);
        localStorage.setItem('userData', JSON.stringify(userResponse.data));
      } catch (userError) {
        console.log("Couldn't fetch user data, but login was successful");
        // On error, set minimal user data
        const minimalUser = { username };
        setUser(minimalUser);
        localStorage.setItem('userData', JSON.stringify(minimalUser));
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
    localStorage.removeItem('userData');
    setUser(null);
  };

  // Simple function to update gold without reloading user
  const updateGold = async (newAmount) => {
    if (user) {
      // Update local state immediately for responsive UI
      const updatedUser = {
        ...user,
        gold: newAmount
      };
      setUser(updatedUser);
      
      // Update cached data
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      return true;
    }
    return false;
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