import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, useCart } from '../../hook';
import { useAuthContext } from '../../contexts/AuthContext';

import { fetchGuestCart, mergeCart, fetchUserCart } from '../../store/asyncAction/cartAsyncAction';
import { useAppDispatch } from '../../hook';
import { toast } from 'react-toastify';
import { FaUser, FaShoppingCart, FaHeart, FaSignOutAlt, FaBars, FaTimes, FaCog, FaUsers, FaPaw, FaHandHoldingHeart, FaCalendar } from 'react-icons/fa';

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { userCart, guestCart } = useCart();
  const authContext = useAuthContext();
  const { 
    userRole,
    handleLogout 
  } = authContext;
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load guest cart for guests
  useEffect(() => {
    if (!isAuthenticated) {
      const guestToken = localStorage.getItem('guestCartToken');
      if (guestToken) {
        dispatch(fetchGuestCart(guestToken));
      }
    } else {
      // Check for guest cart merge if user is authenticated
      const guestToken = localStorage.getItem('guestCartToken');
      if (guestToken) {
        console.log('=== Header: Found guest cart, attempting merge ===');
        dispatch(mergeCart(guestToken))
          .unwrap()
          .then(() => {
            console.log('Cart merged successfully from Header');
            toast.success('Đã chuyển thú cưng từ giỏ hàng tạm thời vào giỏ hàng của bạn!');
            localStorage.removeItem('guestCartToken');
            dispatch(fetchUserCart()); // Refresh user cart after merge
          })
          .catch((error) => {
            console.error('Failed to merge cart from Header:', error);
            toast.error('Không thể chuyển giỏ hàng tạm thời. Vui lòng thử lại.');
          });
      }
    }
  }, [isAuthenticated, dispatch]);

  // Show notification for guests with items in cart
  useEffect(() => {
    if (!isAuthenticated && guestCart?.items?.length > 0) {
      console.log('Guest has items in cart:', guestCart.items.length);
    }
  }, [isAuthenticated, guestCart]);

  const handleLogoutClick = async () => {
    try {
      await handleLogout();
      toast.success('Đăng xuất thành công!');
      navigate('/');
    } catch (error) {
      toast.error('Đăng xuất thất bại!');
    }
  };

  // Get cart item count based on authentication status
  const currentCart = isAuthenticated ? userCart : guestCart;
  const cartItemCount = currentCart?.items?.length || 0;
  
  console.log('=== Header cart debug ===');
  console.log('isAuthenticated:', isAuthenticated);
  console.log('userCart:', userCart);
  console.log('guestCart:', guestCart);
  console.log('currentCart:', currentCart);
  console.log('cartItemCount:', cartItemCount);

  const navItems = [
    { path: '/', label: 'Trang chủ' },
    { path: '/pets', label: 'Thú cưng' },
    { path: '/events', label: 'Sự kiện' },
  ];

  // Role-based menu items
  const getUserMenuItems = () => {
    const items = [
      { path: '/profile', label: 'Hồ sơ', icon: FaUser },
    ];
    
    // Menu items for ADOPTER role
    if (userRole === 'ADOPTER') {
      items.push(
        { path: '/adoptions', label: 'Nhận nuôi', icon: FaHeart },
        { path: '/donations', label: 'Quyên góp', icon: FaHandHoldingHeart }
      );
    }
    
    // Menu items for DONOR role
    if (userRole === 'DONOR') {
      items.push(
        { path: '/donations', label: 'Quyên góp', icon: FaHandHoldingHeart }
      );
    }
    
    // Menu items for VOLUNTEER role
    if (userRole === 'VOLUNTEER') {
      items.push(
    
        { path: '/donations', label: 'Quyên góp', icon: FaHandHoldingHeart }
      );
    }
    
    // Admin menu items
    if (authContext.isAdmin()) {
      items.push(
        { path: '/admin', label: 'Admin Dashboard', icon: FaCog },
        { path: '/admin/users', label: 'Quản lý người dùng', icon: FaUsers },
        { path: '/admin/pets', label: 'Quản lý thú cưng', icon: FaPaw },
        { path: '/admin/events', label: 'Quản lý sự kiện', icon: FaCalendar },
        { path: '/admin/adoptions', label: 'Quản lý nhận nuôi', icon: FaHeart }
      );
    }
    
    // Volunteer menu items
    if (authContext.isVolunteer()) {
      items.push(
        { path: '/volunteer/events', label: 'Sự kiện của tôi', icon: FaCalendar }
      );
    }
    
    return items;
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-primary-600 font-bold text-xl">
            <FaHeart className="text-2xl" />
            <span>PawFund</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium transition-colors duration-300 ${
                  isActive(item.path) 
                    ? 'text-primary-600' 
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart - Show for both authenticated users and guests */}
            <Link to="/cart" className="relative text-gray-600 hover:text-primary-600 transition-colors duration-300">
              <FaShoppingCart className="text-xl" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
              {/* Guest notification */}
              {!isAuthenticated && guestCart?.items?.length > 0 && (
                <div className="absolute -bottom-8 right-0 bg-yellow-100 border border-yellow-300 text-yellow-800 text-xs px-2 py-1 rounded whitespace-nowrap">
                  Đăng nhập để lưu giỏ hàng
                </div>
              )}
            </Link>

            {isAuthenticated ? (
              <>
                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors duration-300"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <FaUser className="text-xl" />
                    <span className="font-medium">{user?.username || 'User'}</span>
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      {getUserMenuItems().map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-300"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <item.icon className="text-gray-500" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                      
                      <div className="border-t border-gray-200 my-2"></div>
                      
                      <button 
                        onClick={handleLogoutClick} 
                        className="flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-300 w-full"
                      >
                        <FaSignOutAlt />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-300"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors duration-300"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-600 hover:text-primary-600 transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-4 py-2 rounded-lg transition-colors duration-300 ${
                    isActive(item.path) 
                      ? 'bg-primary-100 text-primary-600' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {isAuthenticated && (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  {getUserMenuItems().map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center space-x-3 px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  
                  <div className="border-t border-gray-200 my-2"></div>
                  
                  <button 
                    onClick={handleLogoutClick} 
                    className="flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-300 w-full"
                  >
                    <FaSignOutAlt />
                    <span>Đăng xuất</span>
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
