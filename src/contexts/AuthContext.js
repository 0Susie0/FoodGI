import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import { auth } from '../services/firebase';

// Create the authentication context
const AuthContext = createContext(null);

/**
 * Provider component that wraps the app and makes auth object available to any
 * child component that calls useAuth().
 */
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Setup authentication state listener
  useEffect(() => {
    const unsubscribe = setupAuthListener();
    return () => unsubscribe();
  }, []);

  // Function to set up the authentication state listener
  const setupAuthListener = () => {
    return auth().onAuthStateChanged(async (user) => {
      if (user) {
        // Get full user data from Firestore
        try {
          const userData = await authService.getCurrentUser();
          setCurrentUser(userData);
        } catch (err) {
          setCurrentUser(user);
          console.error('Error getting user data:', err);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
  };

  // Register a new user
  const register = async (email, password, userData) => {
    setLoading(true);
    setError(null);
    try {
      const user = await authService.register(email, password, userData);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Log in an existing user
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const user = await authService.login(email, password);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Log out the current user
  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.logout();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset password for a user
  const resetPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      await authService.resetPassword(email);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      await authService.updateUserProfile(userData);
      setCurrentUser((prevUser) => ({
        ...prevUser,
        ...userData,
      }));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Change user password
  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      const success = await authService.changePassword(currentPassword, newPassword);
      return success;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // The value object that will be shared across components
  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    resetPassword,
    updateProfile,
    changePassword,
    isAuthenticated: () => !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext; 