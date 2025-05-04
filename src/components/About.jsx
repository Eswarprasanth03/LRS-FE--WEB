import React from 'react';
import { Link } from 'react-router-dom';
import './CSS/MainDashboard.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="container py-5">
        <div className="card shadow-lg">
          <div className="card-body p-5">
            <h1 className="text-center mb-4">About Land Registry System</h1>
            
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <h3 className="mb-4">Our Mission</h3>
                <p className="lead">
                  The Land Registry System revolutionizes property management through blockchain technology, 
                  ensuring secure, transparent, and efficient land transactions in the digital age.
                </p>

                <h3 className="mb-4 mt-5">System Comparison</h3>
                <div className="table-responsive mb-5">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Feature / Functionality</th>
                        <th>Traditional System</th>
                        <th>Our Blockchain System</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Blockchain Use</td>
                        <td>Manual record keeping</td>
                        <td>Crypto payments and NFT ownership options</td>
                      </tr>
                      <tr>
                        <td>Smart Contract Integration</td>
                        <td>Not available</td>
                        <td>Smart contract escrow for secure transfers</td>
                      </tr>
                      <tr>
                        <td>Payment System</td>
                        <td>Traditional banking only</td>
                        <td>Cryptocurrency payment support</td>
                      </tr>
                      <tr>
                        <td>Digital Asset Integration</td>
                        <td>No digital assets</td>
                        <td>Optional: Land as NFT asset</td>
                      </tr>
                      <tr>
                        <td>Identity Verification</td>
                        <td>Basic paper verification</td>
                        <td>Photo verification before land release</td>
                      </tr>
                      <tr>
                        <td>Document Security</td>
                        <td>Physical storage</td>
                        <td>Document tamper-proofing with blockchain hashing</td>
                      </tr>
                      <tr>
                        <td>Verification Process</td>
                        <td>Manual offline verification</td>
                        <td>Online verification and approval system</td>
                      </tr>
                      <tr>
                        <td>Ownership History</td>
                        <td>Basic record keeping</td>
                        <td>Visual timeline of land ownership</td>
                      </tr>
                      <tr>
                        <td>User Trust System</td>
                        <td>Not available</td>
                        <td>Trust score system for buyers/sellers</td>
                      </tr>
                      <tr>
                        <td>Dispute Resolution</td>
                        <td>Manual offline process</td>
                        <td>Integrated dispute resolution module</td>
                      </tr>
                      <tr>
                        <td>Accessibility</td>
                        <td>Limited to office hours</td>
                        <td>24/7 access with rural accessibility support</td>
                      </tr>
                      <tr>
                        <td>Documentation</td>
                        <td>Manual paperwork</td>
                        <td>Auto-generated PDF after land release</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="mb-4 mt-5">Key Features</h3>
                <div className="features-grid">
                  <div className="feature-item">
                    <h4>Blockchain Security</h4>
                    <p>Immutable record-keeping and transparent transaction history</p>
                  </div>
                  <div className="feature-item">
                    <h4>Smart Verification</h4>
                    <p>Multi-step verification process for land ownership</p>
                  </div>
                  <div className="feature-item">
                    <h4>Digital Documentation</h4>
                    <p>Secure storage and management of property documents</p>
                  </div>
                  <div className="feature-item">
                    <h4>Real-time Tracking</h4>
                    <p>Monitor property transactions and verification status</p>
                  </div>
                </div>

                <h3 className="mb-4 mt-5">Why Choose Us</h3>
                <ul className="list-group list-group-flush mb-4">
                  <li className="list-group-item">Enhanced security through blockchain technology</li>
                  <li className="list-group-item">Streamlined property registration process</li>
                  <li className="list-group-item">Transparent transaction history</li>
                  <li className="list-group-item">Efficient verification system</li>
                  <li className="list-group-item">User-friendly interface</li>
                </ul>

                <div className="text-center mt-5">
                  <Link to="/" className="btn btn-primary btn-lg">
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;