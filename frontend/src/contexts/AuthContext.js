import { useAuth } from '../hook';
import { useAppDispatch } from '../hook';
import { createContext, useContext, useEffect, useState } from 'react';
import { logout } from '../store/asyncAction/authAsyncAction';
import { mergeCart } from '../store/asyncAction/cartAsyncAction';
import { toast } from 'react-toastify';
import { fetchUserCart } from '../store/asyncAction/cartAsyncAction';

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const [userRole, setUserRole] = useState(null);
  const [permissions, setPermissions] = useState([]);

  // Determine user role and permissions
  useEffect(() => {
    console.log('AuthContext - User object:', user);
    if (user && user.role) {
      console.log('AuthContext - User role:', user.role);
      setUserRole(user.role);
      setPermissions(getPermissionsByRole(user.role));
      
      // Merge guest cart if user just logged in
      const guestToken = localStorage.getItem('guestCartToken');
      if (guestToken) {
        console.log('=== Merging guest cart on login ===');
        console.log('Guest token:', guestToken);
        console.log('User:', user);
        
        dispatch(mergeCart(guestToken))
          .unwrap()
          .then(() => {
            console.log('Cart merged successfully');
            toast.success('Đã chuyển thú cưng từ giỏ hàng tạm thời vào giỏ hàng của bạn!');
            localStorage.removeItem('guestCartToken');
            
            // Refresh user cart after merge
            dispatch(fetchUserCart());
          })
          .catch((error) => {
            console.error('Failed to merge cart:', error);
            toast.error('Không thể chuyển giỏ hàng tạm thời. Vui lòng thử lại.');
          });
      } else {
        console.log('No guest token found for merge');
      }
    } else {
      console.log('AuthContext - No user or no role');
      setUserRole(null);
      setPermissions([]);
    }
  }, [user, dispatch]);

  // Check for guest cart merge on component mount if user is already logged in
  useEffect(() => {
    console.log('=== AuthContext: Checking for guest cart merge on mount ===');
    console.log('user:', user);
    console.log('user.role:', user?.role);
    console.log('isAuthenticated:', isAuthenticated);
    
    if (user && user.role && isAuthenticated) {
      const guestToken = localStorage.getItem('guestCartToken');
      console.log('guestToken from localStorage:', guestToken);
      
      if (guestToken) {
        console.log('=== AuthContext: Found guest cart, attempting merge ===');
        dispatch(mergeCart(guestToken))
          .unwrap()
          .then(() => {
            console.log('Cart merged successfully from AuthContext mount');
            toast.success('Đã chuyển thú cưng từ giỏ hàng tạm thời vào giỏ hàng của bạn!');
            localStorage.removeItem('guestCartToken');
            dispatch(fetchUserCart()); // Refresh user cart after merge
          })
          .catch((error) => {
            console.error('Failed to merge cart from AuthContext mount:', error);
            toast.error('Không thể chuyển giỏ hàng tạm thời. Vui lòng thử lại.');
          });
      } else {
        console.log('No guest token found in localStorage');
      }
    } else {
      console.log('User not authenticated or no role');
    }
  }, [isAuthenticated, user, dispatch]);

  // Get permissions based on role
  const getPermissionsByRole = (role) => {
    const rolePermissions = {
      ADMIN: [
        'manage_users',
        'manage_pets',
        'manage_adoptions',
        'manage_donations',
        'manage_events',
        'view_analytics',
        'manage_shelters',
        'approve_adoptions',
        'manage_content'
      ],
      SHELTER: [
        'manage_pets',
        'manage_adoptions',
        'view_donations',
        'manage_events',
        'view_analytics',
        'approve_adoptions'
      ],
      VOLUNTEER: [
        'view_pets',
        'assist_adoptions',
        'view_events',
        'view_analytics'
      ],
      ADOPTER: [
        'view_pets',
        'apply_adoption',
        'view_own_adoptions',
        'make_donations',
        'view_events'
      ],
      DONOR: [
        'view_pets',
        'make_donations',
        'view_own_donations',
        'view_events'
      ]
    };
    return rolePermissions[role] || [];
  };

  // Check if user has specific permission
  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  // Check if user has any of the specified permissions
  const hasAnyPermission = (permissionList) => {
    return permissionList.some(permission => permissions.includes(permission));
  };

  // Check if user has all of the specified permissions
  const hasAllPermissions = (permissionList) => {
    return permissionList.every(permission => permissions.includes(permission));
  };

  // Check if user is admin
  const isAdmin = () => userRole === 'ADMIN';

  // Check if user is shelter staff
  const isShelterStaff = () => userRole === 'SHELTER';

  // Check if user is volunteer
  const isVolunteer = () => userRole === 'VOLUNTEER';

  // Check if user is adopter
  const isAdopter = () => userRole === 'ADOPTER';

  // Check if user is donor
  const isDonor = () => userRole === 'DONOR';

  // Check if user can manage content
  const canManageContent = () => hasPermission('manage_content');

  // Check if user can manage pets
  const canManagePets = () => hasPermission('manage_pets');

  // Check if user can manage adoptions
  const canManageAdoptions = () => hasPermission('manage_adoptions');

  // Check if user can manage donations
  const canManageDonations = () => hasPermission('manage_donations');

  // Check if user can view analytics
  const canViewAnalytics = () => hasPermission('view_analytics');

  // Check if user can manage events
  const canManageEvents = () => hasPermission('manage_events');

  // Handle logout
  const handleLogout = async () => {
    try {
      await dispatch(logout());
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    userRole,
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    isShelterStaff,
    isVolunteer,
    isAdopter,
    isDonor,
    canManageContent,
    canManagePets,
    canManageAdoptions,
    canManageDonations,
    canViewAnalytics,
    canManageEvents,
    handleLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 