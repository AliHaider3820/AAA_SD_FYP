import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaChartLine, 
  FaUsers, 
  FaStar, 
  FaCalendarAlt, 
  FaClipboardList, 
  FaCog, 
  FaSignOutAlt, 
  FaEnvelope, 
  FaBell, 
  FaDollarSign,
  FaInbox,
  FaTimes,
  FaBars
} from 'react-icons/fa';
import { BsGraphUp } from 'react-icons/bs';
import { MdOutlineRateReview } from 'react-icons/md';
import './BusinessDashboard.css';

const BusinessDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.classList.toggle('sidebar-visible', !isMobileMenuOpen);
  };
  
  // Close mobile menu when a nav item is clicked
  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'inbox') {
      navigate('/business/inbox');
    } else {
      navigate('/business/dashboard');
    }
    if (window.innerWidth < 992) {
      setIsMobileMenuOpen(false);
      document.body.classList.remove('sidebar-visible');
    }
  };
  const [stats, setStats] = useState({
    totalBookings: 0,
    monthlyRevenue: 0,
    averageRating: 0,
    newMessages: 0,
    upcomingAppointments: []
  });

  // Load stats and unread messages count
  useEffect(() => {
    // In a real app, you would fetch this data from your backend
    const fetchData = async () => {
      // Simulated API call for stats
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

      // Load unread messages count from localStorage
      try {
        const inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
        const unread = inquiries.filter(inquiry => !inquiry.isRead).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Error loading unread messages:', error);
      }
    };

    fetchData();
    
    // Set up storage event listener to update unread count when inquiries change
    const handleStorageChange = () => {
      try {
        const inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
        const unread = inquiries.filter(inquiry => !inquiry.isRead).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Error updating unread messages:', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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

  // Navigation items
  const navItems = [
    { id: 'dashboard', icon: <FaChartLine />, label: 'Dashboard' },
    { id: 'inbox', icon: <FaInbox />, label: 'Inbox', badge: unreadCount },
    { id: 'bookings', icon: <FaCalendarAlt />, label: 'Bookings' },
    { id: 'reviews', icon: <FaStar />, label: 'Reviews' },
    { id: 'profile', icon: <FaCog />, label: 'Settings' },
  ];
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const sidebar = document.querySelector('.dashboard-sidebar');
      const menuButton = document.querySelector('.mobile-menu-button');
      
      if (isMobileMenuOpen && sidebar && !sidebar.contains(e.target) && !menuButton.contains(e.target)) {
        setIsMobileMenuOpen(false);
        document.body.classList.remove('sidebar-visible');
      }
    };
    
    // Add event listener for outside clicks
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <div className={`business-dashboard ${isMobileMenuOpen ? 'sidebar-visible' : ''}`}>
      {/* Mobile Menu Toggle Button */}
      <button 
        className="mobile-menu-button"
        onClick={toggleMobileMenu}
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>
      
      {/* Sidebar Navigation */}
      <aside className={`dashboard-sidebar ${isMobileMenuOpen ? 'mobile-visible' : ''}`}>
        <div className="sidebar-header">
          <h2>BizHub</h2>
          <p className="welcome-message">Welcome, {user?.name?.split(' ')[0] || 'Business'}!</p>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.badge > 0 && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt className="logout-icon" /> Logout
          </button>
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0) || 'B'}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name || 'Business Owner'}</span>
              <span className="user-email">{user?.email || ''}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <h1>{navItems.find(item => item.id === activeTab)?.label || 'Dashboard'}</h1>
          </div>
          <div className="header-actions">
            <button 
              className="icon-button"
              onClick={() => setActiveTab('inbox')}
              data-badge={unreadCount > 0 ? unreadCount : null}
            >
              <FaEnvelope />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>
            <button className="icon-button">
              <FaBell />
              <span className="notification-badge">3</span>
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <>
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
          </>
        )}

        {/* Inbox is now handled by its own route in App.js */}

        {activeTab === 'bookings' && (
          <div className="dashboard-card">
            <h2>Bookings</h2>
            <p>Your booking management will appear here.</p>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="dashboard-card">
            <h2>Customer Reviews</h2>
            <p>Your customer reviews will appear here.</p>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="dashboard-card">
            <h2>Business Settings</h2>
            <p>Your business settings will appear here.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default BusinessDashboard;
