import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh token on 401.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE}/auth/refresh/`, {
            refresh: refreshToken,
          });
          localStorage.setItem('access_token', res.data.access);
          if (res.data.refresh) {
            localStorage.setItem('refresh_token', res.data.refresh);
          }
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
          return api(originalRequest);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (username, password) =>
  api.post('/auth/login/', { username, password });

export const register = (data) => api.post('/auth/register/', data);

// Dashboard
export const getDashboard = () => api.get('/dashboard/');

// Obras
export const getObras = () => api.get('/obras/');
export const createObra = (data) => api.post('/obras/', data);
export const updateObra = (id, data) => api.put(`/obras/${id}/`, data);
export const deleteObra = (id) => api.delete(`/obras/${id}/`);

// Transacoes
export const getTransacoes = () => api.get('/transacoes/');
export const createTransacao = (data) => api.post('/transacoes/', data);
export const updateTransacao = (id, data) => api.put(`/transacoes/${id}/`, data);
export const deleteTransacao = (id) => api.delete(`/transacoes/${id}/`);

// Fornecedores
export const getFornecedores = () => api.get('/fornecedores/');
export const createFornecedor = (data) => api.post('/fornecedores/', data);
export const updateFornecedor = (id, data) => api.put(`/fornecedores/${id}/`, data);
export const deleteFornecedor = (id) => api.delete(`/fornecedores/${id}/`);

// Previsoes
export const getPrevisoes = () => api.get('/previsoes/');

// Notificacoes
export const getNotificacoes = () => api.get('/notificacoes/');
export const marcarNotificacaoLida = (id) => api.post(`/notificacoes/${id}/marcar_lida/`);
export const marcarTodasNotificacoesLidas = () => api.post('/notificacoes/marcar_todas_lidas/');

export default api;
