import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  photos: {
    getAll: async () => {
      const response = await client.get('/api/photos');
      return response.data;
    },
    getById: async (id: string) => {
      const response = await client.get(`/api/photos/${id}`);
      return response.data;
    },
    upload: async (formData: FormData) => {
      const response = await client.post('/api/photos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    delete: async (id: string) => {
      const response = await client.delete(`/api/photos/${id}`);
      return response.data;
    },
  },
};

export const getImageUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_URL}${path}`;
}; 