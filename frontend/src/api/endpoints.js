import api from './client';

export const authApi = {
  login: (data) => api.post('/api/auth/login', data),
  signup: (data) => api.post('/api/auth/signup', data),
  updatePassword: (data) => api.patch('/api/auth/password', data)
};

export const storesApi = {
  list: (params) => api.get('/api/stores', { params }),
  getOne: (id) => api.get(`/api/stores/${id}`),
  create: (data) => api.post('/api/stores', data),
  ownerDashboard: () => api.get('/api/stores/owner/dashboard')
};

export const usersApi = {
  list: (params) => api.get('/api/users', { params }),
  getOne: (id) => api.get(`/api/users/${id}`),
  create: (data) => api.post('/api/users', data),
  getStats: () => api.get('/api/users/stats')
};

export const ratingsApi = {
  upsert: (storeId, rating) => api.post(`/api/ratings/stores/${storeId}`, { rating }),
  getMyRating: (storeId) => api.get(`/api/ratings/stores/${storeId}`)
};
