import api from '../util/axios';

// Adoption Management API for Admin & Shelter Staff
export const adoptionManagementAPI = {
  // Get all adoptions with pagination and filters
  getAdoptions: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.status) queryParams.append('status', params.status);
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.petId) queryParams.append('petId', params.petId);
    if (params.shelterId) queryParams.append('shelterId', params.shelterId);
    if (params.search) queryParams.append('search', params.search);
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.append('dateTo', params.dateTo);

    return api.get(`/adoptions?${queryParams.toString()}`);
  },

  // Get adoption by ID
  getAdoptionById: async (id) => {
    return api.get(`/adoptions/${id}`);
  },

  // Create adoption (Admin & Shelter Staff can create on behalf of users)
  createAdoption: async (adoptionData) => {
    return api.post('/adoptions', adoptionData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  // Update adoption (Admin & Shelter Staff only)
  updateAdoption: async (id, adoptionData) => {
    return api.put(`/adoptions/${id}`, adoptionData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  // Delete adoption (Admin & Shelter Staff only)
  deleteAdoption: async (id) => {
    return api.delete(`/adoptions/${id}`);
  },

  // Approve adoption (Admin & Shelter Staff only)
  approveAdoption: async (id, notes = '') => {
    return api.patch(`/adoptions/${id}/approve`, { notes });
  },

  // Reject adoption (Admin & Shelter Staff only)
  rejectAdoption: async (id, reason = '') => {
    return api.patch(`/adoptions/${id}/reject`, { reason });
  },

  // Pending adoption (Admin & Shelter Staff only)
  pendingAdoption: async (id, notes = '') => {
    return api.patch(`/adoptions/${id}/pending`, { notes });
  },

  // Get adoptions by status
  getAdoptionsByStatus: async (status, params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.shelterId) queryParams.append('shelterId', params.shelterId);

    return api.get(`/adoptions/status/${status}?${queryParams.toString()}`);
  },

  // Get pending adoptions
  getPendingAdoptions: async (params = {}) => {
    return adoptionManagementAPI.getAdoptionsByStatus('PENDING', params);
  },

  // Get approved adoptions
  getApprovedAdoptions: async (params = {}) => {
    return adoptionManagementAPI.getAdoptionsByStatus('APPROVED', params);
  },

  // Get rejected adoptions
  getRejectedAdoptions: async (params = {}) => {
    return adoptionManagementAPI.getAdoptionsByStatus('REJECTED', params);
  },

  // Get adoptions by shelter
  getAdoptionsByShelter: async (shelterId, params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.status) queryParams.append('status', params.status);

    return api.get(`/adoptions/shelter/${shelterId}?${queryParams.toString()}`);
  },

  // Get adoptions by user
  getAdoptionsByUser: async (userId, params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.status) queryParams.append('status', params.status);

    return api.get(`/adoptions/user/${userId}?${queryParams.toString()}`);
  },

  // Get adoption statistics
  getAdoptionStats: async () => {
    return api.get('/adoptions/stats');
  },

  // Bulk approve adoptions
  bulkApproveAdoptions: async (adoptionIds, notes = '') => {
    return api.post('/adoptions/bulk/approve', { adoptionIds, notes });
  },

  // Bulk reject adoptions
  bulkRejectAdoptions: async (adoptionIds, reason = '') => {
    return api.post('/adoptions/bulk/reject', { adoptionIds, reason });
  },

  // Send notification to adopter
  sendNotification: async (adoptionId, message) => {
    return api.post(`/adoptions/${adoptionId}/notify`, { message });
  },

  // Get adoption test results
  getAdoptionTestResults: async (userId) => {
    return api.get(`/adoptions/test-results/${userId}`);
  },

  // Export adoptions to CSV
  exportAdoptions: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.status) queryParams.append('status', params.status);
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.append('dateTo', params.dateTo);
    if (params.shelterId) queryParams.append('shelterId', params.shelterId);

    return api.get(`/adoptions/export?${queryParams.toString()}`, {
      responseType: 'blob'
    });
  }
}; 