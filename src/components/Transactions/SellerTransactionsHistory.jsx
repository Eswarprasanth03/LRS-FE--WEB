import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCheckCircle, FaEthereum, FaMapMarkerAlt } from "react-icons/fa";

function SellerTransaction() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    fetchTransactions();
  }, [userId]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/landRoute/user-transactions/${userId}`
      );
      // Filter for seller transactions only
      const sellerTransactions = response.data.filter(
        (transaction) => transaction.sellerId._id === userId
      );
      setTransactions(sellerTransactions);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" /></div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Land Sales History</h2>
      {transactions.length === 0 ? (
        <div className="alert alert-info">No sales transactions found.</div>
      ) : (
        <div className="row">
          {transactions.map((transaction) => (
            <div key={transaction._id} className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0">Land Sold</h5>
                    <span className="badge bg-success">
                      <FaCheckCircle className="me-1" />
                      Payment Received
                    </span>
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
                    <h6>Sale Details:</h6>
                    <p className="mb-1">
                      <FaEthereum className="me-2" />
                      Amount Received: ₹{transaction.amount.toLocaleString('en-IN')}
                    </p>
                    <p className="mb-1">
                      <strong>Sale Date:</strong>{' '}
                      {new Date(transaction.paymentDate).toLocaleDateString()}
                    </p>
                    <p className="mb-1 text-truncate">
                      <strong>Transaction Hash:</strong>{' '}
                      <a 
                        href={`https://sepolia.etherscan.io/tx/${transaction.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {transaction.transactionHash}
                      </a>
                    </p>
                  </div>

                  <div className="border-top pt-3">
                    <p className="text-success mb-0">
                      <FaCheckCircle className="me-2" />
                      Successfully sold to {transaction.buyerId.name}
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

export default SellerTransaction;