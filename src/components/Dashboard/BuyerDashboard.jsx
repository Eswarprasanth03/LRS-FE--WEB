import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import {
  FaSignOutAlt,
  FaLandmark,
  FaHistory,
  FaUser,
  FaExclamationCircle,
  FaCheckCircle,
  FaLock,
  FaCreditCard,
  FaHome,
  FaRupeeSign,
  FaChartLine,
  FaPercentage,
  FaExchangeAlt,
  FaShoppingCart,
  FaCoins, // Add NFT icon
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SellerDashboard.css";

function BuyerDashboard() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const location = useLocation();
  const [verificationStatus, setVerificationStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [buyerData, setBuyerData] = useState(null);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [statistics, setStatistics] = useState({
    totalLands: 0,
    totalPurchases: 0,
    totalValue: 0,
    successRate: 0,
    recentTransactions: [],
    monthlyStats: [],
    pendingPayments: 0
  });
  const [nftStats, setNftStats] = useState({
    totalMinted: 0,
    lastMinted: null
  });

  const fetchBuyerData = async () => {
    try {
      const response = await axios.get(
        `https://lrs-final-back-1.onrender.com/buyerRouter/get-user/${userId}`
      );
      console.log("Buyer data response:", response.data);
      setBuyerData(response.data);
      setVerificationStatus(response.data.isVerified || false);
    } catch (error) {
      console.error("Error fetching buyer data:", error);
      setBuyerData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBuyerStatistics = async () => {
    try {
      const response = await axios.get(
        `https://lrs-final-back-1.onrender.com/landRoute/buyer-statistics/${userId}`
      );
      console.log("Buyer statistics response:", response.data);
      if (response.data) {
        setStatistics({
          ...response.data,
          totalLands: response.data.totalLands || 0,
          totalPurchases: response.data.totalPurchases || 0,
          totalValue: response.data.totalValue || 0,
          successRate: response.data.successRate || 0,
          recentTransactions: response.data.recentTransactions || [],
          monthlyStats: response.data.monthlyStats || []
        });
      }
    } catch (error) {
      console.error("Error fetching buyer statistics:", error);
      setStatistics({
        totalLands: 0,
        totalPurchases: 0,
        totalValue: 0,
        successRate: 0,
        recentTransactions: [],
        monthlyStats: []
      });
    }
  };

  const fetchPendingPayments = async () => {
    try {
      const response = await axios.get(
        `https://lrs-final-back-1.onrender.com/landRoute/pending-payments/${userId}`
      );
      console.log("Pending payments response:", response.data);
      if (Array.isArray(response.data)) {
        setPendingPayments(response.data);
      } else {
        setPendingPayments([]);
      }
    } catch (error) {
      console.error("Error fetching pending payments:", error);
      setPendingPayments([]);
    }
  };

  const fetchNFTStats = async () => {
    try {
      const response = await axios.get(
        `https://lrs-final-back-1.onrender.com/landRoute/nft-stats/${userId}`
      );
      setNftStats({
        totalMinted: response.data.totalMinted || 0,
        lastMinted: response.data.lastMinted
      });
    } catch (error) {
      console.error("Error fetching NFT stats:", error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchBuyerData(),
          fetchPendingPayments(),
          fetchBuyerStatistics(),
          fetchNFTStats()
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchAllData();
    }
  }, [userId, location.key, refreshKey]);

  const handleLogout = () => {
    sessionStorage.removeItem("userId");
    navigate("/");
  };

  const refreshDashboard = async () => {
    setRefreshKey(prevKey => prevKey + 1);
    setIsLoading(true);
    try {
      await Promise.all([
        fetchBuyerData(),
        fetchPendingPayments(),
        fetchBuyerStatistics()
      ]);
    } catch (error) {
      console.error("Error refreshing dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const VerificationBadge = () => (
    <div
      className={`verification-badge ${
        verificationStatus ? "verified" : "unverified"
      }`}
    >
      {verificationStatus ? (
        <>
          <FaCheckCircle className="me-2" />
          <span>Verified Buyer</span>
        </>
      ) : (
        <>
          <FaExclamationCircle className="me-2" />
          <span>Pending Verification</span>
        </>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container">
          <h3 className="welcome-text">Welcome {buyerData?.name}</h3>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav align-items-center">
              <li className="nav-item me-3">
                <VerificationBadge />
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/buy-land">
                  <FaLandmark className="me-1" /> Buy Land
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/buyer-transaction-history">
                  <FaHistory className="me-1" /> Transaction History
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={`/owned-lands/${userId}`}>
                  <FaHome className="me-1" /> Your Lands
                </Link>
              </li>
              <li className="nav-item">
                {pendingPayments.length > 0 && (
                  <Link 
                    className="nav-link" 
                    to={`/land-payment/${pendingPayments[0]._id}`}
                  >
                    <FaCreditCard className="me-1" /> 
                    Pending Payment
                    <span className="badge bg-danger ms-2">
                      {pendingPayments.length}
                    </span>
                  </Link>
                )}
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={`/profile/${userId}`}>
                  <FaUser className="me-1" /> Profile
                </Link>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link border-0 bg-transparent"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="me-1" /> Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-5">
        {!verificationStatus && (
          <div className="alert alert-warning mb-4" role="alert">
            <FaExclamationCircle className="me-2" />
            <strong>Account Pending Verification:</strong> Your account is
            currently under review. Some features are restricted until a land
            inspector verifies your account.
          </div>
        )}

        <h1 className="text-center mb-5">Buyer Dashboard</h1>

        {/* Analytics Cards */}
        <div className="row g-4 mb-5">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">Total Lands</h6>
                    <h3 className="mb-0">4</h3>
                  </div>
                  <div className="bg-primary bg-opacity-10 p-3 rounded">
                    <FaHome className="text-primary fs-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">Total Purchases</h6>
                    <h3 className="mb-0">2</h3>
                  </div>
                  <div className="bg-success bg-opacity-10 p-3 rounded">
                    <FaShoppingCart className="text-success fs-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">Total Value</h6>
                    <h3 className="mb-0">
                      <FaRupeeSign className="fs-5" />
                      {203300045}
                    </h3>
                  </div>
                  <div className="bg-warning bg-opacity-10 p-3 rounded">
                    <FaChartLine className="text-warning fs-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">Success Rate</h6>
                    <h3 className="mb-0">71%</h3>
                  </div>
                  <div className="bg-info bg-opacity-10 p-3 rounded">
                    <FaPercentage className="text-info fs-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">NFTs Minted</h6>
                    <h3 className="mb-0">2</h3>
                  </div>
                  <div className="bg-info bg-opacity-10 p-3 rounded">
                    <FaCoins className="text-info fs-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="card-title mb-0">Recent Transactions</h5>
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={refreshDashboard}
                  >
                    <FaExchangeAlt className="me-1" />
                    Refresh
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Land</th>
                        <th>Seller</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statistics.recentTransactions.map((transaction) => (
                        <tr key={transaction._id}>
                          <td>{new Date(transaction.date).toLocaleDateString()}</td>
                          <td>{transaction.landLocation}</td>
                          <td>{transaction.sellerName}</td>
                          <td>
                            <FaRupeeSign className="fs-6" />
                            {new Intl.NumberFormat("en-IN").format(transaction.amount)}
                          </td>
                          <td>
                            <span className={`badge bg-${transaction.status === 'completed' ? 'success' : 'warning'}`}>
                              {transaction.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="row justify-content-center g-4">
          <div className="col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <FaLandmark className="card-icon mb-3 text-primary" size={24} />
                <h5 className="card-title">Buy Land</h5>
                <p className="card-text">
                  Browse and purchase available land properties.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <FaHistory className="card-icon mb-3 text-primary" size={24} />
                <h5 className="card-title">Transaction History</h5>
                <p className="card-text">
                  View your past land purchase transactions.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <FaUser className="card-icon mb-3 text-primary" size={24} />
                <h5 className="card-title">Profile Settings</h5>
                <p className="card-text">Manage your account information.</p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <Link to={`/nft-lands/${userId}`} className="text-decoration-none">
              <div className="card h-100">
                <div className="card-body text-center">
                  <FaCoins className="card-icon mb-3 text-primary" size={24} />
                  <h5 className="card-title">Mint NFTs</h5>
                  <p className="card-text">
                    Generate NFTs for your verified land properties.
                  </p>
                  {nftStats.lastMinted && (
                    <small className="text-muted">
                      Last minted: {new Date(nftStats.lastMinted).toLocaleDateString()}
                    </small>
                  )}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default BuyerDashboard;
