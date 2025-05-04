import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaIdCard } from "react-icons/fa";
import "./Profile.css";

const API_BASE_URL = 'https://lrs-final-back-1.onrender.com';

function BuyerProfile() {
  const { userId } = useParams();
  const [buyerData, setBuyerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBuyerData();
  }, [userId]);

  const fetchBuyerData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/buyerRouter/get-user/${userId}`
      );
      setBuyerData(response.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch buyer data");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <FaUser size={40} />
        </div>
        <h2>{buyerData?.name}</h2>
        <p className="profile-subtitle">Buyer Account</p>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <div className="section-header">
            <h3>Personal Information</h3>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <FaUser className="info-icon" />
              <div className="info-content">
                <label>Full Name</label>
                <p>{buyerData?.name}</p>
              </div>
            </div>
            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <div className="info-content">
                <label>Email Address</label>
                <p>{buyerData?.email}</p>
              </div>
            </div>
            <div className="info-item">
              <FaPhone className="info-icon" />
              <div className="info-content">
                <label>Phone Number</label>
                <p>{buyerData?.phone}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <div className="section-header">
            <h3>Government ID</h3>
          </div>
          <div className="id-image-container">
            {buyerData?.governmentId ? (
              <img
                src={buyerData.governmentId}
                alt="Government ID"
                className="id-image"
              />
            ) : (
              <div className="id-image-placeholder">
                <FaIdCard size={40} />
                <p>No government ID uploaded</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyerProfile;
