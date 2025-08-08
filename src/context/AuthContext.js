import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null); // 'client' or 'business'

  // Check session on page reload
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          withCredentials: true
        });
        const currentUser = response.data.user;
        setUser(currentUser);
        setIsAuthenticated(true);
        setUserType(currentUser.isServiceProvider ? 'business' : 'client');
      } catch (error) {
        console.log('Not authenticated');
        setIsAuthenticated(false);
        setUser(null);
        setUserType(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', userData, {
        withCredentials: true
      });

      const registeredUser = response.data.user;
      setUser(registeredUser);
      setUserType(registeredUser.isServiceProvider ? 'business' : 'client');
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password }, {
        withCredentials: true
      });

      const loggedInUser = response.data.user;
      setUser(loggedInUser);
      setUserType(loggedInUser.isServiceProvider ? 'business' : 'client');
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      return false;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, {
        withCredentials: true
      });
      setUser(null);
      setUserType(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Register service provider
  const registerServiceProvider = async (providerData, userId) => {
    try {
      // Custom API call logic for your app if needed
      console.log('Registering service provider:', providerData);
      // Placeholder logic – adjust as per your backend route
      return { success: true };
    } catch (error) {
      console.error('Provider registration error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Provider registration failed'
      };
    }
  };

  const value = {
    isAuthenticated,
    user,
    userType,
    loading,
    login,
    logout,
    register,
    registerServiceProvider,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
