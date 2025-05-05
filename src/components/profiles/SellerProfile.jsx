import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaIdCard } from "react-icons/fa";
import "./Profile.css";

const API_BASE_URL = 'http://localhost:4000';

function SellerProfile() {
  const { userId } = useParams();
  const [sellerData, setSellerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSellerData();
  }, [userId]);

  const fetchSellerData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/sellerRouter/get-user/${userId}`
      );
      setSellerData(response.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch seller data");
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
        <h2>{sellerData?.name}</h2>
        <p className="profile-subtitle">Seller Account</p>
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
                <p>{sellerData?.name}</p>
              </div>
            </div>
            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <div className="info-content">
                <label>Email Address</label>
                <p>{sellerData?.email}</p>
              </div>
            </div>
            <div className="info-item">
              <FaPhone className="info-icon" />
              <div className="info-content">
                <label>Phone Number</label>
                <p>{sellerData?.phoneNumber}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <div className="section-header">
            <h3>Government ID</h3>
            <p className="text-muted small">Document Number: {sellerData?.governmentId}</p>
          </div>
          <div className="id-image-container">
            {sellerData?.governmentIdImage?.data ? (
              <img
                src={`data:${sellerData.governmentIdImage.contentType};base64,${sellerData.governmentIdImage.data}`}
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

export default SellerProfile;