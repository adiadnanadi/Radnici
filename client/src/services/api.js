const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
};

const fetchWithAuth = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return handleResponse(response);
};

export const api = {
  get: (endpoint) => fetchWithAuth(endpoint, { method: 'GET' }),
  post: (endpoint, body) => fetchWithAuth(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => fetchWithAuth(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => fetchWithAuth(endpoint, { method: 'DELETE' }),
};

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const workerService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/workers${query ? `?${query}` : ''}`);
  },
  getById: (id) => api.get(`/workers/${id}`),
  getMyProfile: () => api.get('/workers/me'),
  create: (data) => api.post('/workers', data),
  update: (id, data) => api.put(`/workers/${id}`, data),
  delete: (id) => api.delete(`/workers/${id}`),
  getCategories: () => api.get('/workers/categories'),
  getLocations: () => api.get('/workers/locations'),
};

export const messageService = {
  send: (data) => api.post('/messages', data),
  getInbox: () => api.get('/messages/inbox'),
  getSent: () => api.get('/messages/sent'),
  getUnread: () => api.get('/messages/unread'),
  markAsRead: (id) => api.put(`/messages/${id}/read`, {}),
  delete: (id) => api.delete(`/messages/${id}`),
};

export const favoriteService = {
  getAll: () => api.get('/favorites'),
  add: (workerId) => api.post(`/favorites/${workerId}`, {}),
  remove: (workerId) => api.delete(`/favorites/${workerId}`),
  check: (workerId) => api.get(`/favorites/${workerId}/check`),
};

export const reviewService = {
  create: (data) => api.post('/reviews', data),
  getWorkerReviews: (workerId) => api.get(`/reviews/worker/${workerId}`),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getAllWorkers: () => api.get('/admin/workers'),
  getAllClients: () => api.get('/admin/clients'),
  getAllReviews: () => api.get('/admin/reviews'),
  verifyWorker: (id) => api.put(`/admin/workers/${id}/verify`, {}),
  unverifyWorker: (id) => api.put(`/admin/workers/${id}/unverify`, {}),
  suspendWorker: (id) => api.put(`/admin/workers/${id}/suspend`, {}),
  activateWorker: (id) => api.put(`/admin/workers/${id}/activate`, {}),
  deleteReview: (id) => api.delete(`/admin/reviews/${id}`),
};
