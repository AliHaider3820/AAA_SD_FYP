import React, { createContext, useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceProviders from './pages/ServiceProviders';
import ProviderProfile from './pages/ProviderProfile';
import Contact from './pages/Contact';
import About from './pages/About';
import ClientLogin from './pages/Login';
import ServiceProviderLogin from './pages/ServiceProviderLogin';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import ReviewPage from './pages/ReviewPage';
import WriteReview from './pages/WriteReview';
import NotFound from './pages/NotFound';
import ServiceProviderSignup from './pages/ServiceProviderSignup';
import BusinessProfile from './pages/BusinessProfile';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

export const AuthContext = createContext(null);

const AppContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      
      // If user has a profile picture flag, try to get it from sessionStorage
      if (userData.hasProfilePicture) {
        try {
          const picture = sessionStorage.getItem(`user_${userData.id}_picture`);
          if (picture) {
            userData.profilePicture = picture;
          }
        } catch (e) {
          console.warn('Could not load profile picture from sessionStorage', e);
        }
      }
      
      setUser(userData);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password, isServiceProviderLogin = false) => {
    try {
      console.log('Login attempt with:', { email, isServiceProviderLogin });
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      console.log('All users in storage:', users);
      
      // Find user by email (case-insensitive) and exact password match
      const user = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password
      );
      
      console.log('Found user:', user);
      
      if (user) {
        // Check if the user type matches the login type
        const isServiceProvider = !!user.isServiceProvider;
        console.log('User is service provider:', isServiceProvider);
        
        if ((isServiceProviderLogin && !isServiceProvider) || 
            (!isServiceProviderLogin && isServiceProvider)) {
          console.log('Login type mismatch');
          return false;
        }
        
        // Create a minimal user object for storage (without large fields)
        const { profilePicture, ...userData } = user;
        
        // Create a minimal user object for localStorage
        const userForStorage = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          isServiceProvider: userData.isServiceProvider,
          hasProfilePicture: !!profilePicture
        };
        
        try {
          // Save minimal user data to localStorage
          localStorage.setItem('currentUser', JSON.stringify(userForStorage));
          
          // Store the profile picture separately in sessionStorage if it exists
          if (profilePicture) {
            try {
              sessionStorage.setItem(`user_${user.id}_picture`, profilePicture);
            } catch (e) {
              console.warn('Could not store profile picture in sessionStorage', e);
              // If sessionStorage is full, we'll just continue without the picture
            }
          }
          
          // Set auth state with full user data
          setUser(user);
          setIsAuthenticated(true);
          
          console.log('Login successful');
          return true;
          
        } catch (storageError) {
          console.error('Error saving user data:', storageError);
          
          // If we can't save to localStorage, try with even more minimal data
          try {
            localStorage.setItem('currentUser', JSON.stringify({
              id: user.id,
              email: user.email,
              isServiceProvider: user.isServiceProvider
            }));
            
            setUser(user);
            setIsAuthenticated(true);
            console.log('Login successful (minimal data)');
            return true;
            
          } catch (minimalError) {
            console.error('Fatal error: Could not save any user data', minimalError);
            return false;
          }
        }
      }
      
      console.log('No matching user found or invalid credentials');
      return false;
      
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if user with this email already exists
      const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
      if (existingUser) {
        return { 
          success: false, 
          message: 'A user with this email already exists. Please log in instead.' 
        };
      }
      
      // Create new user object
      const newUser = {
        ...userData,
        id: `user_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isServiceProvider: userData.isServiceProvider || false,
        role: userData.role || 'client',
        hasProfilePicture: false
      };
      
      // If there's a profile picture, store it separately
      if (userData.profilePicture) {
        newUser.hasProfilePicture = true;
        try {
          sessionStorage.setItem(`user_${newUser.id}_picture`, userData.profilePicture);
        } catch (e) {
          console.warn('Could not store profile picture in sessionStorage', e);
        }
      }
      
      // Add to users array and save
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Set auth state with user data (without sensitive info)
      const { password, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      
      // Store minimal user data in localStorage
      localStorage.setItem('currentUser', JSON.stringify({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        isServiceProvider: newUser.isServiceProvider,
        role: newUser.role
      }));
      
      return { 
        success: true, 
        user: userWithoutPassword,
        message: 'Registration successful!'
      };
      
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: 'An error occurred during registration. Please try again.' 
      };
    }
  };

  const registerServiceProvider = async (providerData, userId) => {
    try {
      console.log('Starting provider registration with data:', providerData);
      
      // Validate required fields - check both businessName and name for compatibility
      const businessName = providerData.businessName || providerData.name;
      if (!businessName || !providerData.email || !providerData.serviceCategory) {
        console.error('Missing required fields:', providerData);
        return { 
          success: false, 
          message: 'Missing required fields. Please provide business name, email, and service category.' 
        };
      }

      // Get existing providers or initialize empty array
      const providers = JSON.parse(localStorage.getItem('serviceProviders') || '[]');
      
      // Check if this user already has a business account
      if (userId) {
        const userProviders = providers.filter(p => p.userId === userId);
        if (userProviders.length > 0) {
          return { 
            success: false, 
            message: 'You already have a business account. Please use the existing one.'
          };
        }
      }
      
      // Check if business name is already taken (case insensitive)
      const normalizedBusinessName = businessName.toLowerCase().trim();
      const businessNameExists = providers.some(p => {
        const existingName = (p.businessName || p.name || '').toLowerCase().trim();
        return existingName === normalizedBusinessName;
      });
      
      if (businessNameExists) {
        return { 
          success: false, 
          message: 'A business with this name already exists. Please choose a different name.'
        };
      }
      
      // Check for duplicate email (case insensitive)
      const normalizedEmail = providerData.email.toLowerCase().trim();
      const duplicateEmail = providers.some(p => 
        p.email?.toLowerCase().trim() === normalizedEmail
      );
      
      if (duplicateEmail) {
        return { 
          success: false, 
          message: 'A business with this email address already exists. Please use a different email or log in to that business account.'
        };
      }

      // Handle profile picture - ensure it's properly set
      let profilePicture = providerData.profilePicture;
      
      // If profilePicture is a File object, read it as data URL
      if (profilePicture instanceof File) {
        profilePicture = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(profilePicture);
        });
      }

      // Create complete business data with all required fields
      const businessData = {
        ...providerData,
        businessName: providerData.businessName || providerData.name, // Ensure businessName is set
        name: providerData.businessName || providerData.name, // For backward compatibility
        id: providerData.id || `biz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: userId,
        profilePicture: profilePicture, // Set the processed profile picture
        image: profilePicture, // For backward compatibility
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        rating: 0,
        reviews: [],
        services: [],
        availability: {}
      };
      
      // Add the new provider
      providers.push(businessData);
      localStorage.setItem('serviceProviders', JSON.stringify(providers));
      
      // Update user's isServiceProvider status if not already set
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex !== -1) {
        users[userIndex].isServiceProvider = true;
        users[userIndex].updatedAt = new Date().toISOString();
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update current user in state if it's the same user
        if (user && user.id === userId) {
          const updatedUser = {
            ...user,
            isServiceProvider: true,
            updatedAt: new Date().toISOString()
          };
          
          setUser(updatedUser);
          
          // Update currentUser in localStorage
          const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
          if (currentUser.id === userId) {
            currentUser.isServiceProvider = true;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
          }
        }
      }
      
      console.log('Provider registration successful:', businessData);
      return { success: true, provider: businessData };
      
    } catch (error) {
      console.error('Error registering service provider:', error);
      return { 
        success: false, 
        message: 'An error occurred while registering the business. Please try again.' 
      };
    }
  };

  const logout = () => {
    try {
      // Get user ID before clearing data
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      
      // Clear all auth-related data from localStorage
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
      
      // Clear profile picture from sessionStorage if it exists
      if (currentUser?.id) {
        try {
          sessionStorage.removeItem(`user_${currentUser.id}_picture`);
        } catch (e) {
          console.warn('Error clearing profile picture from sessionStorage:', e);
        }
      }
      
      // Reset state
      setUser(null);
      setIsAuthenticated(false);
      
      // Redirect to home page after logout
      navigate('/');
      
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  };

  const getUserBusinesses = (userId) => {
    if (!userId) return [];
    const providers = JSON.parse(localStorage.getItem('serviceProviders') || '[]');
    return providers.filter(provider => provider.userId === userId);
  };

  const authContextValue = {
    isAuthenticated,
    user,
    setUser,  // Add setUser to make it available in the context
    login,
    logout,
    register,
    registerServiceProvider,
    getUserBusinesses,
    loading
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/service-providers/:serviceId" element={<ServiceProviders />} />
            <Route path="/provider/:serviceId/:providerId" element={<ProviderProfile />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route 
              path="/login" 
              element={!isAuthenticated ? <ClientLogin /> : <Navigate to="/" />} 
            />
            <Route 
              path="/service-provider-login" 
              element={!isAuthenticated ? <ServiceProviderLogin /> : <Navigate to="/" />} 
            />
            <Route 
              path="/signup" 
              element={!isAuthenticated ? <Signup onRegister={register} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/service-provider-signup" 
              element={<ServiceProviderSignup onRegisterServiceProvider={registerServiceProvider} />} 
            />
            <Route 
              path="/profile" 
              element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/business-profile/:businessId?" 
              element={<BusinessProfile />} 
            />
            <Route 
              path="/reviews" 
              element={isAuthenticated ? <ReviewPage /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/write-review/:providerId" 
              element={isAuthenticated ? <WriteReview /> : <Navigate to="/login" />} 
            />
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthContext.Provider>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
