import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>AAA Services Directory is your one-stop platform for discovering and booking professional services across various categories.</p>
          {/* <div className="social-links">
            <a href="/" className="social-link">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="/" className="social-link">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="/" className="social-link">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="/" className="social-link">
              <i className="fab fa-linkedin"></i>
            </a>
          </div> */}
           <div className="nav-links">
                      <Link to="/" className="nav-link"><i className="fab fa-facebook"></i></Link>
                      <Link to="/" className="nav-link"><i className="fab fa-twitter"></i></Link>
                      <Link to="/" className="nav-link"><i className="fab fa-instagram"></i></Link>
                      <Link to="/" className="nav-link"><i className="fab fa-linkedin"></i></Link>
                    </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
             <li><Link to="/" className="nav-link">Home</Link> </li> 
             <li><Link to="/services" className="nav-link">Services</Link> </li> 
             <li><Link to="/about" className="nav-link">About Us</Link> </li> 
             <li><Link to="/contact" className="nav-link">Contact</Link> </li> 
            {/* <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms & Conditions</a></li> */}
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <div className="contact-info">
            <div className="contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>Township, Lahore,Pakistan.</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <span>0308-6613608</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <span>haider.2002.786@gmail.com</span>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h3>Newsletter</h3>
          <p>Subscribe to our newsletter for latest updates and offers.</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="footer-logo">
            <span className="logo-text">AAA</span>
            <span className="logo-subtitle">Services Directory</span>
          </div>
          <div className="footer-copyright">
            <p>&copy; {new Date().getFullYear()} AAA Services Directory. All rights reserved.</p>
            <div className="footer-links">
              <a href="#privacy">Privacy Policy</a>
              <span>|</span>
              <a href="#terms">Terms & Conditions</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;