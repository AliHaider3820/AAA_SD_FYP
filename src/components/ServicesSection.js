import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';
import './ServicesSection.css';
import CategoryCard from './CategoryCard';
import ServiceCard from './ServiceCard';
import categories from '../data/categories';
import featuredServices from '../data/featuredServices';

const ServicesSection = () => {
    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <section className="services-section">
            <div className="container">
                <h1>Service Categories</h1>
                <div className="categories-container">
                    <Slider {...sliderSettings}>
                        {categories.map(category => (
                            <CategoryCard key={category.id} category={category} />
                        ))}
                    </Slider>
                </div>
                
                <div className="see-more-container">
                    <Link to="/services" className="see-more-link">
                        View All Categories →
                    </Link>
                </div>

                <h1>Featured Services</h1>
                <div className="services-grid">
                    {featuredServices.map(service => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;