import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUser, FaEnvelope, FaLock, FaPhone,
  FaMapMarkerAlt, FaIdCard, FaImage, FaEye, FaEyeSlash
} from "react-icons/fa";
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
  const [previewImage, setPreviewImage] = useState(null);
  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Password validation state
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    sessionStorage.removeItem("adminAddress");
  }, []);
  
  // Check if passwords match whenever either password field changes
  useEffect(() => {
    if (formData.confirmPassword) {
      setPasswordsMatch(formData.password === formData.confirmPassword);
    } else {
      setPasswordsMatch(true); // Don't show error if confirm password is empty
    }
  }, [formData.password, formData.confirmPassword]);

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      governmentIdImage: file,
    }));
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleAdminMetaMaskLogin = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask to login as admin");
        return;
      }

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
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

      const endpoint = loginRole === "seller"
        ? "http://localhost:4000/sellerRouter/login"
        : "http://localhost:4000/buyerRouter/login";

      const response = await axios.post(endpoint, {
        email: loginData.email,
        password: loginData.password,
      });

      alert(response.data.message);

      const { userId, email } = response.data;
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("userEmail", email);

      if (loginRole === "seller") {
        navigate(`/seller-dashboard/${userId}`);
      } else if (loginRole === "buyer") {
        navigate(`/buyer-dashboard/${userId}`);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match. Please check and try again.");
      return;
    }

    const formDataToSend = new FormData();
    // Remove confirmPassword so it's not sent to the server
    const { confirmPassword, ...dataToSend } = formData;
    
    Object.keys(dataToSend).forEach((key) => {
      formDataToSend.append(key, dataToSend[key]);
    });

    try {
      const endpoint = formData.userType === "seller"
        ? "http://localhost:4000/sellerRouter/create-user"
        : formData.userType === "buyer"
        ? "http://localhost:4000/buyerRouter/create-user"
        : null;

      if (!endpoint) throw new Error("Invalid user type selected");

      const response = await axios.post(endpoint, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Registration successful!");
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        location: "",
        userType: "",
        governmentId: "",
        governmentIdImage: null,
      });
      setPreviewImage(null);
      setShowRegistration(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(error.message || "Registration failed. Please try again.");
    }
  };

  // Toggle password visibility functions
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  const toggleLoginPasswordVisibility = () => {
    setShowLoginPassword(!showLoginPassword);
  };

  return (
    <div className="main-dashboard">
      <div className="about-button">
        <Link to="/about" className="btn">About Our Site</Link>
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
                  <select className="form-control mb-3"
                    value={loginRole}
                    onChange={(e) => setLoginRole(e.target.value)}
                  >
                    <option value="">Select Role</option>
                    <option value="seller">Seller</option>
                    <option value="buyer">Buyer</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button className="btn btn-primary w-100"
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
                  <button className="metamask-button w-100 mb-3 hover-lift" onClick={handleAdminMetaMaskLogin}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                      alt="MetaMask"
                      className="metamask-icon"
                    />
                    Connect with MetaMask
                  </button>
                  <button className="btn btn-secondary w-100" onClick={() => setShowLoginForm(false)}>Back</button>
                </div>
              ) : (
                <form onSubmit={handleLogin}>
                  <h2 className="auth-title text-center mb-4">Login</h2>
                  <div className="mb-3">
                    <label><FaEnvelope className="me-2 text-primary" />Email</label>
                    <input type="email" className="form-control" name="email" value={loginData.email} onChange={handleLoginChange} required />
                  </div>
                  <div className="mb-4 position-relative">
                    <label><FaLock className="me-2 text-primary" />Password</label>
                    <div className="input-group">
                      <input 
                        type={showLoginPassword ? "text" : "password"} 
                        className="form-control" 
                        name="password" 
                        value={loginData.password} 
                        onChange={handleLoginChange} 
                        required 
                      />
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary" 
                        onClick={toggleLoginPasswordVisibility}
                      >
                        {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary">Sign In</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowLoginForm(false)}>Back</button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Registration Card */}
          <div className="col-md-5">
            <div className="auth-card card-hover p-4 slide-up" style={{ animationDelay: '0.2s' }}>
              {!showRegistration ? (
                <div className="text-center">
                  <h2 className="auth-title">New User?</h2>
                  <p className="auth-subtitle">Create your account in minutes</p>
                  <select className="form-control mb-3"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    <option value="">Select Role</option>
                    <option value="seller">Seller</option>
                    <option value="buyer">Buyer</option>
                  </select>
                  <button className="btn btn-primary w-100"
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
                <form onSubmit={handleSubmit}>
                  <h2 className="auth-title text-center mb-4">Create Account</h2>

                  <div className="mb-3">
                    <label><FaUser className="me-2 text-primary" />Full Name</label>
                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                  </div>

                  <div className="mb-3">
                    <label><FaEnvelope className="me-2 text-primary" />Email</label>
                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                  </div>

                  <div className="mb-3">
                    <label><FaLock className="me-2 text-primary" />Password</label>
                    <div className="input-group">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        className="form-control" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        required 
                      />
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary" 
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label><FaLock className="me-2 text-primary" />Confirm Password</label>
                    <div className="input-group">
                      <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        className={`form-control ${formData.confirmPassword && !passwordsMatch ? 'is-invalid' : ''}`}
                        name="confirmPassword" 
                        value={formData.confirmPassword} 
                        onChange={handleChange} 
                        required 
                      />
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary" 
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {formData.confirmPassword && !passwordsMatch && (
                      <div className="invalid-feedback d-block">
                        Passwords do not match
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label><FaPhone className="me-2 text-primary" />Phone Number</label>
                    <input type="tel" className="form-control" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                  </div>

                  <div className="mb-3">
                    <label><FaMapMarkerAlt className="me-2 text-primary" />Location</label>
                    <input type="text" className="form-control" name="location" value={formData.location} onChange={handleChange} />
                  </div>

                  <div className="mb-3">
                    <label><FaIdCard className="me-2 text-primary" />Government ID</label>
                    <input type="text" className="form-control" name="governmentId" value={formData.governmentId} onChange={handleChange} />
                  </div>

                  <div className="mb-3">
                    <label><FaImage className="me-2 text-primary" />Upload ID Image</label>
                    <input type="file" className="form-control" onChange={handleFileChange} accept="image/*" />
                    {previewImage && (
                      <img src={previewImage} alt="Preview" className="img-thumbnail mt-2" style={{ maxHeight: "150px" }} />
                    )}
                  </div>

                  <div className="d-grid gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={formData.confirmPassword && !passwordsMatch}
                    >
                      Create Account
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => {
                      setShowRegistration(false);
                      setPreviewImage(null);
                    }}>
                      Back
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;



// import axios from "axios";
// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import {
//   FaUser, FaEnvelope, FaLock, FaPhone,
//   FaMapMarkerAlt, FaIdCard, FaImage
// } from "react-icons/fa";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../CSS/MainDashboard.css";
// import "../CSS/theme.css";
// import "../CSS/animations.css";

// const Dashboard = () => {
//   const navigate = useNavigate();

//   const [showRegistration, setShowRegistration] = useState(false);
//   const [showLoginForm, setShowLoginForm] = useState(false);
//   const [selectedRole, setSelectedRole] = useState("");
//   const [loginRole, setLoginRole] = useState("");
//   const [previewImage, setPreviewImage] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     phoneNumber: "",
//     location: "",
//     userType: "",
//     governmentId: "",
//     governmentIdImage: null,
//   });

//   const [loginData, setLoginData] = useState({
//     email: "",
//     password: "",
//   });

//   useEffect(() => {
//     sessionStorage.removeItem("adminAddress");
//   }, []);

//   const handleInitialRoleSelect = (role) => {
//     setSelectedRole(role);
//     setShowRegistration(true);
//     setFormData((prev) => ({ ...prev, userType: role }));
//   };

//   const handleLoginRoleSelect = (role) => {
//     setLoginRole(role);
//     setShowLoginForm(true);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleLoginChange = (e) => {
//     const { name, value } = e.target;
//     setLoginData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setFormData((prev) => ({
//       ...prev,
//       governmentIdImage: file,
//     }));
//     setPreviewImage(URL.createObjectURL(file));
//   };

//   const handleAdminMetaMaskLogin = async () => {
//     try {
//       if (!window.ethereum) {
//         alert("Please install MetaMask to login as admin");
//         return;
//       }

//       const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
//       const address = accounts[0];
//       const adminWallet = "0xf51Efb9dc6C62BE5F05A505bB0eA4D3848d029f1";

//       if (address.toLowerCase() === adminWallet.toLowerCase()) {
//         sessionStorage.setItem("adminAddress", address);
//         navigate("/admin-dashboard");
//       } else {
//         alert("This wallet is not authorized as admin");
//         sessionStorage.removeItem("adminAddress");
//       }
//     } catch (error) {
//       console.error("MetaMask login error:", error);
//       alert("Failed to connect to MetaMask");
//       sessionStorage.removeItem("adminAddress");
//     }
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       if (loginRole === "admin") {
//         handleAdminMetaMaskLogin();
//         return;
//       }

//       const endpoint = loginRole === "seller"
//         ? "http://localhost:4000/sellerRouter/login"
//         : "http://localhost:4000/buyerRouter/login";

//       const response = await axios.post(endpoint, {
//         email: loginData.email,
//         password: loginData.password,
//       });

//       alert(response.data.message);

//       const { userId, email } = response.data;
//       sessionStorage.setItem("userId", userId);
//       sessionStorage.setItem("userEmail", email);

//       if (loginRole === "seller") {
//         navigate(`/seller-dashboard/${userId}`);
//       } else if (loginRole === "buyer") {
//         navigate(`/buyer-dashboard/${userId}`);
//       }
//     } catch (error) {
//       alert(error.response?.data?.message || "Login failed. Please try again.");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formDataToSend = new FormData();
//     Object.keys(formData).forEach((key) => {
//       formDataToSend.append(key, formData[key]);
//     });

//     try {
//       const endpoint = formData.userType === "seller"
//         ? "http://localhost:4000/sellerRouter/create-user"
//         : formData.userType === "buyer"
//         ? "http://localhost:4000/buyerRouter/create-user"
//         : null;

//       if (!endpoint) throw new Error("Invalid user type selected");

//       const response = await axios.post(endpoint, formDataToSend, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       alert("Registration successful!");
//       setFormData({
//         name: "",
//         email: "",
//         password: "",
//         phoneNumber: "",
//         location: "",
//         userType: "",
//         governmentId: "",
//         governmentIdImage: null,
//       });
//       setPreviewImage(null);
//       setShowRegistration(false);
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       alert(error.message || "Registration failed. Please try again.");
//     }
//   };

//   return (
//     <div className="main-dashboard">
//       <div className="about-button">
//         <Link to="/about" className="btn">About Our Site</Link>
//       </div>

//       <div className="container py-5">
//         <div className="row justify-content-center">
//           <div className="col-12 text-center mb-5">
//             <h1 className="display-4 text-light slide-in-left mb-2">Land Registry System</h1>
//             <p className="lead text-light slide-in-right">Secure, transparent, and efficient land management</p>
//           </div>
//         </div>

//         <div className="row g-4 justify-content-center">
//           {/* Login Card */}
//           <div className="col-md-5">
//             <div className="auth-card card-hover p-4 slide-up">
//               {!showLoginForm ? (
//                 <div className="text-center">
//                   <h2 className="auth-title">Welcome Back!</h2>
//                   <p className="auth-subtitle">Sign in to manage your land assets</p>
//                   <select className="form-control mb-3"
//                     value={loginRole}
//                     onChange={(e) => setLoginRole(e.target.value)}
//                   >
//                     <option value="">Select Role</option>
//                     <option value="seller">Seller</option>
//                     <option value="buyer">Buyer</option>
//                     <option value="admin">Admin</option>
//                   </select>
//                   <button className="btn btn-primary w-100"
//                     onClick={() =>
//                       loginRole
//                         ? handleLoginRoleSelect(loginRole)
//                         : alert("Please select a role")
//                     }
//                   >
//                     Continue to Login
//                   </button>
//                 </div>
//               ) : loginRole === "admin" ? (
//                 <div className="text-center">
//                   <h2 className="auth-title">Admin Access</h2>
//                   <p className="auth-subtitle">Connect your wallet to continue</p>
//                   <button className="metamask-button w-100 mb-3 hover-lift" onClick={handleAdminMetaMaskLogin}>
//                     <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
//                       alt="MetaMask"
//                       className="metamask-icon"
//                     />
//                     Connect with MetaMask
//                   </button>
//                   <button className="btn btn-secondary w-100" onClick={() => setShowLoginForm(false)}>Back</button>
//                 </div>
//               ) : (
//                 <form onSubmit={handleLogin}>
//                   <h2 className="auth-title text-center mb-4">Login</h2>
//                   <div className="mb-3">
//                     <label><FaEnvelope className="me-2 text-primary" />Email</label>
//                     <input type="email" className="form-control" name="email" value={loginData.email} onChange={handleLoginChange} required />
//                   </div>
//                   <div className="mb-4">
//                     <label><FaLock className="me-2 text-primary" />Password</label>
//                     <input type="password" className="form-control" name="password" value={loginData.password} onChange={handleLoginChange} required />
//                   </div>
//                   <div className="d-grid gap-2">
//                     <button type="submit" className="btn btn-primary">Sign In</button>
//                     <button type="button" className="btn btn-secondary" onClick={() => setShowLoginForm(false)}>Back</button>
//                   </div>
//                 </form>
//               )}
//             </div>
//           </div>

//           {/* Registration Card */}
//           <div className="col-md-5">
//             <div className="auth-card card-hover p-4 slide-up" style={{ animationDelay: '0.2s' }}>
//               {!showRegistration ? (
//                 <div className="text-center">
//                   <h2 className="auth-title">New User?</h2>
//                   <p className="auth-subtitle">Create your account in minutes</p>
//                   <select className="form-control mb-3"
//                     value={selectedRole}
//                     onChange={(e) => setSelectedRole(e.target.value)}
//                   >
//                     <option value="">Select Role</option>
//                     <option value="seller">Seller</option>
//                     <option value="buyer">Buyer</option>
//                   </select>
//                   <button className="btn btn-primary w-100"
//                     onClick={() =>
//                       selectedRole
//                         ? handleInitialRoleSelect(selectedRole)
//                         : alert("Please select a role")
//                     }
//                   >
//                     Get Started
//                   </button>
//                 </div>
//               ) : (
//                 <form onSubmit={handleSubmit}>
//                   <h2 className="auth-title text-center mb-4">Create Account</h2>

//                   <div className="mb-3">
//                     <label><FaUser className="me-2 text-primary" />Full Name</label>
//                     <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
//                   </div>

//                   <div className="mb-3">
//                     <label><FaEnvelope className="me-2 text-primary" />Email</label>
//                     <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
//                   </div>

//                   <div className="mb-3">
//                     <label><FaLock className="me-2 text-primary" />Password</label>
//                     <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
//                   </div>

//                   <div className="mb-3">
//                     <label><FaPhone className="me-2 text-primary" />Phone Number</label>
//                     <input type="tel" className="form-control" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
//                   </div>

//                   <div className="mb-3">
//                     <label><FaMapMarkerAlt className="me-2 text-primary" />Location</label>
//                     <input type="text" className="form-control" name="location" value={formData.location} onChange={handleChange} />
//                   </div>

//                   <div className="mb-3">
//                     <label><FaIdCard className="me-2 text-primary" />Government ID</label>
//                     <input type="text" className="form-control" name="governmentId" value={formData.governmentId} onChange={handleChange} />
//                   </div>

//                   <div className="mb-3">
//                     <label><FaImage className="me-2 text-primary" />Upload ID Image</label>
//                     <input type="file" className="form-control" onChange={handleFileChange} accept="image/*" />
//                     {previewImage && (
//                       <img src={previewImage} alt="Preview" className="img-thumbnail mt-2" style={{ maxHeight: "150px" }} />
//                     )}
//                   </div>

//                   <div className="d-grid gap-2">
//                     <button type="submit" className="btn btn-primary">Create Account</button>
//                     <button type="button" className="btn btn-secondary" onClick={() => {
//                       setShowRegistration(false);
//                       setPreviewImage(null);
//                     }}>
//                       Back
//                     </button>
//                   </div>
//                 </form>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
