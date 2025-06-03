import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ServiceCard.css';

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/service-providers/${service.id}`);
  };

  return (
    <div className="service-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="service-image" style={{ backgroundImage: `url(${service.image})` }}>
        {service.badge && <span className="service-badge">{service.badge}</span>}
      </div>
      <div className="service-content">
        <div className="service-header">
          <i className={service.icon}></i>
          <h3>{service.name}</h3>
        </div>
        <p className="service-description">{service.description}</p>
        <div className="service-features">
          {service.features.map(feature => (
            <span className="feature-tag" key={feature}>
              <i className="fas fa-check"></i> {feature}
            </span>
          ))}
        </div>
        <div className="service-footer">
          <div className="service-rating">
            <div className="stars">
              {Array.from({ length: Math.floor(service.rating) }, (_, index) => (
                <i key={index} className="fas fa-star"></i>
              ))}
              {service.rating % 1 !== 0 && <i className="fas fa-star-half-alt"></i>}
            </div>
            <span className="rating-number">{service.rating} ({service.reviews})</span>
          </div>
          <div className="service-price">
            <span>{service.price}</span>
            <button className="book-button" onClick={(e) => {
              e.stopPropagation();
              navigate(`/service-providers/${service.id}`);
            }}>Book Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;