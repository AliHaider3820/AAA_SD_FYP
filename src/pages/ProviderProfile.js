import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProviderProfile.css';

// Mock data - in a real app, this would come from an API
const mockProviders = {
  // Plumbing (ID: 1)
  1: [ // Plumbing
    {
      id: 1,
      name: "John's Professional Plumbing",
      rating: 4.8,
      experience: "15 years",
      phone: "+1234567890",
      location: "Downtown, 5km away",
      image: "https://plus.unsplash.com/premium_photo-1663013675008-bd5a7898ac4f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGx1bWJlcnxlbnwwfHwwfHx8MA%3D%3D",
      description: "Expert in residential and commercial plumbing services",
      services: ["Leak Repair", "Pipe Installation", "Drain Cleaning", "Water Heater Service", "Emergency Plumbing"]

    },
    {
      id: 2,
      name: "City Plumbers Co.",
      rating: 4.7,
      experience: "12 years",
      phone: "+1234567891",
      location: "West District, 8km away",
      image: "https://media.istockphoto.com/id/1678200433/photo/female-engineer-checking-boiler-system-in-a-basement.webp?a=1&b=1&s=612x612&w=0&k=20&c=B_S8lTrD93l3bopWVRFzXTnj-xq6WOh3xmgfws-bT6g=",
      description: "Specialized in emergency plumbing repairs and installations",
      services: ["Emergency Repairs", "Sewer Line Services", "Water Line Installation", "Garbage Disposal"]
    },
    {
      id: 3,
      name: "Elite Plumbing Solutions",
      rating: 4.9,
      experience: "20 years",
      phone: "+1234567892",
      location: "Northside, 12km away",
      image: "https://media.istockphoto.com/id/625280930/photo/plumbers-tools-and-plumbing-materials-banner-with-copy-space.webp?a=1&b=1&s=612x612&w=0&k=20&c=oNJUfxZJSDELMFl1WZBgD3hTxmMbXqvOARacsr3lqzE=",
      description: "Full-service plumbing with 24/7 emergency support",
      services: ["Commercial Plumbing", "Residential Plumbing", "Water Filtration", "Gas Line Services"]
    },
    {
      id: 4,
      name: "QuickFlow Plumbing",
      rating: 4.6,
      experience: "10 years",
      phone: "+1234567893",
      location: "East End, 6km away",
      image: "https://media.istockphoto.com/id/1645853106/photo/leaky-sink-pipe-leaking.webp?a=1&b=1&s=612x612&w=0&k=20&c=Sbt1eDz-t294Ace7FynaktCQMwFL6O-AVVyeB7K5kwo=",
      description: "Fast and reliable plumbing services for all your needs",
      services: ["Drain Cleaning", "Faucet Repair", "Toilet Repair", "Water Heater Installation"]
    }
  ],
  2: [ // Electrical
    {
      id: 5,
      name: "PowerFix Electricians",
      rating: 4.9,
      experience: "18 years",
      phone: "+1234567894",
      location: "East End, 3km away",
      image: "https://media.istockphoto.com/id/1165561132/photo/electrician-working-at-electric-panel.webp?a=1&b=1&s=612x612&w=0&k=20&c=Mu6ZjS3O9ORqb366AevDoz-HWQMU5eWAmILBVrKAlbk=",
      description: "Commercial and residential electrical solutions",
      services: ["Wiring Installation", "Panel Upgrades", "Lighting Installation", "Generator Installation"]
    },
    {
      id: 6,
      name: "Smart Electric Pro",
      rating: 4.7,
      experience: "12 years",
      phone: "+1234567895",
      location: "South Quarter, 7km away",
      image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      description: "Smart home installations and electrical repairs",
      services: ["Smart Home Installation", "Electrical Repairs", "Home Automation", "Security System Wiring"]
    },
    {
      id: 7,
      name: "Bright Spark Electrical",
      rating: 4.8,
      experience: "15 years",
      phone: "+1234567896",
      location: "West District, 5km away",
      image: "https://images.unsplash.com/photo-1582649831749-e2d634f55cf3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BhcmslMjBlbGVjdHJpYyUyMHdvcmt8ZW58MHx8MHx8fDA%3D",
      description: "Professional electrical services with a spark of excellence",
      services: ["Panel Upgrades", "Lighting Installation", "Generator Installation", "Smart Home Installation"]
    },
    {
      id: 8,
      name: "Elite Power Solutions",
      rating: 4.9,
      experience: "20 years",
      phone: "+1234567897",
      location: "Northside, 9km away",
      image: "https://plus.unsplash.com/premium_photo-1716824502431-b93e3756a6aa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGVsZWN0cmljJTIwd29ya3xlbnwwfHwwfHx8MA%3D%3D",
      description: "Comprehensive electrical services for homes and businesses",
      services: ["Electrical Inspections", "Wiring Upgrades", "Circuit Breaker Services", "Emergency Electrical Repairs"]
    }
  ],
  3: [ // Food Catering
    {
      id: 9,
      name: "Gourmet Delights",
      rating: 4.8,
      experience: "8 years",
      phone: "+1234567898",
      location: "Central District, 2km away",
      image: "https://plus.unsplash.com/premium_photo-1686239357900-febfb958f33c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2F0ZXJpbmd8ZW58MHx8MHx8fDA%3D",
      description: "Gourmet catering for all occasions",
      services: ["Wedding Catering", "Corporate Events", "Private Parties", "Buffet Services", "Custom Menus"]
    },
    {
      id: 10,
      name: "Savory Bites Catering",
      rating: 4.7,
      experience: "10 years",
      phone: "+1234567899",
      location: "East End, 5km away",
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      description: "Delicious meals for every event",
      services: ["Corporate Catering", "Cocktail Parties", "BBQ Catering", "Boxed Lunches"]
    },
    {
      id: 11,
      name: "Royal Feast Caterers",
      rating: 4.9,
      experience: "15 years",
      phone: "+1234567900",
      location: "West District, 7km away",
      image: "https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      description: "Luxury catering for special occasions",
      services: ["Gala Dinners", "Wedding Receptions", "VIP Events", "Gourmet Canapés"]
    },
    {
      id: 12,
      name: "Tasty Temptations",
      rating: 4.6,
      experience: "12 years",
      phone: "+1234567901",
      location: "South Quarter, 4km away",
      image: "https://images.unsplash.com/photo-1666951833461-71fc128b6810?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNhdGVyaW5nfGVufDB8fDB8fHww",
      description: "Delightful catering for all your events",
      services: ["Birthday Parties", "Anniversaries", "Baby Showers", "Holiday Events"]
    }
  ],
  4: [ // Home Painting
    {
      id: 13,
      name: "ColorSplash Painters",
      rating: 4.6,
      experience: "12 years",
      phone: "+1234567902",
      location: "Westside, 5km away",
      image: "https://media.istockphoto.com/id/1198703852/photo/painter-man-at-work.webp?a=1&b=1&s=612x612&w=0&k=20&c=dxIwyJoJo-xVu7PYe6VnvZIuVAzeYhf4F2cYm_iA_LM=",
      description: "Interior and exterior painting services",
      services: ["Interior Painting", "Exterior Painting", "Color Consultation", "Wallpaper Removal"]
    },
    {
      id: 14,
      name: "Premium Paint Pros",
      rating: 4.9,
      experience: "15 years",
      phone: "+1234567903",
      location: "East End, 4km away",
      image: "https://plus.unsplash.com/premium_photo-1669648891316-ea21653a6b4a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJlbWl1bSUyMHBhaW50JTIwcHJvfGVufDB8fDB8fHww",
      description: "Specialized in custom wall finishes and murals",
      services: ["Custom Murals", "Faux Finishes", "Cabinet Painting", "Stain Work"]
    },
    {
      id: 15,
      name: "Precision Painters",
      rating: 4.7,
      experience: "10 years",
      phone: "+1234567904",
      location: "Northside, 7km away",
      image: "https://plus.unsplash.com/premium_photo-1664303550598-634429e5eca0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJlY2lzaW9uJTIwcGFpbnR8ZW58MHx8MHx8fDA%3D",
      description: "Attention to detail in every stroke",
      services: ["Trim Work", "Deck Staining", "Drywall Repair", "Pressure Washing"]
    },
    {
      id: 16,
      name: "Elite Color Masters",
      rating: 4.8,
      experience: "18 years",
      phone: "+1234567905",
      location: "South Quarter, 6km away",
      image: "https://media.istockphoto.com/id/2176183036/photo/before-and-after-of-man-using-a-paint-roller-to-reveal-newly-remodeled-room-with-fresh-green.webp?a=1&b=1&s=612x612&w=0&k=20&c=sc14uBGqgAwV9U2xMpEWlckD7RWz_JvgJKcm7rWxpCA=",
      description: "Transforming spaces with color and creativity",
      services: ["Color Matching", "Epoxy Floor Coating", "Textured Finishes", "Commercial Painting"]
    }
  ],
  5: [ // Transport Services
    {
      id: 17,
      name: "Swift Move Transport",
      rating: 4.7,
      experience: "9 years",
      phone: "+1234567906",
      location: "East End, 6km away",
      image: "https://media.istockphoto.com/id/2158823766/photo/man-mover-worker-in-blue-uniform-smiling-and-working-prepare-to-move-cardboard-boxes-and.webp?a=1&b=1&s=612x612&w=0&k=20&c=R-2Rne9K68uLJ-3ZoEleaxjCPN9pDt1bxPD3wcJtCTM=",
      description: "Reliable transportation services for all your moving and delivery needs.",
      services: ["Local Moving", "Long-Distance Moving", "Packing Services", "Furniture Assembly"]
    },
    {
      id: 18,
      name: "City Rides",
      rating: 4.6,
      experience: "7 years",
      phone: "+1234567907",
      location: "Downtown, 2km away",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      description: "Comfortable and efficient city transportation",
      services: ["Airport Transfers", "Corporate Travel", "VIP Transport", "Sightseeing Tours"]
    },
    {
      id: 19,
      name: "Elite Movers",
      rating: 4.8,
      experience: "12 years",
      phone: "+1234567908",
      location: "West District, 5km away",
      image: "https://images.unsplash.com/photo-1601584115197-48416bd8575a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      description: "Professional moving services with care",
      services: ["Residential Moving", "Commercial Moving", "Packing Services", "Storage Solutions"]
    },
    {
      id: 20,
      name: "D H L",
      rating: 4.5,
      experience: "8 years",
      phone: "+1234567909",
      location: "Northside, 7km away",
      image: "https://images.unsplash.com/photo-1556011308-d6aedab5ed8f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8Mnw5NTE5NjM0fHxlbnwwfHx8fHw%3D",
      description: "Excellence. Simply Delivered.",
      services: ["Express Delivery", "Freight Services", "Logistics Solutions", "Supply Chain Management"]
    }
  ],
  6: [ // Home Cleaning
    {
      id: 21,
      name: "Sparkle & Shine Cleaners",
      rating: 4.7,
      experience: "7 years",
      phone: "+1234567910",
      location: "South Quarter, 3km away",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      description: "Professional home and office cleaning services",
      services: ["Residential Cleaning", "Commercial Cleaning", "Move-In/Move-Out Cleaning", "Deep Cleaning"]
    },
    {
      id: 22,
      name: "Fresh & Clean Co.",
      rating: 4.7,
      experience: "10 years",
      phone: "+1234567911",
      location: "Northside, 9km away",
      image: "https://media.istockphoto.com/id/1332613500/photo/shot-of-an-unrecognisable-man-disinfecting-a-kitchen-counter-at-home.webp?a=1&b=1&s=612x612&w=0&k=20&c=bBoYaKhjleyz0kaISjHagqgnkCNeFM1E8DH3L3X_a0Y=",
      description: "Deep cleaning and sanitization specialists",
      services: ["Disinfection Services", "Carpet Cleaning", "Upholstery Cleaning", "Window Cleaning"]
    },
    {
      id: 23,
      name: "Elite Cleaning Services",
      rating: 4.9,
      experience: "15 years",
      phone: "+1234567912",
      location: "West District, 6km away",
      image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXwxNzMwOTQwfHxlbnwwfHx8fHw%3D",
      description: "Commercial and residential cleaning solutions",
      services: ["One-Time Cleaning", "Regular Cleaning", "Special Event Cleaning", "Construction Cleaning"]
    },
    {
      id: 24,
      name: "Spotless Clean",
      rating: 4.8,
      experience: "12 years",
      phone: "+1234567913",
      location: "East End, 4km away",
      image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      description: "Leaving your space spotless every time",
      services: ["House Cleaning", "Apartment Cleaning", "Office Cleaning", "Move-In/Move-Out Cleaning"]
    }
  ],
  7: [ // Gardening & Lawn
    {
      id: 25,
      name: "Paradise Lawn Care",
      rating: 4.8,
      experience: "15 years",
      phone: "+1234567915",
      location: "South Quarter, 7km away",
      image: "https://media.istockphoto.com/id/2166370257/photo/person-mowing-a-lush-green-lawn-surrounded-by-vibrant-flowers-in-a-residential-garden.webp?a=1&b=1&s=612x612&w=0&k=20&c=mcFScNNwym2lzRe0-qEe3n8Srl8AWBc5b2bciVISqZc=",
      description: "Professional lawn maintenance and care",
      services: ["Lawn Mowing", "Garden Maintenance", "Yard Cleanup", "Tree Trimming"]
    },
    {
      id: 26,
      name: "Artistic Gardens",
      rating: 4.7,
      experience: "12 years",
      phone: "+1234567916",
      location: "Northside, 10km away",
      image: "https://media.istockphoto.com/id/962475942/photo/shaped-boxtree-garden.webp?a=1&b=1&s=612x612&w=0&k=20&c=F93OqDBet5OK6kPAmrESkKYkPbgSpzMw9bc582nI-bI=",
      description: "Garden design and seasonal maintenance",
      services: ["Garden Design", "Landscape Maintenance", "Seasonal Cleanup", "Plant Installation"]
    },
    {
      id: 27,
      name: "Green Thumb Landscaping",
      rating: 4.9,
      experience: "18 years",
      phone: "+1234567914",
      location: "East End, 4km away",
      image: "https://media.istockphoto.com/id/2213215028/photo/farmer-giving-thumbs-up-in-front-of-rapeseed-field-and-blue-sky.webp?a=1&b=1&s=612x612&w=0&k=20&c=eKPzq_hA9MAFObtE1EvpBbvdR-2KIUxU0vmZL8j1lxg=",
      description: "Complete landscape design and maintenance",
      services: ["Landscape Design", "Yard Installation", "Garden Maintenance", "Outdoor Lighting"]
    },
    {
      id: 28,
      name: "Elite Green Spaces",
      rating: 4.9,
      experience: "20 years",
      phone: "+1234567917",
      location: "West District, 5km away",
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      description: "Transforming outdoor spaces with creativity",
      services: ["Outdoor Kitchen Design", "Patio Installation", "Garden Design", "Water Feature Installation"]
    }
  ],
  8: [ // Home Repair
    {
      id: 29,
      name: "Crystal Clear Windows",
      rating: 4.8,
      experience: "8 years",
      phone: "+1234567920",
      location: "South Quarter, 6km away",
      image: "https://media.istockphoto.com/id/2136391971/photo/construction-worker-installing-new-window-frame.webp?a=1&b=1&s=612x612&w=0&k=20&c=u3uxM8y2mNpCYjYXTJU1KCnOfuHhdobl2dk8h3D1nhA=",
      description: "Expert window repair, replacement, and maintenance services",
      services: ["Window Repair", "Window Replacement", "Window Installation", "Glass Repair"]
    },
    {
      id: 30,
      name: "Elite Home Repairs",
      rating: 4.9,
      experience: "18 years",
      phone: "+1234567921",
      location: "Northside, 8km away",
      image: "https://media.istockphoto.com/id/901157728/photo/handyman-with-tool-belt.webp?a=1&b=1&s=612x612&w=0&k=20&c=9dPF5AnclwrjFQjDZ7-72CGVJLu9AEZwZhj7nUFCY2Y=",
      description: "Comprehensive home repair and maintenance services",
      services: ["Handyman Services", "Home Maintenance", "Repair Services", "Renovation Services"]
    },
    {
      id: 31,
      name: "HandyFix Pro",
      rating: 4.9,
      experience: "15 years",
      phone: "+1234567918",
      location: "West District, 5km away",
      image: "https://media.istockphoto.com/id/2205544619/photo/professional-plumber-repairing-kitchen-extractor-hood-using-screwdriver.webp?a=1&b=1&s=612x612&w=0&k=20&c=Mw53YCgqLCjBgCcCuAA_R-DncwpiGX9xvk-nzR-RZWM=",
      description: "Complete home repair and maintenance solutions",
      services: ["Plumbing Repair", "Electrical Repair", "Carpentry Services", "Appliance Repair"]
    },
    {
      id: 32,
      name: "Quick Fix Solutions",
      rating: 4.7,
      experience: "10 years",
      phone: "+1234567919",
      location: "East End, 3km away",
      image: "https://plus.unsplash.com/premium_photo-1683121027806-b66db61fa41a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGhvbWUlMjByZXBhaXJ8ZW58MHx8MHx8fDA%3D",
      description: "Fast and reliable home repair services",
      services: ["Emergency Repairs", "Home Maintenance", "Renovation Services", "Handyman Services"]
    }
  ],
  9: [ // Locksmith Services
    {
      id: 33,
      name: "Quick Key Locksmiths",
      rating: 4.7,
      experience: "12 years",
      phone: "+1234567924",
      location: "East End, 5km away",
      image: "https://plus.unsplash.com/premium_photo-1661292167106-2224b6d0cefc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Fast and reliable locksmith services for all your security needs. Available 24/7 for emergencies.",
      services: ["Lock Installation", "Lock Repair", "Key Duplication", "Emergency Lockout Services"]
    },
    {
      id: 34,
      name: "Safe & Lock Experts",
      rating: 4.8,
      experience: "15 years",
      phone: "+1234567923",
      location: "West District, 7km away",
      image: "https://plus.unsplash.com/premium_photo-1683133670813-d988d1169cc7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Specialists in high-security locks, safes, and access control systems. Commercial and residential services available.",
      services: ["High-Security Locks", "Safe Installation", "Access Control Systems", "Lockout Services"]
    },
    {
      id: 35,
      name: "24/7 Emergency Locksmith",
      rating: 4.9,
      experience: "18 years",
      phone: "+1234567922",
      location: "Downtown, 2km away",
      image: "https://images.unsplash.com/flagged/photo-1564767609424-270b9df918e1?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "24/7 emergency locksmith services for homes, businesses and vehicles. Fast response time, fully licensed and insured.",
      services: ["Emergency Lockout Services", "Lock Installation", "Lock Repair", "Key Duplication"]
    },
    {
      id: 36,
      name: "Elite Lock & Key",
      rating: 4.9,
      experience: "20 years",
      phone: "+1234567925",
      location: "Northside, 9km away",
      image: "https://plus.unsplash.com/premium_photo-1683141043779-27f6f067f6e0?q=80&w=2004&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Comprehensive locksmith services with the highest level of security expertise",
      services: ["Lock Installation", "Lock Repair", "Key Duplication", "Safe Installation"]
    }
  ]
};

const ProviderProfile = () => {
  const { serviceId, providerId } = useParams();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call
    const fetchProvider = () => {
      try {
        const serviceProviders = mockProviders[serviceId] || [];
        const selectedProvider = serviceProviders.find(p => p.id === parseInt(providerId));
        
        if (selectedProvider) {
          setProvider(selectedProvider);
        } else {
          // Redirect to services page if provider not found
          navigate('/services');
        }
      } catch (error) {
        console.error('Error fetching provider:', error);
        navigate('/services');
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [serviceId, providerId, navigate]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!provider) {
    return <div className="error">Provider not found</div>;
  }

  return (
    <div className="provider-profile">
      <button className="back-button" onClick={() => window.history.back()}>
        <i className="fas fa-arrow-left"></i> Back to Results
      </button>
      
      <div className="profile-header">
        <div className="profile-image-container">
          {provider.image ? (
            <img 
              src={provider.image} 
              alt={provider.name} 
              className="profile-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/400x300?text=No+Image+Available';
              }}
            />
          ) : (
            <div className="no-image">No Image Available</div>
          )}
        </div>
        
        <div className="profile-info">
          <h1>{provider.name}</h1>
          <div className="rating">
            {[...Array(5)].map((_, i) => (
              <i 
                key={i} 
                className={`fas fa-star ${i < Math.floor(provider.rating) ? 'filled' : ''}`}
              ></i>
            ))}
            <span className="rating-text">{provider.rating} ({Math.floor(provider.rating * 10)} reviews)</span>
          </div>
          
          <div className="experience">
            <i className="fas fa-briefcase"></i>
            <span>{provider.experience} of experience</span>
          </div>
          
          <div className="location">
            <i className="fas fa-map-marker-alt"></i>
            <span>{provider.location}</span>
          </div>
          
          <div className="phone">
            <i className="fas fa-phone"></i>
            <a href={`tel:${provider.phone}`}>{provider.phone}</a>
          </div>
          
          <button className="contact-button">
            <i className="fas fa-envelope"></i> Contact Provider
          </button>
        </div>
      </div>
      
      <div className="profile-details">
        <div className="description">
          <h2>About {provider.name}</h2>
          <p>{provider.description}</p>
        </div>
        
        <div className="services-section">
          <h3>Services Offered</h3>
          {provider.services && provider.services.length > 0 ? (
            <ul className="services-list">
              {provider.services.map((service, index) => (
                <li key={index}>
                  <i className="fas fa-check-circle"></i>
                  {service}
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-services">No specific services listed for this provider.</p>
          )}
        </div>
        
        <div className="reviews-section">
          <h3>Customer Reviews</h3>
          <div className="review">
            <div className="review-header">
              <span className="reviewer">Sarah Johnson</span>
              <span className="review-rating">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fas fa-star filled"></i>
                ))}
              </span>
            </div>
            <p className="review-text">
              Excellent service! The team was professional and completed the job efficiently. Highly recommend!
            </p>
          </div>
          
          <div className="review">
            <div className="review-header">
              <span className="reviewer">Michael Chen</span>
              <span className="review-rating">
                {[...Array(4)].map((_, i) => (
                  <i key={i} className="fas fa-star filled"></i>
                ))}
                <i className="far fa-star"></i>
              </span>
            </div>
            <p className="review-text">
              Good work overall, but there was a slight delay in completing the project. The quality of work was great though.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;
