import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-logo">
              <FaHeart className="logo-icon" />
              <span>PawFund</span>
            </div>
            <p className="footer-description">
              Nền tảng nhận nuôi thú cưng hàng đầu Việt Nam. 
              Chúng tôi kết nối những người yêu thú cưng với những chú thú cưng cần một mái ấm.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">
                <FaFacebook />
              </a>
              <a href="#" className="social-link">
                <FaTwitter />
              </a>
              <a href="#" className="social-link">
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3>Liên kết nhanh</h3>
            <ul className="footer-links">
              <li>
                <Link to="/">Trang chủ</Link>
              </li>
              <li>
                <Link to="/pets">Thú cưng</Link>
              </li>
              <li>
                <Link to="/events">Sự kiện</Link>
              </li>
              <li>
                <Link to="/donations">Quyên góp</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h3>Dịch vụ</h3>
            <ul className="footer-links">
              <li>
                <Link to="/adoptions">Nhận nuôi thú cưng</Link>
              </li>
              <li>
                <Link to="/donations">Quyên góp từ thiện</Link>
              </li>
              <li>
                <Link to="/events">Sự kiện cộng đồng</Link>
              </li>
              <li>
                <Link to="/profile">Hồ sơ cá nhân</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3>Liên hệ</h3>
            <div className="contact-info">
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <span>+84 123 456 789</span>
              </div>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span>info@pawfund.vn</span>
              </div>
              <div className="contact-item">
                <span>123 Đường ABC, Quận 1, TP.HCM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2024 PawFund. Tất cả quyền được bảo lưu.</p>
            <div className="footer-bottom-links">
              <Link to="/privacy">Chính sách bảo mật</Link>
              <Link to="/terms">Điều khoản sử dụng</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 