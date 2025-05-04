import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaUserTie, FaUserShield, FaSpinner, FaWallet } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../CSS/Login.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
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
  const [adminWalletAddress, setAdminWalletAddress] = useState("");

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
      setIsLoading(true);
      setError("");
      setSuccess("");

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
      setError("");
      setSuccess("");

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
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const registrationEndpoint =
        formData.userType === "seller"
          ? "http://localhost:4000/sellerRouter/create-user"
          : formData.userType === "buyer"
          ? "http://localhost:4000/buyerRouter/create-user"
          : formData.userType === "admin"
          ? "http://localhost:4000/adminRoute/create-user"
          : null;

      if (!registrationEndpoint) {
        throw new Error("Invalid user type selected");
      }

      const response = await axios.post(registrationEndpoint, formDataToSend, {
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

  const renderLoginForm = () => {
    if (loginRole === "admin") {
      return (
        <div className="text-center">
          <h2 className="mb-4">Admin Login</h2>
          <p className="mb-4">Connect with MetaMask to access admin panel</p>
          <button
            className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={handleAdminMetaMaskLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <FaSpinner className="spinner" />
            ) : (
              <>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                  alt="MetaMask"
                  style={{ width: "24px", height: "24px" }}
                />
                Connect MetaMask
              </>
            )}
          </button>
          <button
            type="button"
            className="btn btn-secondary mt-3 w-100"
            onClick={() => setShowLoginForm(false)}
            disabled={isLoading}
          >
            Back
          </button>
        </div>
      );
    }

    return (
      <>
        <div className="login-header">
          <h2>Welcome Back!</h2>
          <p>Please sign in to continue</p>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={loginData.email}
              onChange={handleLoginChange}
              required
              disabled={isLoading}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              required
              disabled={isLoading}
              placeholder="Enter your password"
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
              Back
            </button>
          </div>
        </form>
      </>
    );
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {!showLoginForm ? (
          <div className="text-center">
            <div className="login-header">
              <h2>Welcome</h2>
              <p>Choose your role to continue</p>
            </div>
            <div className="role-selector">
              <div
                className={`role-option ${loginRole === "seller" ? "active" : ""}`}
                onClick={() => setLoginRole("seller")}
              >
                <FaUser className="role-icon" />
                <h4>Seller</h4>
                <p>List and manage properties</p>
              </div>
              <div
                className={`role-option ${loginRole === "buyer" ? "active" : ""}`}
                onClick={() => setLoginRole("buyer")}
              >
                <FaUserTie className="role-icon" />
                <h4>Buyer</h4>
                <p>Browse and purchase properties</p>
              </div>
              <div
                className={`role-option ${loginRole === "admin" ? "active" : ""}`}
                onClick={() => setLoginRole("admin")}
              >
                <FaUserShield className="role-icon" />
                <h4>Admin</h4>
                <p>Manage the platform</p>
              </div>
            </div>
            <button
              className="btn btn-primary"
              onClick={() =>
                loginRole
                  ? handleLoginRoleSelect(loginRole)
                  : setError("Please select a role")
              }
              disabled={isLoading}
            >
              {isLoading ? <FaSpinner className="spinner" /> : "Continue"}
            </button>
          </div>
        ) : (
          renderLoginForm()
        )}
      </div>
      <div
        className="card p-4"
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "10px",
        }}
      >
        {!showRegistration ? (
          <div className="text-center">
            <h2 className="mb-4">Register</h2>
            <h4 className="mb-4">Join the Digital Era!</h4>
            <div className="mb-3">
              <label className="form-label">Select Role</label>
              <select
                className="form-select mb-3"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="">Select Role</option>
                <option value="seller">Seller</option>
                <option value="buyer">Buyer</option>
              </select>
            </div>
            <button
              className="btn btn-primary w-100"
              onClick={() =>
                selectedRole
                  ? handleInitialRoleSelect(selectedRole)
                  : alert("Please select a role")
              }
            >
              Register
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-center mb-4">Registration Form</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name*
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email*
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password*
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phoneNumber" className="form-label">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="location" className="form-label">
                  Location
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="governmentId" className="form-label">
                  Government ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="governmentId"
                  name="governmentId"
                  value={formData.governmentId}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="governmentIdImage" className="form-label">
                  Government ID Image
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="governmentIdImage"
                  name="governmentIdImage"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary">
                  Register
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowRegistration(false)}
                >
                  Back
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
