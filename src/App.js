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
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
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
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        await new Promise(resolve => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          setUser(user);
          setIsAuthenticated(true);
          resolve();
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some(u => u.email === userData.email)) {
      return { success: false, message: 'User already exists' };
    }
    
    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      location: userData.location,
      profilePicture: userData.profilePicture || null
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    setIsAuthenticated(true);
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    navigate('/');
    
    return { success: true, user: newUser };
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setIsAuthenticated(false);
    
    setTimeout(() => {
    }, 0);
    
    return true;
  };

  const authContextValue = {
    isAuthenticated,
    setIsAuthenticated,
    user,
    setUser,
    login,
    logout,
    register
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
              element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
            />
            <Route 
              path="/signup" 
              element={isAuthenticated ? <Navigate to="/" /> : <Signup />} 
            />
            <Route 
              path="/profile" 
              element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
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
