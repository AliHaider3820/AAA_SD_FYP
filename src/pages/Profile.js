import React, { useContext, useState } from 'react';
import { AuthContext } from '../App';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaEdit, FaCamera } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [profilePic, setProfilePic] = useState(user?.profilePicture || null);

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-error">Please log in to view your profile.</div>
      </div>
    );
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newProfilePic = reader.result;
        setProfilePic(newProfilePic);
        
        // Update user in context and localStorage
        const updatedUser = { ...user, profilePicture: newProfilePic };
        setUser(updatedUser);
        
        // Update in localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.map(u => 
          u.email === user.email ? { ...u, profilePicture: newProfilePic } : u
        );
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      };
      reader.readAsDataURL(file);
    }
  };

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
          <h1>{user.name || 'User'}</h1>
          <p className="profile-email">
            <FaEnvelope className="info-icon" /> {user.email || 'No email provided'}
          </p>
          {user.location && (
            <p className="profile-location">
              <FaMapMarkerAlt className="info-icon" /> {user.location}
            </p>
          )}
        </div>
        <button className="edit-profile-btn">
          <FaEdit /> Edit Profile
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>About Me</h2>
          <p>{user.about || 'No information provided'}</p>
        </div>

        <div className="profile-section">
          <h2>Contact Information</h2>
          <div className="contact-info">
            <p><strong>Email:</strong> {user.email}</p>
            {user.location && (
              <p className="profile-location">
                <FaMapMarkerAlt className="info-icon" /> {user.location}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
