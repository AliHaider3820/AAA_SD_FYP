import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Loading from './components/Loading';
import './App.css';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const ServiceProviders = lazy(() => import('./pages/ServiceProviders'));
const ProviderProfile = lazy(() => import('./pages/ProviderProfile'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const ClientLogin = lazy(() => import('./pages/Login'));
const BusinessLogin = lazy(() => import('./pages/ServiceProviderLogin'));
const Signup = lazy(() => import('./pages/Signup'));
const Profile = lazy(() => import('./pages/Profile'));
const ReviewPage = lazy(() => import('./pages/ReviewPage'));
const WriteReview = lazy(() => import('./pages/WriteReview'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ServiceProviderSignup = lazy(() => import('./pages/ServiceProviderSignup'));
const BusinessProfile = lazy(() => import('./pages/BusinessProfile'));
const BusinessProfileEdit = lazy(() => import('./pages/BusinessProfileEdit'));
const BusinessDashboard = lazy(() => import('./pages/BusinessDashboard'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const ComplaintPage = lazy(() => import('./pages/ComplaintPage'));
const Inbox = lazy(() => import('./components/Inbox'));

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
        <Suspense fallback={<Loading />}>
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
          <Route path="/business/inbox" element={
            <PrivateRoute requiredUserType="business">
              <Inbox />
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
        </Suspense>
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
