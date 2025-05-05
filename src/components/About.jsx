
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaCogs, FaEnvelope, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/logomain.png';

const About = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`navbar navbar-expand-lg fixed-top ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container">
          <Link className="navbar-brand navbar-brand-flex" to="/">
            <img src={logo} alt="LandSecure Logo" className="navbar-logo" />
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
                <Link className="nav-link" to="/services" onClick={() => setIsMobileMenuOpen(false)}>
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

      <div className="container" style={{ paddingTop: '120px', paddingBottom: '50px' }}>
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="card shadow-lg border-0 p-4 rounded-4">
              <h1 className="text-center mb-4 fw-bold">About Land Registry</h1>
              <p className="lead">
                The Land Registry System is designed to bring transparency, efficiency, and trust to the way we handle land ownership and property transactions. By leveraging blockchain technology, the platform guarantees tamper-proof record-keeping, automated smart contracts, and faster verification processes.
              </p>
              <h4 className="mt-4 fw-semibold">Our Vision</h4>
              <p>
                To build a decentralized, secure, and inclusive infrastructure that transforms how land assets are registered, transferred, and verified across communities.
              </p>
              <h4 className="mt-4 fw-semibold">Core Objectives</h4>
              <ul className="list-group list-group-flush mb-4">
                <li className="list-group-item">✅ Ensure data integrity with blockchain immutability</li>
                <li className="list-group-item">✅ Minimize fraud and forgery through smart contracts</li>
                <li className="list-group-item">✅ Offer a user-friendly experience for buyers, sellers, and authorities</li>
                <li className="list-group-item">✅ Enable real-time verification and ownership tracking</li>
              </ul>
              <h4 className="mt-4 fw-semibold">Why Blockchain?</h4>
              <p>
                Traditional systems rely heavily on manual paperwork, which often leads to delays, fraud, and data loss. Our solution uses blockchain’s decentralized ledger to create a tamper-proof record of every transaction, allowing all stakeholders to verify information anytime, from anywhere.
              </p>
              <h4 className="mt-4 fw-semibold">Who Is It For?</h4>
              <p>
                Our system is tailored for government officials, property buyers and sellers, lawyers, and anyone involved in the land registry process. Whether you’re in a rural village or an urban city, our platform is accessible 24/7.
              </p>
              <div className="text-center mt-5">
                <Link to="/" className="btn btn-primary px-5 py-2 rounded-pill shadow-sm">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
