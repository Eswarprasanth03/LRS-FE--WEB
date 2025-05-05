import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import Dashboard from "./components/Dashboard/MainDashBoard";
import SellerDashboard from "./components/Dashboard/SellerDashboard";
import BuyerDashboard from "./components/Dashboard/BuyerDashboard";
import AddLand from "./components/RegistrationPages/AddLand";
import Transaction from "./components/Transactions/BuyerTransactionHistory";
import BuyerProfile from "./components/profiles/BuyerProfile";
import SellerProfile from "./components/profiles/SellerProfile";
import SellerTransaction from "./components/Transactions/SellerTransactionsHistory";
import LandInspectorDashboard from "./components/Dashboard/LandInspectorDashboard";
import VerifyUser from "./components/Verifications/VerifyUsers";
import Services from "./components/Services/Services";
import ProtectedRoute from "./components/ProtectedRoute";
import YourLands from "./components/Lands/YourLands";
import VerifyLand from "./components/Verifications/VerifyLand";
import BuyLand from "./components/Lands/BuyLand";
import VerifyPurchases from "./components/Verifications/VerifyPurchases";
import LandPayment from "./components/Payment/LandPayment";
import BuyerTransaction from "./components/Transactions/BuyerTransactionHistory";
import TransferRequests from "./components/LandInspector/TransferRequests";
import OwnedLands from "./components/Lands/OwnedLands";
import TransferHistory from './components/LandInspector/TransferHistory';
import EscrowPayments from './components/Payment/EscrowPayments';
import BuyerNFTLands from "./components/NFT/BuyerNFT";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer";
import About from "./components/About";

import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <div className="content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<div className="page-enter-active"><Dashboard /></div>} />
            <Route path="/contact" element={<div className="page-enter-active"><Contact /></div>} />
            <Route path="/services" element={<div className="page-enter-active"><Services /></div>} />
            <Route path="/about" element={<div className="page-enter-active"><About /></div>} />
            <Route path="/escrow-payments" element={<EscrowPayments />} />
            <Route path="/seller-dashboard/:userId" element={<SellerDashboard />} />
            <Route path="/buyer-dashboard/:userId" element={<BuyerDashboard />} />
            <Route path="/transaction-history/:requestId" element={<Transaction />} />
            <Route path="/profile/:userId" element={<BuyerProfile />} />
            <Route path="/sell-land" element={<AddLand />} />
            <Route path="/buy-land" element={<BuyLand />} />
            <Route path="/seller-transaction-history" element={<SellerTransaction />} />
            <Route path="/profiles/:userId" element={<SellerProfile />} />
            <Route path="/verify-user" element={<VerifyUser />} />
            <Route path="/your-lands/:userId" element={<YourLands />} />
            <Route path="/admin-dashboard" element={<ProtectedRoute><LandInspectorDashboard /></ProtectedRoute>} />
            <Route path="/verify-land" element={<ProtectedRoute><VerifyLand /></ProtectedRoute>} />
            <Route path="/verify-purchases" element={<ProtectedRoute><VerifyPurchases /></ProtectedRoute>} />
            <Route path="/land-payment/:requestId" element={<LandPayment />} />
            <Route path="/buyer-transaction-history" element={<BuyerTransaction />} />
            <Route path="/transfer-ownership/" element={<TransferRequests/>} />
            <Route path="/owned-lands/:userId" element={<OwnedLands/>} />
            <Route path="/nft-lands/:userId" element={<BuyerNFTLands/>} />
            <Route path="/transfer-history" element={<ProtectedRoute allowedRole="landInspector"><TransferHistory /></ProtectedRoute>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
