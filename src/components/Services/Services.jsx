import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaLandmark,
  FaShieldAlt,
  FaFileContract,
  FaSearch,
  FaHandshake,
  FaChartLine,
  FaUserCheck,
  FaMapMarkedAlt,
  FaHome,
  FaInfoCircle,
  FaCogs,
  FaEnvelope,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import './Services.css';

function Services() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      icon: <FaLandmark />,
      title: "Land Listing",
      description: "List your land properties with detailed information, photos, and location data for potential buyers."
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure Transactions",
      description: "Our platform ensures secure and transparent land transactions with verified sellers and buyers."
    },
    {
      icon: <FaFileContract />,
      title: "Legal Documentation",
      description: "Access comprehensive legal documentation and verification services for land transactions."
    },
    {
      icon: <FaSearch />,
      title: "Property Search",
      description: "Advanced search functionality to find the perfect land property based on your requirements."
    },
    {
      icon: <FaHandshake />,
      title: "Broker Services",
      description: "Connect with trusted land brokers for professional assistance in buying or selling land."
    },
    {
      icon: <FaChartLine />,
      title: "Market Analysis",
      description: "Get detailed market insights and property value analysis to make informed decisions."
    },
    {
      icon: <FaUserCheck />,
      title: "Verification Services",
      description: "Thorough verification of sellers, buyers, and properties to ensure authenticity."
    },
    {
      icon: <FaMapMarkedAlt />,
      title: "Location Services",
      description: "Detailed location mapping and area information for listed properties."
    }
  ];

  return (
    <div className="services-page">
      {/* NAVBAR */}
      <nav className={`navbar navbar-expand-lg fixed-top ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container">
          <Link className="navbar-brand navbar-brand-flex" to="/">
            <img src={require('../../assets/logomain.png')} alt="LandSecure Logo" className="navbar-logo" />
            <span className="navbar-title">Land Registry</span>
          </Link>

          <button 
            className="navbar-toggler" 
            type="button" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`}>
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <FaHome className="me-1" /> Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about" onClick={() => setIsMobileMenuOpen(false)}>
                  <FaInfoCircle className="me-1" /> About 
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/services" onClick={() => setIsMobileMenuOpen(false)}>
                  <FaCogs className="me-1" /> Services
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                  <FaEnvelope className="me-1" /> Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="services-hero">
        <div className="container">
          <h1>Our Services</h1>
          <p>Comprehensive land transaction solutions for buyers and sellers</p>
        </div>
      </div>

      {/* SERVICES GRID */}
      <div className="container">
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">
                {service.icon}
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="services-cta">
          <h2>Ready to Get Started?</h2>
          <p>Join our platform today and experience seamless land transactions</p>
          <div className="cta-buttons">
            <a href="/dashboard" className="btn btn-primary">Register Now</a>
            <a href="/contact" className="btn btn-outline">Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;
