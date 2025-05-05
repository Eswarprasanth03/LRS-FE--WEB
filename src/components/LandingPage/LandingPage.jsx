import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaCogs, FaEnvelope, FaUser, FaUserPlus, FaBars, FaTimes, FaSpinner, FaWallet } from 'react-icons/fa';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/theme.css';
import '../CSS/animations.css';
import '../CSS/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [loginRole, setLoginRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    location: "",
    userType: "",
    governmentId: "",
    governmentIdImage: null,
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.phoneNumber || 
        !formData.location || !formData.governmentId || !formData.governmentIdImage) {
      setError("All fields are required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (!formData.email.includes('@')) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.phoneNumber.match(/^\d{10}$/)) {
      setError("Please enter a valid 10-digit phone number");
      return false;
    }
    if (!formData.userType) {
      setError("Please select a user type");
      return false;
    }
    return true;
  };
  
const handleGoToDashboard = () => {
  navigate('/dashboard');
};

  const handleInitialRoleSelect = (role) => {
    clearMessages();
    setSelectedRole(role);
    setShowRegistration(true);
    setFormData((prev) => ({ ...prev, userType: role }));
  };

  const handleLoginRoleSelect = (role) => {
    clearMessages();
    setLoginRole(role);
    setShowLoginForm(true);
  };

  const handleChange = (e) => {
    clearMessages();
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginChange = (e) => {
    clearMessages();
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    clearMessages();
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError("Please upload an image file");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        governmentIdImage: file,
      }));
    }
  };

  const handleAdminMetaMaskLogin = async () => {
    try {
      setIsLoading(true);
      clearMessages();
      
      if (!window.ethereum) {
        throw new Error("Please install MetaMask to login as admin");
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const address = accounts[0];
      const adminWallet = "0xf51Efb9dc6C62BE5F05A505bB0eA4D3848d029f1";

      if (address.toLowerCase() === adminWallet.toLowerCase()) {
        sessionStorage.setItem("adminAddress", address);
        setSuccess("Successfully connected as admin");
        setTimeout(() => {
          navigate("/admin-dashboard");
        }, 1000);
      } else {
        throw new Error("This wallet is not authorized as admin");
      }
    } catch (error) {
      setError(error.message || "Failed to connect to MetaMask");
      sessionStorage.removeItem("adminAddress");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      clearMessages();

      if (!loginData.email || !loginData.password) {
        throw new Error("Please fill in all fields");
      }

      const endpoint =
        loginRole === "seller"
          ? "http://localhost:4000/sellerRouter/login"
          : "http://localhost:4000/buyerRouter/login";

      const response = await axios.post(endpoint, {
        email: loginData.email,
        password: loginData.password,
      });

      if (response.data.userId) {
        sessionStorage.setItem("userId", response.data.userId);
        sessionStorage.setItem("userEmail", loginData.email);
        sessionStorage.setItem("userType", loginRole);
        sessionStorage.setItem("isVerified", response.data.isVerified || false);

        setSuccess(response.data.message);

        setTimeout(() => {
          if (loginRole === "seller") {
            navigate(`/seller-dashboard/${response.data.userId}`);
          } else if (loginRole === "buyer") {
            navigate(`/buyer-dashboard/${response.data.userId}`);
          }
        }, 1000);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      clearMessages();

      if (!validateForm()) {
        return;
      }

      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'governmentIdImage' && formData[key]) {
          formDataToSend.append(key, formData[key]);
        } else if (key !== 'governmentIdImage') {
          formDataToSend.append(key, formData[key]);
        }
      });

      const endpoint =
        formData.userType === "seller"
          ? "http://localhost:4000/sellerRouter/create-user"
          : formData.userType === "buyer"
          ? "http://localhost:4000/buyerRouter/create-user"
          : null;

      if (!endpoint) {
        throw new Error("Invalid user type selected");
      }

      const response = await axios.post(endpoint, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data) {
        setSuccess("Registration successful! Please wait for verification.");
        
        setFormData({
          name: "",
          email: "",
          password: "",
          phoneNumber: "",
          location: "",
          userType: "",
          governmentId: "",
          governmentIdImage: null,
        });

        setTimeout(() => {
          setShowRegistration(false);
          setShowLoginForm(true);
          setLoginRole(formData.userType);
        }, 1500);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message.includes("duplicate key error")) {
        setError("Email or Government ID already exists");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderModalContent = () => {
    if (showLoginForm) {
      return (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Login</h3>
              <button onClick={() => setShowLoginForm(false)} className="close-btn">&times;</button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              {!loginRole ? (
                <div className="text-center">
                  <h4>Choose Your Role</h4>
                  <select
                    className="form-control mb-3"
                    value={loginRole}
                    onChange={(e) => setLoginRole(e.target.value)}
                  >
                    <option value="">Select Role</option>
                    <option value="seller">Seller</option>
                    <option value="buyer">Buyer</option>
                  </select>
                  <button
                    className="btn btn-primary"
                    onClick={() => loginRole ? handleLoginRoleSelect(loginRole) : setError("Please select a role")}
                    disabled={isLoading}
                  >
                    {isLoading ? <FaSpinner className="spinner" /> : "Continue"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                      {isLoading ? <FaSpinner className="spinner" /> : "Sign In"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowLoginForm(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (showRegistration) {
      return (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Register</h3>
              <button onClick={() => setShowRegistration(false)} className="close-btn">&times;</button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              {!selectedRole ? (
                <div className="text-center">
                  <h4>Choose Your Role</h4>
                  <select
                    className="form-control mb-3"
                    value={selectedRole}
                    onChange={(e) => {
                      const role = e.target.value;
                      setSelectedRole(role);
                      setFormData((prev) => ({ ...prev, userType: role }));
                    }}
                  >
                    <option value="">Select Role</option>
                    <option value="seller">Seller</option>
                    <option value="buyer">Buyer</option>
                  </select>
                  <button
                    className="btn btn-primary"
                    onClick={() => selectedRole ? handleInitialRoleSelect(selectedRole) : setError("Please select a role")}
                    disabled={isLoading}
                  >
                    {isLoading ? <FaSpinner className="spinner" /> : "Continue"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                    <small className="text-muted">Password must be at least 6 characters long</small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Government ID</label>
                    <input
                      type="text"
                      className="form-control"
                      name="governmentId"
                      value={formData.governmentId}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Government ID Image</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={handleFileChange}
                      accept="image/*"
                      required
                      disabled={isLoading}
                    />
                    <small className="text-muted">Maximum file size: 5MB. Accepted formats: JPG, PNG, GIF</small>
                  </div>
                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                      {isLoading ? <FaSpinner className="spinner" /> : "Create Account"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowRegistration(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
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
            
            {/* <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-light"
                onClick={() => handleLoginRoleSelect("")}
              >
                <FaUser className="me-1" /> Login
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => handleInitialRoleSelect("")}
              >
                <FaUserPlus className="me-1" /> Register
              </button>
              <button 
                className="btn btn-warning"
                onClick={handleAdminMetaMaskLogin}
              >
                <FaWallet className="me-1" /> Admin Login
              </button>
            </div> */}
          </div>
        </div>
      </nav>

      {/* Modals */}
      {renderModalContent()}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row min-vh-100 align-items-center">
            <div className="col-lg-6 slide-in-left">
              <h1 className="display-3 fw-bold text-light mb-4">
                Secure Your Land Assets with Blockchain Technology
              </h1>
              <p className="lead text-light mb-5">
                Experience the future of land registry with our secure, transparent, and efficient blockchain-based platform. 
                Protect your property rights and streamline transactions like never before.
              </p>
              <div className="d-flex gap-3">
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => handleGoToDashboard()}
                >
                  Get Started
                </button>
                <Link to="/about" className="btn btn-outline-light btn-lg">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block slide-in-right">
              <div className="hero-image">
                <img 
                  src={require('../../assets/LandPage.jpg')}
                  alt="Beautiful Land Property" 
                  className="img-fluid rounded shadow-lg blockchain-image" 
                  style={{
                    maxWidth: '108.8%',  // Increased from 103.6% by 5%
                    height: '436px',  // Increased from 415px by 5%
                    objectFit: 'cover',
                    borderRadius: '15px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                    animation: 'floatAnimation 6s ease-in-out infinite',
                    transform: 'rotate(-2deg)',
                    backgroundColor: '#fff',
                    margin: 'auto',
                    display: 'block'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <FaCogs />
                </div>
                <h3>Smart Contracts</h3>
                <p>Automated and secure land transactions through blockchain technology</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <FaUser />
                </div>
                <h3>User-Friendly</h3>
                <p>Intuitive interface designed for both technical and non-technical users</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <FaEnvelope />
                </div>
                <h3>24/7 Support</h3>
                <p>Round-the-clock assistance for all your land registry needs</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;