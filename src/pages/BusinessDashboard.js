import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaChartLine, FaUsers, FaStar, FaCalendarAlt, FaClipboardList, FaCog, FaSignOutAlt, FaEnvelope, FaBell, FaDollarSign } from 'react-icons/fa';
import { BsGraphUp } from 'react-icons/bs';
import { MdOutlineRateReview } from 'react-icons/md';
import './BusinessDashboard.css';

const BusinessDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBookings: 0,
    monthlyRevenue: 0,
    averageRating: 0,
    newMessages: 0,
    upcomingAppointments: []
  });

  // Simulate loading stats from an API
  useEffect(() => {
    // In a real app, you would fetch this data from your backend
    const fetchStats = async () => {
      // Simulated API call
      setTimeout(() => {
        setStats({
          totalBookings: 42,
          monthlyRevenue: 5240,
          averageRating: 4.7,
          newMessages: 5,
          upcomingAppointments: [
            { id: 1, customer: 'John Doe', service: 'AC Repair', date: '2023-08-15 10:00' },
            { id: 2, customer: 'Jane Smith', service: 'Plumbing', date: '2023-08-16 14:30' },
          ]
        });
      }, 500);
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/business/login');
  };

  const StatCard = ({ icon, title, value, change }) => (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <h3>{title}</h3>
        <p className="stat-value">{value}</p>
        {change && <span className={`stat-change ${change > 0 ? 'positive' : 'negative'}`}>
          {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
        </span>}
      </div>
    </div>
  );

  return (
    <div className="business-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Dashboard</h1>
          <p className="welcome-message">Welcome back, {user?.name || 'Business Owner'}! 👋</p>
        </div>
        <div className="header-actions">
          <button className="icon-button">
            <FaEnvelope />
            {stats.newMessages > 0 && <span className="notification-badge">{stats.newMessages}</span>}
          </button>
          <button className="icon-button">
            <FaBell />
            <span className="notification-badge">3</span>
          </button>
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt className="logout-icon" /> Logout
          </button>
        </div>
      </header>

      <div className="dashboard-stats">
        <StatCard 
          icon={<FaClipboardList />} 
          title="Total Bookings" 
          value={stats.totalBookings}
          change={12}
        />
        <StatCard 
          icon={<FaDollarSign />} 
          title="Monthly Revenue" 
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          change={8}
        />
        <StatCard 
          icon={<FaStar />} 
          title="Avg. Rating" 
          value={`${stats.averageRating}/5.0`}
          change={2}
        />
        <StatCard 
          icon={<FaUsers />} 
          title="New Customers" 
          value="15"
          change={-3}
        />
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Revenue Overview</h3>
            <select className="time-filter">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="chart-placeholder">
            <BsGraphUp className="chart-icon" />
            <p>Revenue chart will be displayed here</p>
          </div>
        </div>

        <div className="dashboard-sidebar">
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Upcoming Appointments</h3>
              <button className="btn-text" onClick={() => navigate('/appointments')}>View All</button>
            </div>
            <div className="appointments-list">
              {stats.upcomingAppointments.length > 0 ? (
                stats.upcomingAppointments.map(appt => (
                  <div key={appt.id} className="appointment-item">
                    <div className="appointment-time">
                      <FaCalendarAlt />
                      <span>{new Date(appt.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className="appointment-details">
                      <h4>{appt.customer}</h4>
                      <p>{appt.service}</p>
                    </div>
                    <button className="btn-icon">
                      <FaEnvelope />
                    </button>
                  </div>
                ))
              ) : (
                <p className="no-data">No upcoming appointments</p>
              )}
            </div>
          </div>

          <div className="dashboard-card quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button 
                className="btn-action"
                onClick={() => navigate('/business/profile')}
              >
                <FaCog /> Manage Profile
              </button>
              <button className="btn-action">
                <FaClipboardList /> Add Service
              </button>
              <button className="btn-action">
                <MdOutlineRateReview /> View Reviews
              </button>
              <button className="btn-action">
                <FaChartLine /> View Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
