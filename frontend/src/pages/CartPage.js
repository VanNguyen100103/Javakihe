import React, { useEffect, useState } from 'react';
import { useCart } from '../hook';
import { fetchUserCart, fetchGuestCart, removeFromGuestCart, removeFromUserCart, clearUserCart, clearCart, mergeCart } from '../store/asyncAction/cartAsyncAction';
import { adoptFromCart } from '../store/asyncAction/adoptionAsyncAction';
import { useAppDispatch } from '../hook';
import { useAuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { FaTrash, FaHeart, FaSpinner, FaShoppingCart, FaCheck } from 'react-icons/fa';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AdoptionTestModal from '../components/adoption/AdoptionTestModal';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const dispatch = useAppDispatch();
  const { userCart, guestCart, isLoading } = useCart();
  const { isAuthenticated } = useAuthContext();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [showAdoptionForm, setShowAdoptionForm] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [adoptionData, setAdoptionData] = useState({
    message: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    console.log('=== CartPage useEffect ===');
    console.log('isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      console.log('Loading user cart...');
      dispatch(fetchUserCart());
      
      // Check if there's a guest cart to merge
      let guestToken = localStorage.getItem('guestCartToken');
      
      // If no token but guest cart has items, create a new token
      if (!guestToken && guestCart?.items?.length > 0) {
        console.log('=== Creating new guest token from Redux state ===');
        guestToken = crypto.randomUUID();
        localStorage.setItem('guestCartToken', guestToken);
        console.log('Created new guest token:', guestToken);
      }
      
      if (guestToken) {
        console.log('=== Found guest cart, attempting merge ===');
        dispatch(mergeCart(guestToken))
          .unwrap()
          .then(() => {
            console.log('Cart merged successfully from CartPage');
            toast.success('Đã chuyển thú cưng từ giỏ hàng tạm thời vào giỏ hàng của bạn!');
            localStorage.removeItem('guestCartToken');
            dispatch(fetchUserCart()); // Refresh user cart after merge
          })
          .catch((error) => {
            console.error('Failed to merge cart from CartPage:', error);
            toast.error('Không thể chuyển giỏ hàng tạm thời. Vui lòng thử lại.');
          });
      }
    } else {
      // For guests, try to get guest cart from localStorage
      const guestToken = localStorage.getItem('guestCartToken');
      console.log('Guest token from localStorage:', guestToken);
      if (guestToken) {
        console.log('Loading guest cart...');
        dispatch(fetchGuestCart(guestToken));
      } else {
        console.log('No guest token found');
      }
    }
  }, [dispatch, isAuthenticated, guestCart]);

  // TODO: Implement when backend has update cart API
  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    setUpdatingItemId(itemId);
    
    try {
      // await dispatch(updateCartItem({ itemId, quantity: newQuantity })).unwrap();
      toast.info('Chức năng cập nhật số lượng sẽ được phát triển sau');
    } catch (error) {
      toast.error('Cập nhật giỏ hàng thất bại!');
    } finally {
      setIsUpdating(false);
      setUpdatingItemId(null);
    }
  };

  // Remove item from cart
  const handleRemoveItem = async (itemId) => {
    try {
      if (!isAuthenticated) {
        // For guests, remove from guest cart
        const guestToken = localStorage.getItem('guestCartToken');
        if (guestToken) {
          await dispatch(removeFromGuestCart({ petId: itemId, token: guestToken })).unwrap();
          toast.success('Đã xóa thú cưng khỏi giỏ hàng!');
        }
      } else {
        // For authenticated users, remove from user cart
        await dispatch(removeFromUserCart(itemId)).unwrap();
        toast.success('Đã xóa thú cưng khỏi giỏ hàng!');
      }
    } catch (error) {
      toast.error('Xóa sản phẩm thất bại!');
    }
  };

  // Clear all items from cart
  const handleClearCart = async () => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?')) {
      try {
        if (!isAuthenticated) {
          // For guests, use existing clear cart (if implemented)
          await dispatch(clearCart()).unwrap();
        } else {
          // For authenticated users, clear user cart
          await dispatch(clearUserCart()).unwrap();
        }
        toast.success('Đã xóa tất cả sản phẩm!');
      } catch (error) {
        toast.error('Xóa giỏ hàng thất bại!');
      }
    }
  };

  // Manual trigger for merge cart (for debugging)
  const handleManualMerge = () => {
    let guestToken = localStorage.getItem('guestCartToken');
    
    // If no token in localStorage but guest cart has items, create a new token
    if (!guestToken && guestCart?.items?.length > 0) {
      console.log('=== Creating new guest token from Redux state ===');
      guestToken = crypto.randomUUID();
      localStorage.setItem('guestCartToken', guestToken);
      console.log('Created new guest token:', guestToken);
    }
    
    if (guestToken) {
      console.log('=== Manual merge triggered ===');
      dispatch(mergeCart(guestToken))
        .unwrap()
        .then(() => {
          console.log('Manual merge successful');
          toast.success('Đã chuyển thú cưng từ giỏ hàng tạm thời vào giỏ hàng của bạn!');
          localStorage.removeItem('guestCartToken');
          dispatch(fetchUserCart());
        })
        .catch((error) => {
          console.error('Manual merge failed:', error);
          toast.error('Không thể chuyển giỏ hàng tạm thời. Vui lòng thử lại.');
        });
    } else {
      console.log('No guest token found for manual merge');
      toast.info('Không có giỏ hàng tạm thời để chuyển');
    }
  };

  // Fallback merge: directly move items from guest cart to user cart in Redux
  const handleDirectMerge = () => {
    if (guestCart?.items?.length > 0) {
      console.log('=== Direct merge from Redux state ===');
      
      // Create a new user cart with guest cart items
      const mergedItems = [...guestCart.items];
      
      // Update Redux state directly
      dispatch({
        type: 'cart/setUserCart',
        payload: {
          items: mergedItems,
          total: mergedItems.length
        }
      });
      
      // Clear guest cart
      dispatch({
        type: 'cart/clearGuestCart'
      });
      
      toast.success('Đã chuyển thú cưng từ giỏ hàng tạm thời vào giỏ hàng của bạn!');
      console.log('Direct merge successful');
    } else {
      toast.info('Không có thú cưng nào trong giỏ hàng tạm thời');
    }
  };

  const handleStartAdoption = () => {
    if (!testResult) {
      // Chưa làm bài test, hiển thị modal test
      setShowTestModal(true);
    } else {
      // Đã có kết quả test, hiển thị form nhận nuôi
      setShowAdoptionForm(true);
    }
  };

  const handleTestComplete = (result) => {
    setTestResult(result);
    // Sau khi hoàn thành test, hiển thị form nhận nuôi
    setShowAdoptionForm(true);
  };

  const handleAdoptFromCart = async () => {
    if (!adoptionData.message || !adoptionData.phone || !adoptionData.address) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      await dispatch(adoptFromCart(adoptionData)).unwrap();
      toast.success('Đã gửi đơn nhận nuôi thành công!');
      setShowAdoptionForm(false);
      setAdoptionData({ message: '', phone: '', address: '' });
      setTestResult(null);
      // Clear cart after successful adoption
      await dispatch(clearCart()).unwrap();
    } catch (error) {
      toast.error(error || 'Gửi đơn nhận nuôi thất bại!');
    }
  };

  const calculateTotal = () => {
    if (!userCart?.items) return 0;
    return userCart.items.reduce((total, item) => {
      return total + (item.price || 0) * (item.quantity || 1);
    }, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Use appropriate cart based on authentication status
  const currentCart = isAuthenticated ? userCart : guestCart;
  const cartItems = currentCart?.items || [];
  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Giỏ hàng</h1>
          <p className="text-xl text-gray-600">Quản lý thú cưng bạn muốn nhận nuôi</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Giỏ hàng trống</h2>
              <p className="text-gray-600 mb-8">Bạn chưa có thú cưng nào trong giỏ hàng.</p>
              
             
              
              <Link 
                to="/pets" 
                className="inline-flex items-center px-6 py-3 bg-primary-500 text-white font-bold rounded-full hover:bg-primary-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Xem thú cưng
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Sản phẩm ({cartItems.length})</h2>
                  <button
                    className="inline-flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 font-medium rounded-lg hover:bg-red-50 transition-all duration-300"
                    onClick={handleClearCart}
                  >
                    <FaTrash />
                    Xóa tất cả
                  </button>
                </div>

                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="flex-shrink-0">
                        <img
                          src={item.pet?.imageUrls?.split(',')[0] || 'https://via.placeholder.com/120x120?text=Pet+Image'}
                          alt={item.pet?.name}
                          className="w-24 h-24 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/120x120?text=Pet+Image';
                          }}
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{item.pet?.name}</h3>
                        <p className="text-gray-600 mb-1">{item.pet?.breed}</p>
                        <p className="text-gray-500 text-sm mb-3">{item.pet?.location}</p>
                        <div className="text-lg font-bold text-primary-500">
                          {item.price ? formatPrice(item.price) : 'Miễn phí'}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-4">
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600">Số lượng:</label>
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              className="px-3 py-1 hover:bg-gray-100 transition-colors duration-300 disabled:opacity-50"
                              onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                              disabled={(item.quantity || 1) <= 1 || isUpdating}
                            >
                              -
                            </button>
                            <span className="px-3 py-1 min-w-[40px] text-center">
                              {isUpdating && updatingItemId === item.id ? (
                                <FaSpinner className="animate-spin mx-auto" />
                              ) : (
                                item.quantity || 1
                              )}
                            </span>
                            <button
                              className="px-3 py-1 hover:bg-gray-100 transition-colors duration-300 disabled:opacity-50"
                              onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                              disabled={isUpdating}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <button
                          className="text-red-500 hover:text-red-700 transition-colors duration-300"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={isUpdating}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Tổng cộng</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số lượng:</span>
                    <span className="font-medium">{cartItems.length}</span>
                  </div>
                  <div className="flex justify-between">
          
                  
                  </div>
                </div>

                {/* Test Result Display */}
                {testResult && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FaCheck className="text-green-500" />
                      <span className="font-medium text-green-800">Bài test đã hoàn thành</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Điểm: {testResult.score}/100 
                      {testResult.score >= 70 ? ' (Đủ điều kiện nhận nuôi)' : ' (Cần cải thiện)'}
                    </p>
                  </div>
                )}

                {!isAuthenticated ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        Bạn cần đăng nhập để tiến hành nhận nuôi thú cưng.
                      </p>
                    </div>
                    <Link 
                      to="/login" 
                      className="w-full bg-primary-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-primary-600 transition-all duration-300 transform hover:scale-105 text-center block"
                    >
                      Đăng nhập để nhận nuôi
                    </Link>
                  </div>
                ) : (
                  <button 
                    className="w-full bg-primary-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-primary-600 transition-all duration-300 transform hover:scale-105"
                    onClick={handleStartAdoption}
                  >
                    {testResult ? 'Tiến hành nhận nuôi' : 'Làm bài test nhận nuôi'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Adoption Test Modal */}
        <AdoptionTestModal
          isOpen={showTestModal}
          onClose={() => setShowTestModal(false)}
          onTestComplete={handleTestComplete}
        />

        {/* Adoption Form Modal */}
        {showAdoptionForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Thông tin nhận nuôi</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lý do nhận nuôi *
                  </label>
                  <textarea
                    value={adoptionData.message}
                    onChange={(e) => setAdoptionData({...adoptionData, message: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows="4"
                    placeholder="Hãy chia sẻ lý do bạn muốn nhận nuôi thú cưng này..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    value={adoptionData.phone}
                    onChange={(e) => setAdoptionData({...adoptionData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0123456789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ *
                  </label>
                  <input
                    type="text"
                    value={adoptionData.address}
                    onChange={(e) => setAdoptionData({...adoptionData, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="123 Đường ABC, Quận 1, TP.HCM"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowAdoptionForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-300"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAdoptFromCart}
                  className="flex-1 px-4 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors duration-300"
                >
                  Gửi đơn
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage; 