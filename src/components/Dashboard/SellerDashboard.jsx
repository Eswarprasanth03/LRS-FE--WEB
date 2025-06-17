import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import {
  FaSignOutAlt,
  FaLandmark,
  FaHistory,
  FaUser,
  FaExclamationCircle,
  FaCheckCircle,
  FaLock,
  FaList,
  FaHome,
  FaRupeeSign,
  FaChartLine,
  FaPercentage,
  FaUsers,
  FaExchangeAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SellerDashboard.css";

function SellerDashboard() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const location = useLocation();
  const [verificationStatus, setVerificationStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sellerData, setSellerData] = useState(null);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [statistics, setStatistics] = useState({
    totalLands: 0,
    totalSales: 0,
    totalValue: 0,
    successRate: 0,
    recentTransactions: [],
    monthlyStats: [],
  });
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchSellerData = async () => {
    try {
      const response = await axios.get(
        `https://lrs-final-back-1.onrender.com/sellerRouter/get-user/${userId}`
      );
      setSellerData(response.data);
      setVerificationStatus(response.data.isVerified || false);
    } catch (error) {
      console.error("Error fetching seller data:", error);
    }
  };

  const fetchSellerStatistics = async () => {
    try {
      const response = await axios.get(
        `https://lrs-final-back-1.onrender.com/landRoute/seller-statistics/${userId}`
      );
      setStatistics(response.data);
    } catch (error) {
      console.error("Error fetching seller statistics:", error);
    }
  };

  const fetchPendingPayments = async () => {
    try {
      const response = await axios.get(
        `https://lrs-final-back-1.onrender.com/landRoute/pending-payments/${userId}`
      );
      console.log("Pending payments response:", response.data);
      setPendingPayments(response.data);
    } catch (error) {
      console.error("Error fetching pending payments:", error);
      setPendingPayments([]);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchSellerData(),
          fetchPendingPayments(),
          fetchSellerStatistics()
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [userId, location.key, refreshKey]);

  const handleLogout = () => {
    sessionStorage.removeItem("userId");
    navigate("/");
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
          <span>Verified Seller</span>
        </>
      ) : (
        <>
          <FaExclamationCircle className="me-2" />
          <span>Pending Verification</span>
        </>
      )}
    </div>
  );

  const refreshDashboard = async () => {
    setRefreshKey(prevKey => prevKey + 1);
    setIsLoading(true);
    try {
      await Promise.all([
        fetchSellerData(),
        fetchPendingPayments(),
        fetchSellerStatistics()
      ]);
    } catch (error) {
      console.error("Error refreshing dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
          <h3 className="welcome-text">Welcome {sellerData?.name}</h3>
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
                {verificationStatus ? (
                  <Link className="nav-link" to="/sell-land">
                    <FaLandmark className="me-1" /> Sell Land
                  </Link>
                ) : (
                  <span
                    className="nav-link text-muted"
                    style={{ cursor: "not-allowed" }}
                  >
                    <FaLock className="me-1" /> Sell Land
                  </span>
                )}
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/seller-transaction-history">
                  <FaHistory className="me-1" /> Transaction History
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={`/your-lands/${userId}`}>
                  <FaList className="me-1" /> Your Lands
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={`/profiles/${userId}`}>
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

        <h1 className="text-center mb-5">Seller Dashboard</h1>

        {/* Analytics Cards */}
        <div className="row g-4 mb-5">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">Total Lands</h6>
                    <h3 className="mb-0">3</h3>
                  </div>
                  <div className="bg-primary bg-opacity-10 p-3 rounded">
                    <FaLandmark className="text-primary fs-4" />
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
                    <h6 className="text-muted mb-2">Total Sales</h6>
                    <h3 className="mb-0">2</h3>
                  </div>
                  <div className="bg-success bg-opacity-10 p-3 rounded">
                    <FaExchangeAlt className="text-success fs-4" />
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
                      10023532
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
                    <h3 className="mb-0">63%</h3>
                  </div>
                  <div className="bg-info bg-opacity-10 p-3 rounded">
                    <FaPercentage className="text-info fs-4" />
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
                <h5 className="card-title mb-4">Recent Transactions</h5>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Land</th>
                        <th>Buyer</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statistics.recentTransactions.map((transaction) => (
                        <tr key={transaction._id}>
                          <td>{new Date(transaction.date).toLocaleDateString()}</td>
                          <td>{transaction.landLocation}</td>
                          <td>{transaction.buyerName}</td>
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
            <div className={`card h-100 ${!verificationStatus ? "disabled" : ""}`}>
              <div className="card-body text-center">
                <FaLandmark className="card-icon mb-3 text-primary" size={24} />
                <h5 className="card-title">Sell Land</h5>
                <p className="card-text">
                  List and manage your land properties for sale.
                </p>
                {!verificationStatus && (
                  <div className="text-danger mt-2">
                    <FaLock className="me-1" />
                    Requires verification
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <FaHistory className="card-icon mb-3 text-primary" size={24} />
                <h5 className="card-title">Transaction History</h5>
                <p className="card-text">
                  View your past land sale transactions.
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
        </div>
      </div>
    </>
  );
}

export default SellerDashboard;
