import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      {/* <div className="footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>Your trusted platform for secure and efficient transactions.</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact Info</h3>
          <p>Email: support@example.com</p>
          <p>Phone: +1 234 567 890</p>
        </div>
      </div> */}
      <div className="footer-bottom">
        <p>
          &copy; 2025{" "}
          Built by {" "}
          <span className="team-initials" title="Teja">T</span> .{" "}
          <span className="team-initials" title="Eswar">E</span> .{" "}
          <span className="team-initials" title="Ankitha">A</span>
          , All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer; 