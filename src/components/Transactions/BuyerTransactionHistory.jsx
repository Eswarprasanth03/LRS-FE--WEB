import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaCheckCircle, FaEthereum, FaMapMarkerAlt, FaClock, FaExchangeAlt, FaSync } from "react-icons/fa";
import "../CSS/BuyerTransactionHistory.css";

function BuyerTransaction() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const userId = sessionStorage.getItem("userId");

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://lrs-final-back-1.onrender.com/landRoute/user-transactions/${userId}`
      );
      // Filter for buyer transactions only
      const buyerTransactions = response.data.filter(
        (transaction) => transaction.buyerId._id === userId
      );
      setTransactions(buyerTransactions);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success';
      case 'inEscrow':
        return 'bg-warning';
      case 'releasedToSeller':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="me-1" />;
      case 'inEscrow':
        return <FaClock className="me-1" />;
      case 'releasedToSeller':
        return <FaExchangeAlt className="me-1" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'inEscrow':
        return 'In Escrow';
      case 'releasedToSeller':
        return 'Released to Seller';
      default:
        return 'Processing';
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Purchase History</h2>
        <button 
          className={`btn btn-outline-primary ${refreshing ? 'disabled' : ''}`}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <FaSync className={`me-2 ${refreshing ? 'spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      {transactions.length === 0 ? (
        <div className="alert alert-info">No purchase transactions found.</div>
      ) : (
        <div className="row">
          {transactions.map((transaction) => (
            <div key={transaction._id} className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0">Land Purchased</h5>
                    <div>
                      <span className={`badge ${getStatusBadgeClass(transaction.status)} me-2`}>
                        {getStatusIcon(transaction.status)}
                        {getStatusText(transaction.status)}
                      </span>
                      {transaction.paymentType === 'escrow' && (
                        <span className="badge bg-info">
                          <FaEthereum className="me-1" />
                          Escrow Payment
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <h6>Land Details:</h6>
                    <p className="mb-1">
                      <FaMapMarkerAlt className="me-2" />
                      {transaction.landId.location}
                    </p>
                    <p className="mb-1">
                      <strong>Survey Number:</strong> {transaction.landId.surveyNumber}
                    </p>
                    <p className="mb-1">
                      <strong>Area:</strong> {transaction.landId.area} sq ft
                    </p>
                  </div>

                  <div className="mb-3">
                    <h6>Transaction Details:</h6>
                    <p className="mb-1">
                      <FaEthereum className="me-2" />
                      Price: ₹{transaction.amount.toLocaleString('en-IN')}
                    </p>
                    <p className="mb-1">
                      <strong>Date:</strong>{' '}
                      {new Date(transaction.paymentDate).toLocaleDateString()}
                    </p>
                    <p className="mb-1">
                      <strong>Payment Type:</strong>{' '}
                      <span className={`badge ${transaction.paymentType === 'escrow' ? 'bg-info' : 'bg-primary'}`}>
                        {transaction.paymentType === 'escrow' ? 'Escrow Payment' : 'Direct Payment'}
                      </span>
                    </p>
                    {transaction.transactionHash && (
                      <p className="mb-1 text-truncate">
                        <strong>Transaction Hash:</strong>{' '}
                        <a 
                          href={`https://sepolia.etherscan.io/tx/${transaction.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary"
                        >
                          {transaction.transactionHash}
                        </a>
                      </p>
                    )}
                  </div>

                  <div className="border-top pt-3">
                    {transaction.paymentType === 'escrow' && (
                      <div className="alert alert-info py-2 mb-2">
                        {transaction.status === 'inEscrow' ? (
                          <>
                            <FaClock className="me-2" />
                            Payment sent to Land Inspector. Waiting for verification and release to seller.
                          </>
                        ) : transaction.status === 'releasedToSeller' ? (
                          <>
                            <FaExchangeAlt className="me-2" />
                            Payment has been released by Land Inspector
                          </>
                        ) : (
                          <>
                            <FaCheckCircle className="me-2" />
                            Transaction completed
                          </>
                        )}
                      </div>
                    )}
                    <p className={`mb-0 ${transaction.status === 'completed' ? 'text-success' : 'text-muted'}`}>
                      <FaCheckCircle className="me-2" />
                      Purchased from {transaction.sellerId.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BuyerTransaction;