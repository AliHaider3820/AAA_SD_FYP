import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoryCard.css';

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  // Map category names to service IDs based on the serviceTitles in ServiceProviders.js
  const categoryToServiceId = {
    'Plumbering': 1,
    'Electrition': 2,
    'Food': 3,
    'Painting': 4,
    'Transportation': 5,
    'Home Cleaning': 6
  };

  const handleClick = () => {
    const serviceId = categoryToServiceId[category.name] || 1; // Default to 1 if not found
    navigate(`/service-providers/${serviceId}`);
  };

  return (
    <div 
      className="category-card" 
      style={{ background: category.gradient }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && handleClick()}
    >
      <div className="category-image" style={{ backgroundImage: `url(${category.image})` }}>
        <div className="category-content">
          <i className={category.icon} style={{ color: category.iconColor }}></i>
          <h3>{category.name}</h3>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;