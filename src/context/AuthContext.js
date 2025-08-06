import { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setUserType(userData.isServiceProvider ? 'business' : 'client');
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password, userType) => {
    try {
      console.log('Login attempt:', { email, userType });
      
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      console.log('All users in storage:', users);
      
      // Find user by email
      const user = users.find(u => {
        const emailMatch = u.email && u.email.toLowerCase() === email.toLowerCase();
        // For business login, check both 'business' and 'service_provider' role types
        const isBusinessUser = u.isServiceProvider === true || u.role === 'service_provider';
        const typeMatch = userType === 'business' ? isBusinessUser : !isBusinessUser;
        console.log(`Checking user ${u.email}: emailMatch=${emailMatch}, isBusinessUser=${isBusinessUser}, typeMatch=${typeMatch}`);
        return emailMatch && typeMatch;
      });

      if (!user) {
        console.log('No user found with email:', email, 'and type:', userType);
        return false;
      }
      
      console.log('Found user:', user);
      console.log('Stored password:', user.password);
      console.log('Provided password:', password);
      
      // Check password
      if (user.password !== password) {
        console.log('Password mismatch');
        return false;
      }
      
      // Prepare user data for session
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        isServiceProvider: user.isServiceProvider
      };

      console.log('Setting up user session with:', userData);
      
      // Set up the session
      const actualUserType = user.isServiceProvider ? 'business' : 'client';
      userData.userType = actualUserType; // Store userType in user data for consistency
      
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setUser(userData);
      setUserType(actualUserType);
      setIsAuthenticated(true);
      
      console.log('Login successful');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setUserType(null);
    setIsAuthenticated(false);
  };

  const register = (userData) => {
    try {
      console.log('Starting registration with data:', userData);
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      console.log('Current users in storage:', users);
      
      // Check if user already exists
      const userExists = users.some(user => {
        const exists = user.email.toLowerCase() === userData.email.toLowerCase();
        console.log(`Checking email ${user.email}: ${exists}`);
        return exists;
      });
      
      if (userExists) {
        console.log('Registration failed: User already exists');
        return { success: false, message: 'User with this email already exists' };
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        isServiceProvider: false,
        createdAt: new Date().toISOString()
      };
      console.log('New user created:', newUser);

      // Save user to local storage
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      console.log('User saved to localStorage. Updated users:', users);

      // Log the user in
      const userDataToStore = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        isServiceProvider: false
      };

      console.log('Logging in user with data:', userDataToStore);
      localStorage.setItem('currentUser', JSON.stringify(userDataToStore));
      setUser(userDataToStore);
      setUserType('client');
      setIsAuthenticated(true);

      console.log('Registration and login successful');
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'An error occurred during registration' };
    }
  };

  const registerServiceProvider = async (providerData, userId) => {
    try {
      console.log('Registering service provider with data:', { providerData, userId });
      
      // Get existing providers and users
      const providers = JSON.parse(localStorage.getItem('serviceProviders') || '[]');
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Find and update the user to mark as service provider
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        users[userIndex] = {
          ...users[userIndex],
          isServiceProvider: true
        };
        localStorage.setItem('users', JSON.stringify(users));
      }
      
      // Create new provider with unique ID
      const newProvider = {
        id: `provider-${Date.now()}`,
        ...providerData,
        userId,
        createdAt: new Date().toISOString(),
        rating: 0,
        reviewCount: 0
      };
      
      console.log('New provider created:', newProvider);
      
      // Add to providers array
      providers.push(newProvider);
      
      // Save back to localStorage
      localStorage.setItem('serviceProviders', JSON.stringify(providers));
      
      // Update the current user's session to reflect they are now a service provider
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (currentUser && currentUser.id === userId) {
        const updatedUser = {
          ...currentUser,
          isServiceProvider: true
        };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setUserType('business');
        setIsAuthenticated(true);
      }
      
      console.log('Provider saved successfully');
      return { success: true, provider: newProvider };
      
    } catch (error) {
      console.error('Error registering service provider:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to register service provider' 
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

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
