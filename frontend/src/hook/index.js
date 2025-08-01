import { useDispatch, useSelector } from 'react-redux';

// Custom hook để sử dụng dispatch và selector
export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;

// Custom hooks cho từng slice
export const useAuth = () => {
    return useSelector((state) => state.auth);
};

export const useUser = () => {
    return useSelector((state) => state.user);
};

export const usePet = () => {
    return useSelector((state) => state.pet);
};

export const useAdoption = () => {
    return useSelector((state) => state.adoption);
};

export const useDonation = () => {
    return useSelector((state) => state.donation);
};

export const useEvent = () => {
    return useSelector((state) => state.event);
};

export const useCart = () => {
    return useSelector((state) => state.cart);
};

// Pet Management hooks
export const usePetManagement = () => {
    return useSelector((state) => state.petManagement);
};

// User Management hooks
export const useUserManagement = () => {
    return useSelector((state) => state.userManagement);
}; 