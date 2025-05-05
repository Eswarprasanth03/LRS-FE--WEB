import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaHome, FaInfoCircle, FaCogs, FaBars, FaTimes } from 'react-icons/fa';
import './Contact.css';
import React, { useEffect, useState } from 'react';
import logo from '../../assets/logomain.png';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({
    type: '',
    message: ''
  });

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Sending message...' });

    setTimeout(() => {
      setStatus({
        type: 'success',
        message: 'Thank you for your message! We will get back to you soon.'
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="contact-page">
      {/* Navbar */}
      <nav className={`navbar navbar-expand-lg fixed-top ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img 
              src={logo} 
              alt="Land Registry Logo" 
              height="40" 
              className="d-inline-block align-top me-2"
            />
            <span className="navbar-title">Land Registry</span>
          </a>
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
                <a className="nav-link" href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <FaHome className="me-1" /> Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/about" onClick={() => setIsMobileMenuOpen(false)}>
                  <FaInfoCircle className="me-1" /> About 
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/services" onClick={() => setIsMobileMenuOpen(false)}>
                  <FaCogs className="me-1" /> Services
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                  <FaEnvelope className="me-1" /> Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Contact Section */}
      <div className="contact-hero">
        <h1>Contact Us</h1>
        <p>Get in touch with our team for any questions or assistance</p>
      </div>

      <div className="contact-container">
        <div className="contact-info">
          <div className="info-card">
            <FaEnvelope className="info-icon" />
            <h3>Email Us</h3>
            <p>support@landregistry.com</p>
          </div>

          <div className="info-card">
            <FaPhone className="info-icon" />
            <h3>Call Us</h3>
            <p>9701375924</p>
          </div>

          <div className="info-card">
            <FaMapMarkerAlt className="info-icon" />
            <h3>Visit Us</h3>
            <p>123 Land Registry Street<br />Vanastalipuram,Hyderabad</p>
          </div>
        </div>

        <div className="contact-form-container">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Enter message subject"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Enter your message"
                rows="5"
              />
            </div>

            {status.message && (
              <div className={`status-message ${status.type}`}>
                {status.message}
              </div>
            )}

            <button type="submit" className="submit-btn">
              <FaPaperPlane className="submit-icon" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
