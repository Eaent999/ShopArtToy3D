import axios from 'axios';

// Base URL for API - use environment variable or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor for logging and adding auth tokens if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        // If you add JWT tokens later, add them here
        // config.headers.Authorization = `Bearer ${userData.token}`;
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - clear user data and redirect to login
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else if (status === 404) {
        console.error('API endpoint not found:', error.config.url);
      } else if (status >= 500) {
        console.error('Server error:', data.message || 'Internal server error');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error: No response from server');
    } else {
      // Something else happened
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API Service Functions
export const productAPI = {
  getAll: () => apiClient.get('/api/products'),
  getById: (id) => apiClient.get(`/api/products/${id}`),
  create: (formData) => apiClient.post('/api/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => apiClient.put(`/api/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => apiClient.delete(`/api/products/${id}`),
};

export const cartAPI = {
  get: (userId) => apiClient.get(`/api/cart/${userId}`),
  add: (data) => apiClient.post('/api/cart/add', data),
  update: (data) => apiClient.put('/api/cart/update', data),
  remove: (data) => apiClient.delete('/api/cart/remove', { data }),
};

export const authAPI = {
  login: (credentials) => apiClient.post('/api/login', credentials),
  register: (userData) => apiClient.post('/api/register', userData),
};

export const orderAPI = {
  getUserOrders: (userId) => apiClient.get(`/api/orders/user/${userId}`),
  trackOrder: (orderId) => apiClient.get(`/api/orders/track/${orderId}`),
  getLastShipping: (userId) => apiClient.get(`/api/orders/last-shipping/${userId}`),
  createWithSlip: (formData) => apiClient.post('/api/orders/create-with-slip', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const paymentAPI = {
  generateQR: (amount) => apiClient.post('/api/generate-qr', { amount }),
};

export const flashSaleAPI = {
  getActiveCampaign: () => apiClient.get('/api/flash-sale/active-campaign'),
  getAll: () => apiClient.get('/api/flash-sale'),
  create: (data) => apiClient.post('/api/flash-sale', data),
  delete: (id) => apiClient.delete(`/api/flash-sale/${id}`),
  updateCampaign: (data) => apiClient.put('/api/admin/flash-sale-campaign', data),
};

export const collectionsAPI = {
  getAll: () => apiClient.get('/api/collections'),
  create: (formData) => apiClient.post('/api/collections', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => apiClient.delete(`/api/collections/${id}`),
};

export const adminAPI = {
  dashboardSummary: () => apiClient.get('/api/admin/dashboard-summary'),
  pendingOrders: () => apiClient.get('/api/admin/pending-orders'),
  approveOrder: (id) => apiClient.put(`/api/admin/approve-order/${id}`),
  ordersToShip: () => apiClient.get('/api/admin/orders-to-ship'),
  shippedOrder: (id, data) => apiClient.put(`/api/admin/shipped-order/${id}`, data),
  onDeliveryOrders: () => apiClient.get('/api/admin/orders/on-delivery'),
  updateOrderStatus: (id, status) => apiClient.put(`/api/admin/orders/${id}/status`, { status }),
  receivedHistory: () => apiClient.get('/api/admin/orders/received-history'),
};

export default apiClient;
