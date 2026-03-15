import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api`
  : '/api';

const api = axios.create({ baseURL: BASE });

export const stopsApi = {
  getAll: () => api.get('/stops'),
  getById: (id) => api.get(`/stops/${id}`),
  create: (data) => api.post('/stops', data),
  update: (id, data) => api.put(`/stops/${id}`, data),
  delete: (id) => api.delete(`/stops/${id}`),
  uploadImages: (id, files) => {
    const form = new FormData();
    files.forEach(f => form.append('images', f));
    return api.post(`/stops/${id}/images`, form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteImage: (stopId, imageId) => api.delete(`/stops/${stopId}/images/${imageId}`),
  reorder: (orderedIds) => api.patch('/stops/reorder', { orderedIds }),
};