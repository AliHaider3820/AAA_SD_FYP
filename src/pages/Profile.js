import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaEdit, FaCamera, FaSave, FaTimes } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [profilePic, setProfilePic] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    about: ''
  });
  
  // Initialize form data when user data is available
  useEffect(() => {
    const loadUserData = () => {
      // First try to get from context
      if (user) {
        console.log('Loading user data from context:', user);
        setFormData(prev => ({
          ...prev,
          name: user.name || user.username || `${user.firstName || ''} ${user.lastName || ''}`.trim() || '',
          email: user.email || '',
          location: user.location || '',
          about: user.about || ''
        }));
        if (user.profilePicture) {
          setProfilePic(user.profilePicture);
        }
        return;
      }
      
      // Fallback to localStorage if context doesn't have user
      const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      console.log('Loading user data from localStorage:', storedUser);
      
      if (storedUser && storedUser.email) {
        setFormData(prev => ({
          ...prev,
          name: storedUser.name || storedUser.username || 
                `${storedUser.firstName || ''} ${storedUser.lastName || ''}`.trim() || '',
          email: storedUser.email,
          location: storedUser.location || '',
          about: storedUser.about || ''
        }));
        if (storedUser.profilePicture) {
          setProfilePic(storedUser.profilePicture);
        }
      }
    };
    
    loadUserData();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    try {
      // Get current user from context or localStorage
      const currentUser = user || JSON.parse(localStorage.getItem('currentUser') || '{}');
      
      if (!currentUser || !currentUser.id) {
        console.error('No user is currently logged in');
        return;
      }

      // Prepare updated user data
      const updatedUser = {
        ...currentUser,
        name: formData.name || currentUser.name,
        email: formData.email || currentUser.email,
        location: formData.location || currentUser.location,
        about: formData.about || currentUser.about,
        profilePicture: profilePic || currentUser.profilePicture
      };

      // Update context if setUser is available
      if (setUser) {
        setUser(updatedUser);
      }

      // Update localStorage
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // If this is a service provider, update their data in the providers list
      if (currentUser.isServiceProvider) {
        const providers = JSON.parse(localStorage.getItem('providers') || '[]');
        const updatedProviders = providers.map(p => 
          p.id === currentUser.id ? updatedUser : p
        );
        localStorage.setItem('providers', JSON.stringify(updatedProviders));
      }
      
      setIsEditing(false);
      
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onloadend = () => {
      try {
        const newProfilePic = reader.result;
        setProfilePic(newProfilePic);
      } catch (error) {
        console.error('Error updating profile picture:', error);
      }
    };
    
    reader.onerror = () => {
      console.error('Failed to read the image file');
    };
    
    reader.readAsDataURL(file);
  };

  // Check if we have user data in either context or localStorage
  const currentUser = user || JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  // Debug: Log the current user data to help diagnose the issue
  console.log('Current User Data:', currentUser);
  
  if (!currentUser || !currentUser.email) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          Please <a href="/login" style={{ color: '#3498db', textDecoration: 'underline' }}>log in</a> to view your profile.
        </div>
      </div>
    );
  }
  
  // Get the best available name from user data
  const getUserDisplayName = () => {
    // Check all possible name fields in order of preference
    if (currentUser.name) return currentUser.name;
    if (currentUser.username) return currentUser.username;
    if (currentUser.firstName || currentUser.lastName) {
      return `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim();
    }
    if (formData.name) return formData.name;
    // If no name is found, use the email username part
    const emailUsername = currentUser.email ? currentUser.email.split('@')[0] : '';
    return emailUsername || 'User';
  };
  
  const displayName = getUserDisplayName();

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {profilePic ? (
            <img 
              src={profilePic} 
              alt="Profile" 
              className="avatar-img"
            />
          ) : (
            <FaUser className="avatar-icon" />
          )}
          <label className="camera-icon">
            <FaCamera />
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </label>
        </div>
        
        <div className="profile-info">
          {isEditing ? (
            <div className="form-group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Your Name"
              />
            </div>
          ) : (
            <div className="profile-name">
              <FaUser className="info-icon" />
              <h1>{displayName}</h1>
            </div>
          )}
          
          <p className="profile-email">
            <FaEnvelope className="info-icon" /> {formData.email || 'No email provided'}
          </p>
          
          {isEditing ? (
            <div className="form-group">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Your Location"
              />
            </div>
          ) : formData.location ? (
            <p className="profile-location">
              <FaMapMarkerAlt className="info-icon" /> {formData.location}
            </p>
          ) : null}
        </div>
        
        <div className="profile-actions">
          {isEditing ? (
            <>
              <button 
                className="save-profile-btn"
                onClick={handleSaveProfile}
              >
                <FaSave /> Save
              </button>
              <button 
                className="cancel-edit-btn"
                onClick={() => setIsEditing(false)}
              >
                <FaTimes /> Cancel
              </button>
            </>
          ) : (
            <button 
              className="edit-profile-btn"
              onClick={() => setIsEditing(true)}
            >
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>About Me</h2>
          {isEditing ? (
            <div className="form-group">
              <textarea
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Tell us about yourself..."
                rows="4"
              />
            </div>
          ) : (
            <p>{formData.about || 'No information provided'}</p>
          )}
        </div>

        <div className="profile-section">
          <h2>Contact Information</h2>
          <div className="contact-info">
            <p><strong>Email:</strong> {formData.email}</p>
            {formData.location && (
              <p className="profile-location">
                <FaMapMarkerAlt className="info-icon" /> {formData.location}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
