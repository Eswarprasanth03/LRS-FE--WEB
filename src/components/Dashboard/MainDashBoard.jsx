import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaIdCard, FaImage } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../CSS/MainDashboard.css";
import "../CSS/theme.css";
import "../CSS/animations.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [loginRole, setLoginRole] = useState("");
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
    // Clear admin session when visiting the main dashboard
    sessionStorage.removeItem("adminAddress");
  }, []);

  const handleInitialRoleSelect = (role) => {
    setSelectedRole(role);
    setShowRegistration(true);
    setFormData((prev) => ({ ...prev, userType: role }));
  };

  const handleLoginRoleSelect = (role) => {
    setLoginRole(role);
    setShowLoginForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      governmentIdImage: e.target.files[0],
    }));
  };
  const handleAdminMetaMaskLogin = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask to login as admin");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const address = accounts[0];
      const adminWallet = "0xf51Efb9dc6C62BE5F05A505bB0eA4D3848d029f1";

      if (address.toLowerCase() === adminWallet.toLowerCase()) {
        sessionStorage.setItem("adminAddress", address);
        navigate("/admin-dashboard");
      } else {
        alert("This wallet is not authorized as admin");
        sessionStorage.removeItem("adminAddress");
      }
    } catch (error) {
      console.error("MetaMask login error:", error);
      alert("Failed to connect to MetaMask");
      sessionStorage.removeItem("adminAddress");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (loginRole === "admin") {
        handleAdminMetaMaskLogin();
        return;
      }

      const endpoint =
        loginRole === "seller"
          ? "https://lrs-final-back-1.onrender.com/sellerRouter/login"
          : "https://lrs-final-back-1.onrender.com/buyerRouter/login";

      const response = await axios.post(endpoint, {
        email: loginData.email,
        password: loginData.password,
      });

      alert(response.data.message);

      const userId = response.data.userId;
      const email = response.data.email; // Add this line

      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("userEmail", email); // Add this line

      // Navigate to the Buyer Dashboard with the userId in the URL (fix space issue here)
      if (loginRole === "seller") {
        navigate(`/seller-dashboard/${userId}`);
      } else if (loginRole === "buyer") {
        navigate(`/buyer-dashboard/${userId}`); // Removed space here
      } else if (loginRole === "admin") {
        navigate("/admin-dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("Login failed. Please try again.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const endpoint =
        formData.userType === "seller"
          ? "https://lrs-final-back-1.onrender.com/sellerRouter/create-user"
          : formData.userType === "buyer"
          ? "https://lrs-final-back-1.onrender.com/buyerRouter/create-user"
         
          : null;

      if (!endpoint) {
        throw new Error("Invalid user type selected");
      }

      const response = await axios.post(endpoint, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Form submitted successfully:", response.data);
      alert("Registration successful!");
      // Clear form after successful registration
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
      setShowRegistration(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(error.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="main-dashboard">
      <div className="about-button">
        <Link to="/about" className="btn">
          About Our Site
        </Link>
      </div>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 text-center mb-5">
            <h1 className="display-4 text-light slide-in-left mb-2">Land Registry System</h1>
            <p className="lead text-light slide-in-right">Secure, transparent, and efficient land management</p>
          </div>
        </div>

        <div className="row g-4 justify-content-center">
          {/* Login Card */}
          <div className="col-md-5">
            <div className="auth-card card-hover p-4 slide-up">
              {!showLoginForm ? (
                <div className="text-center">
                  <h2 className="auth-title">Welcome Back!</h2>
                  <p className="auth-subtitle">Sign in to manage your land assets</p>
                  <div className="mb-4">
                    <label className="form-label">Choose Your Role</label>
                    <select
                      className="form-control form-focus-effect"
                      value={loginRole}
                      onChange={(e) => setLoginRole(e.target.value)}
                    >
                      <option value="">Select Role</option>
                      <option value="seller">Seller</option>
                      <option value="buyer">Buyer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <button
                    className="btn btn-primary btn-hover-slide w-100"
                    onClick={() =>
                      loginRole
                        ? handleLoginRoleSelect(loginRole)
                        : alert("Please select a role")
                    }
                  >
                    Continue to Login
                  </button>
                </div>
              ) : loginRole === "admin" ? (
                <div className="text-center">
                  <h2 className="auth-title">Admin Access</h2>
                  <p className="auth-subtitle">Connect your wallet to continue</p>
                  <button
                    className="metamask-button w-100 mb-3 hover-lift"
                    onClick={handleAdminMetaMaskLogin}
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                      alt="MetaMask"
                      className="metamask-icon"
                    />
                    Connect with MetaMask
                  </button>
                  <button
                    className="btn btn-secondary w-100 btn-hover-slide"
                    onClick={() => setShowLoginForm(false)}
                  >
                    Back to Selection
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="auth-title text-center mb-4">Login</h2>
                  <form onSubmit={handleLogin} className="fade-in">
                    <div className="mb-3">
                      <label className="form-label">
                        <FaEnvelope className="me-2 text-primary" />
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control form-focus-effect"
                        name="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label">
                        <FaLock className="me-2 text-primary" />
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control form-focus-effect"
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>
                    <div className="d-grid gap-2">
                      <button type="submit" className="btn btn-primary btn-hover-slide">
                        Sign In
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-hover-slide"
                        onClick={() => setShowLoginForm(false)}
                      >
                        Back to Selection
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Registration Card */}
          <div className="col-md-5">
            <div className="auth-card card-hover p-4 slide-up" style={{animationDelay: '0.2s'}}>
              {!showRegistration ? (
                <div className="text-center">
                  <h2 className="auth-title">New User?</h2>
                  <p className="auth-subtitle">Create your account in minutes</p>
                  <div className="mb-4">
                    <label className="form-label">Choose Your Role</label>
                    <select
                      className="form-control form-focus-effect"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    >
                      <option value="">Select Role</option>
                      <option value="seller">Seller</option>
                      <option value="buyer">Buyer</option>
                    </select>
                  </div>
                  <button
                    className="btn btn-primary btn-hover-slide w-100"
                    onClick={() =>
                      selectedRole
                        ? handleInitialRoleSelect(selectedRole)
                        : alert("Please select a role")
                    }
                  >
                    Get Started
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="auth-title text-center mb-4">Create Account</h2>
                  <form onSubmit={handleSubmit} className="fade-in">
                    <div className="mb-3">
                      <label className="form-label">
                        <FaUser className="me-2 text-primary" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control form-focus-effect"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">
                        <FaEnvelope className="me-2 text-primary" />
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control form-focus-effect"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        <FaLock className="me-2 text-primary" />
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control form-focus-effect"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        <FaPhone className="me-2 text-primary" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="form-control form-focus-effect"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        <FaMapMarkerAlt className="me-2 text-primary" />
                        Location
                      </label>
                      <input
                        type="text"
                        className="form-control form-focus-effect"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        <FaIdCard className="me-2 text-primary" />
                        Government ID
                      </label>
                      <input
                        type="text"
                        className="form-control form-focus-effect"
                        name="governmentId"
                        value={formData.governmentId}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label">
                        <FaImage className="me-2 text-primary" />
                        Government ID Image
                      </label>
                      <div className="file-input-wrapper hover-lift">
                        <div className="file-input-label">
                          <FaImage className="me-2" />
                          {formData.governmentIdImage
                            ? formData.governmentIdImage.name
                            : "Choose a file"}
                        </div>
                        <input
                          type="file"
                          className="form-control"
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                      </div>
                    </div>

                    <div className="d-grid gap-2">
                      <button type="submit" className="btn btn-primary btn-hover-slide">
                        Create Account
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-hover-slide"
                        onClick={() => setShowRegistration(false)}
                      >
                        Back to Selection
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
