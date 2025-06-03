import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Services.css';

const Services = () => {
  const services = [
    {
      id: 1,
      title: 'Plumbing Services',
      description: 'Professional plumbing repairs and installations',
      icon: '🚰',
      category: 'Plumbing',
      tags: ['Repairs', 'Installation', 'Maintenance', 'Emergency']
    },
    {
      id: 2,
      title: 'Electrical Work',
      description: 'Expert electrical services for your home and office',
      icon: '⚡',
      category: 'Electrical',
      tags: ['Wiring', 'Installation', 'Repairs', 'Safety']
    },
    {
      id: 3,
      title: 'Food Catering',
      description: 'Delicious catering services for all occasions',
      icon: '👨‍🍳',
      category: 'Food',
      tags: ['Catering', 'Events', 'Private Chef', 'Parties']
    },
    {
      id: 4,
      title: 'Home Painting',
      description: 'Professional painting services for interior and exterior',
      icon: '🎨',
      category: 'Painting',
      tags: ['Interior', 'Exterior', 'Commercial', 'Residential']
    },
    {
      id: 5,
      title: 'Transport Services',
      description: 'Reliable transportation and logistics solutions',
      icon: '🚗',
      category: 'Transport',
      tags: ['Delivery', 'Moving', 'Logistics', 'Transport']
    },
    {
      id: 6,
      title: 'Home Cleaning',
      description: 'Thorough home and office cleaning services',
      icon: '🧹',
      category: 'Cleaning',
      tags: ['Deep Clean', 'Regular', 'Commercial', 'Residential']
    },
    {
      id: 7,
      title: 'Gardening & Lawn',
      description: 'Professional garden maintenance and landscaping',
      icon: '🌿',
      category: 'Gardening',
      tags: ['Maintenance', 'Landscaping', 'Design', 'Care']
    },
    {
      id: 8,
      title: 'Home Repair',
      description: 'General home repairs and maintenance services',
      icon: '🔧',
      category: 'Repair',
      tags: ['Maintenance', 'Repairs', 'Installation', 'Renovation']
    },
    {
      id: 9,
      title: 'Locksmith Services',
      description: 'Professional locksmith services for all your security needs',
      icon: '🔐',
      category: 'Security',
      tags: ['Emergency', 'Lockout', 'Key Duplication', 'Security']
    },
    {
      id: 10,
      title: 'Online Courses',
      description: 'Comprehensive online learning for various skills and subjects',
      icon: '🎓',
      category: 'Education',
      tags: ['E-learning', 'Certification', 'Workshops', 'Tutorials']
    },
    {
      id: 11,
      title: 'Food Delivery',
      description: 'Fast and reliable food delivery from your favorite restaurants',
      icon: '🍔',
      category: 'Food',
      tags: ['Delivery', 'Takeout', 'Meal Kits', 'Groceries']
    }
  ];

  const navigate = useNavigate();

  const handleServiceClick = (serviceId) => {
    navigate(`/service-providers/${serviceId}`);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        service.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="services-page">
      <div className="services-hero">
        <h1>Our Services</h1>
        <p>Discover our comprehensive range of professional services</p>
      </div>

      <div className="services-filters">
        <div className="search-container">
          <input 
            type="text" 
            className="search-input"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="clear-search"
              onClick={() => setSearchQuery('')}
            >
              ×
            </button>
          )}
        </div>

        <div className="category-filter">
          <select 
            className="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Food">Food</option>
            <option value="Painting">Painting</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Gardening">Gardening</option>
            <option value="Repair">Repair</option>
            <option value="Transport">Transport</option>
            <option value="Security">Security</option>
            <option value="Education">Education</option>
          </select>
        </div>
      </div>

      <div className="services-grid">
        {filteredServices.map(service => (
          <div
            key={service.id}
            className="service-card"
            onClick={() => handleServiceClick(service.id)}
          >
            <div className="service-icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <div className="service-meta">
              <span className="service-category">{service.category}</span>
              <div className="service-tags">
                {service.tags.map((tag, index) => (
                  <span key={index} className="service-tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
        {filteredServices.length === 0 && (
          <div className="no-results">
            <p>No services found matching "{searchQuery}"</p>
          </div>
        )}
      </div>

      <div className="cta-section">
        <h2>Need Help Finding the Right Service?</h2>
        <p>Contact us today to learn more about our services</p>
        <Link to="/contact" className="cta-button">Contact Us</Link>
      </div>
    </div>
  );
};

export default Services;