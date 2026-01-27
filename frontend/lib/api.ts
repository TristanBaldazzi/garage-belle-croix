import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Offers API
export const offersAPI = {
  getAll: async () => {
    const response = await api.get('/offers');
    return response.data;
  },
  getAllAdmin: async () => {
    const response = await api.get('/offers/all');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/offers/${id}`);
    return response.data;
  },
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/offers/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/offers', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/offers/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/offers/${id}`);
    return response.data;
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
  updateOrder: async (categories: any[]) => {
    const response = await api.put('/categories/order', { categories });
    return response.data;
  },
};

// Contacts API
export const contactsAPI = {
  create: async (data: any) => {
    const response = await api.post('/contacts', data);
    return response.data;
  },
  getAll: async (params?: { isArchived?: boolean; isRead?: boolean }) => {
    const response = await api.get('/contacts', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/contacts/${id}`);
    return response.data;
  },
  markAsRead: async (id: string) => {
    const response = await api.patch(`/contacts/${id}/read`);
    return response.data;
  },
  archive: async (id: string) => {
    const response = await api.patch(`/contacts/${id}/archive`);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/contacts/${id}`);
    return response.data;
  },
};

// Quotes API
export const quotesAPI = {
  create: async (data: any) => {
    const response = await api.post('/quotes', data);
    return response.data;
  },
  getAll: async (params?: { isArchived?: boolean; isRead?: boolean; search?: string }) => {
    const response = await api.get('/quotes', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/quotes/${id}`);
    return response.data;
  },
  markAsRead: async (id: string) => {
    const response = await api.patch(`/quotes/${id}/read`);
    return response.data;
  },
  archive: async (id: string) => {
    const response = await api.patch(`/quotes/${id}/archive`);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/quotes/${id}`);
    return response.data;
  },
};

// Opening Hours API
export const openingHoursAPI = {
  get: async () => {
    const response = await api.get('/opening-hours');
    return response.data;
  },
  update: async (data: any) => {
    const response = await api.put('/opening-hours', data);
    return response.data;
  },
};

export default api;

