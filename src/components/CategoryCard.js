import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoryCard.css';

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/service-providers/${category.id}`, { state: { serviceName: category.name } });
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