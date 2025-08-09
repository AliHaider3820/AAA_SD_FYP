import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceProviders from './pages/ServiceProviders';
import ProviderProfile from './pages/ProviderProfile';
import Contact from './pages/Contact';
import About from './pages/About';
import ClientLogin from './pages/Login';
import BusinessLogin from './pages/ServiceProviderLogin';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import ReviewPage from './pages/ReviewPage';
import WriteReview from './pages/WriteReview';
import NotFound from './pages/NotFound';
import ServiceProviderSignup from './pages/ServiceProviderSignup';
import BusinessProfile from './pages/BusinessProfile';
import BusinessProfileEdit from './pages/BusinessProfileEdit';
import BusinessDashboard from './pages/BusinessDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ComplaintPage from './pages/ComplaintPage';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Guest route component to redirect authenticated users
const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    // Always redirect to home page for all authenticated users
    return <Navigate to="/home" replace />;
  }
  
  return children;
};

const AppContent = () => {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/service-providers/:serviceId" element={<ServiceProviders />} />
          <Route path="/provider/:serviceId/:providerId" element={<ProviderProfile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/reviews" element={<ReviewPage />} />
          <Route path="/complaint" element={<ComplaintPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={
            <GuestRoute>
              <ClientLogin />
            </GuestRoute>
          } />
          <Route path="/business/login" element={
            <GuestRoute>
              <BusinessLogin />
            </GuestRoute>
          } />
          <Route path="/signup" element={
            <GuestRoute>
              <Signup />
            </GuestRoute>
          } />
          <Route path="/service-provider-signup" element={
            <GuestRoute>
              <ServiceProviderSignup />
            </GuestRoute>
          } />

          {/* Protected Client Routes */}
          <Route path="/profile" element={
            <PrivateRoute requiredUserType="client">
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/write-review/:providerId" element={
            <PrivateRoute requiredUserType="client">
              <WriteReview />
            </PrivateRoute>
          } />

          {/* Protected Business Routes */}
          <Route path="/business/dashboard" element={
            <PrivateRoute requiredUserType="business">
              <BusinessDashboard />
            </PrivateRoute>
          } />
          <Route path="/business-dashboard" element={
            <PrivateRoute>
              <BusinessDashboard />
            </PrivateRoute>
          } />
          <Route path="/business/profile" element={
            <PrivateRoute requiredUserType="business">
              <BusinessProfile />
            </PrivateRoute>
          } />
          <Route path="/edit-business/:businessId" element={
            <PrivateRoute requiredUserType="business">
              <BusinessProfileEdit />
            </PrivateRoute>
          } />

          {/* Password Reset Routes */}
          <Route path="/forgot-password" element={
            <GuestRoute>
              <ForgotPassword />
            </GuestRoute>
          } />
          <Route path="/reset-password" element={
            <GuestRoute>
              <ResetPassword />
            </GuestRoute>
          } />

          {/* 404 Route */}
          <Route path="*" element={<Home/>} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
