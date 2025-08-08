import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './ServiceProviderSignup.css';

const serviceCategories = [
  { id: 1, name: 'Plumbing' },
  { id: 2, name: 'Electrical' },
  { id: 3, name: 'Food Catering' },
  { id: 4, name: 'Home Painting' },
  { id: 5, name: 'Transport Services' },
  { id: 6, name: 'Home Cleaning' },
  { id: 7, name: 'Gardening & Lawn' },
  { id: 8, name: 'Home Repair' },
  { id: 9, name: 'Locksmith Services' },
  { id: 10, name: 'Online Curses' },
  { id: 11, name: 'Food Delivery' },
  { id: 12, name: 'Other' }
];

const ServiceProviderSignup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // User details
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    location: '',
    
    // Business details
    businessName: '',
    serviceCategory: '',
    yearsOfExperience: '',
    description: '',
    address: '',
    city: '',
    
    // Image
    profilePicture: null,
    imagePreview: ''
  });
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register, registerServiceProvider, user, setUser } = useContext(AuthContext);

  const handleImageChange = (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      // Clear any previous errors
      setError('');

      // Validate file type
      if (!file.type.match('image.*')) {
        setError('Please select a valid image file (JPEG, PNG, etc.)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      
      // Store a reference to setFormData that will be available in the callback
      const updateFormData = setFormData;
      
      reader.onload = (event) => {
        try {
          updateFormData(prev => ({
            ...prev,
            profilePicture: file,
            imagePreview: event.target.result
          }));
        } catch (err) {
          console.error('Error updating form data:', err);
          setError('Failed to process the image');
        }
      };
      
      reader.onerror = () => {
        setError('Failed to read the image file');
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error in handleImageChange:', err);
      setError('An error occurred while processing the image');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      handleImageChange(e);
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep = () => {
    if (step === 1) {
      // User details validation
      if (!formData.name.trim()) {
        setError('Full name is required');
        return false;
      }
      if (!formData.email.trim()) {
        setError('Email is required');
        return false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setError('Please enter a valid email address');
        return false;
      }
      if (!formData.phone.trim()) {
        setError('Phone number is required');
        return false;
      }
      if (!formData.password) {
        setError('Password is required');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      return true;
      
    } else if (step === 2) {
      // Business details validation
      if (!formData.businessName.trim()) {
        setError('Business name is required');
        return false;
      }
      if (!formData.serviceCategory) {
        setError('Please select a service category');
        return false;
      }
      if (!formData.address.trim()) {
        setError('Business address is required');
        return false;
      }
      if (!formData.city.trim()) {
        setError('City is required');
        return false;
      }
      if (!formData.profilePicture) {
        setError('Please upload a profile picture');
        return false;
      }
      return true;
    }
    setError('');
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
      setError('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // First, check if we need to register a new user
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find(u => u.email.toLowerCase() === formData.email.toLowerCase());
      
      // If user doesn't exist, register them first
      if (!existingUser) {
        const userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          location: formData.location,
          isServiceProvider: true,
          role: 'service_provider'
        };
        
        const userResponse = await register(userData);
        if (!userResponse.success) {
          throw new Error(userResponse.message || 'Failed to register user');
        }
      }
      
      // At this point, the user is registered and logged in
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!currentUser) {
        throw new Error('Failed to complete registration. Please try again.');
      }
      
      const userId = currentUser.id;
      
      // Create provider data with all required fields
      const category = serviceCategories.find(cat => cat.id === parseInt(formData.serviceCategory));
      
      const providerData = {
        businessName: formData.businessName.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim(),
        location: formData.location || formData.city,
        address: formData.address.trim(),
        city: formData.city.trim(),
        description: formData.description || `Offering ${category?.name || 'services'}`,
        serviceCategory: formData.serviceCategory,
        categoryName: category?.name || 'Other',
        yearsOfExperience: formData.yearsOfExperience || '0',
        userId: userId,
        profilePicture: formData.imagePreview || null,
        name: formData.businessName.trim(), // Some systems might expect 'name' instead of 'businessName'
        createdAt: new Date().toISOString()
      };
      
      console.log('Submitting provider data:', providerData);
      
      // Register the service provider
      const result = await registerServiceProvider(providerData, userId);
      
      if (result.success) {
        alert('Registration successful! Your business profile is now active.');
        navigate('/business-dashboard');
      } else {
        throw new Error(result.message || 'Failed to register service provider');
      }
      
    } catch (err) {
      console.error('Registration error:', {
        error: err,
        message: err.message,
        stack: err.stack
      });
      setError(err.message || 'Failed to register. Please check your information and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="service-provider-signup">
      <div className="signup-container">
        <div className="signup-header">
          <h1>Become a Service Provider</h1>
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}
          <div className="progress-steps">
            {[1, 2, 3].map((stepNum) => (
              <div 
                key={stepNum} 
                className={`step ${step === stepNum ? 'active' : ''} ${step > stepNum ? 'completed' : ''}`}
              >
                <div className="step-number">{stepNum}</div>
                <div className="step-label">
                  {stepNum === 1 ? 'Personal Info' : stepNum === 2 ? 'Business Info' : 'Review'}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="signup-form">
          {step === 1 && (
            <div className="form-step">
              <h2>Personal Information</h2>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Your location (e.g., City, Country)"
                />
              </div>
              <div className="form-group">
                <label>Create Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password (min 6 characters)"
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-next" onClick={nextStep}>
                  Next: Business Details
                </button>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="form-step">
              <h2>Business Information</h2>
              <div className="form-group">
                <label>Business Name *</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Your business name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Service Category *</label>
                <select
                  name="serviceCategory"
                  value={formData.serviceCategory}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Select a category</option>
                  {serviceCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Business Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address"
                  required
                />
              </div>
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />
              </div>
              <div className="form-group">
                <label>Years of Experience</label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  placeholder="Years of experience"
                  min="0"
                  max="50"
                />
              </div>
              <div className="form-group">
                <label>Business Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us about your business"
                  rows="4"
                ></textarea>
              </div>
              <div className="form-group">
                <label>Profile Picture *</label>
                <div className="image-upload">
                  <input
                    type="file"
                    id="profilePicture"
                    name="profilePicture"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                    required
                  />
                  <label htmlFor="profilePicture" className="file-label">
                    {formData.imagePreview ? (
                      <img src={formData.imagePreview} alt="Preview" className="image-preview" />
                    ) : (
                      <div className="upload-placeholder">
                        <i className="fas fa-camera"></i>
                        <span>Upload Profile Picture</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-prev" onClick={prevStep}>
                  Back
                </button>
                <button type="button" className="btn-next" onClick={nextStep}>
                  Next: Review & Submit
                </button>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="form-step">
              <h2>Review Your Information</h2>
              <div className="review-section">
                <h3>Personal Information</h3>
                <div className="review-item">
                  <span className="review-label">Name:</span>
                  <span className="review-value">{formData.name}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Email:</span>
                  <span className="review-value">{formData.email}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Phone:</span>
                  <span className="review-value">{formData.phone}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Location:</span>
                  <span className="review-value">{formData.location || 'Not specified'}</span>
                </div>
                
                <h3>Business Information</h3>
                <div className="review-item">
                  <span className="review-label">Business Name:</span>
                  <span className="review-value">{formData.businessName}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Service Category:</span>
                  <span className="review-value">
                    {serviceCategories.find(cat => cat.id === parseInt(formData.serviceCategory))?.name || 'Not specified'}
                  </span>
                </div>
                <div className="review-item">
                  <span className="review-label">Address:</span>
                  <span className="review-value">{formData.address}, {formData.city}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Years of Experience:</span>
                  <span className="review-value">{formData.yearsOfExperience || '0'}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Description:</span>
                  <span className="review-value">{formData.description || 'No description provided'}</span>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn-prev" onClick={prevStep}>
                  Back
                </button>
                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ServiceProviderSignup;
