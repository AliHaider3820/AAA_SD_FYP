import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';
import './ServicesSection.css';
import CategoryCard from './CategoryCard';
import ServiceCard from './ServiceCard';

const ServicesSection = () => {
    const categories = [
        { 
            id: 1, 
            name: 'Plumbering', 
            icon: 'fas fa-sink',
            image: 'images/plumbering.jpg',
            bgColor: '#E3F2FD',
            gradient: 'linear-gradient(135deg, #E3F2FD 0%, #90CAF9 100%)',
            iconColor: '#1976D2'
        },
        { 
            id: 2, 
            name: 'Electrition', 
            icon: 'fas fa-screwdriver-wrench',
            image: 'images/electrician.jpg',
            bgColor: '#F3E5F5',
            gradient: 'linear-gradient(135deg, #F3E5F5 0%, #CE93D8 100%)',
            iconColor: '#7B1FA2'
        },
        { 
            id: 3, 
            name: 'Food', 
            icon: 'fas fa-burger',
            image: 'images/food.jpg',
            bgColor: '#FFF3E0',
            gradient: 'linear-gradient(135deg, #FFF3E0 0%, #FFB74D 100%)',
            iconColor: '#F57C00'
        },
        { 
            id: 4, 
            name: 'Painting', 
            icon: 'fas fa-paint-roller',
            image: 'images/painting.jpg',
            bgColor: '#E8F5E9',
            gradient: 'linear-gradient(135deg, #E8F5E9 0%, #A5D6A7 100%)',
            iconColor: '#388E3C'
        },
        { 
            id: 5, 
            name: 'Transportation', 
            icon: 'fas fa-taxi',
            image: 'images/transportation.jpg',
            bgColor: '#FCE4EC',
            gradient: 'linear-gradient(135deg, #FCE4EC 0%, #F48FB1 100%)',
            iconColor: '#C2185B'
        },
        { 
            id: 6, 
            name: 'Home Cleaning', 
            icon: 'fas fa-home',
            image: 'images/home.jpg',
            bgColor: '#ECEFF1',
            gradient: 'linear-gradient(135deg, #ECEFF1 0%, #B0BEC5 100%)',
            iconColor: '#455A64'
        }
    ];

    const services = [
        { 
            id: 1, 
            name: 'Plumbering',
            category: 'Plumbering',
            description: 'Fast, reliable plumbing solutions with expert service and 24/7 availability.',
            icon: 'fas fa-sink',
            image: 'images/plumbering.jpg',
            rating: 4.8,
            reviews: 128,
            features: ['Leak Repairs', 'Drain Cleaning', 'Fixture Installation'],
            price: 'From $49',
            badge: 'Trusted'
        },
        { 
            id: 2, 
            name: 'Electrition',
            category: 'Electrition',
            description: 'Fast, reliable electrical solutions with expert service and 24/7 availability.',
            icon: 'fas fa-lightbulb',
            image: 'images/electrician.jpg',
            rating: 4.9,
            reviews: 256,
            features: ['Safety', 'Reliability', 'Experience'],
            price: 'From $29',
            badge: 'Secure'
        },
        { 
            id: 3, 
            name: 'Food Catering',
            category: 'Food Catering',
            description: 'Delicious meals for every event',
            icon: 'fas fa-utensils',
            image: 'images/food-catering.jpg',
            rating: 4.7,
            reviews: 512,
            features: ['Fresh', 'Healthy', 'Delicious'],
            price: 'From $10',
            badge: 'Quality'
        },
        { 
            id: 4, 
            name: 'Home Painting',
            category: 'Home Painting',
            description: 'Quick and reliable home painting services',
            icon: 'fas fa-paint-roller',
            image: 'images/home-painting.jpg',
            rating: 4.6,
            reviews: 384,
            features: ['Painting', 'Wallpapering', 'Flooring'],
            price: 'From $0',
            badge: 'Best Seller'
        }
    ];

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
                    {services.map(service => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;