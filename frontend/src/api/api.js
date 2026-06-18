import axios from 'axios'
import { tokenStorage } from '../auth/tokenStorage'

const API_BASE = '/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = tokenStorage.getRefreshToken()
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE}/auth/refresh/`, { refresh: refreshToken })
          tokenStorage.updateAccessToken(response.data.access, response.data.refresh)
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`
          return api(originalRequest)
        } catch {
          tokenStorage.clear()
          window.location.href = '/login'
        }
      } else {
        tokenStorage.clear()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

const withParams = (params = {}) => ({ params })

export const login = (username, password) => api.post('/auth/login/', { username, password })
export const register = (data) => api.post('/auth/register/', data)
export const getDashboard = () => api.get('/dashboard/')

export const getObras = (params) => api.get('/obras/', withParams(params))
export const createObra = (data) => api.post('/obras/', data)
export const updateObra = (id, data) => api.put(`/obras/${id}/`, data)
export const deleteObra = (id) => api.delete(`/obras/${id}/`)

export const getTransacoes = (params) => api.get('/transacoes/', withParams(params))
export const createTransacao = (data) => api.post('/transacoes/', data)
export const updateTransacao = (id, data) => api.put(`/transacoes/${id}/`, data)
export const deleteTransacao = (id) => api.delete(`/transacoes/${id}/`)

export const getFornecedores = (params) => api.get('/fornecedores/', withParams(params))
export const createFornecedor = (data) => api.post('/fornecedores/', data)
export const updateFornecedor = (id, data) => api.put(`/fornecedores/${id}/`, data)
export const deleteFornecedor = (id) => api.delete(`/fornecedores/${id}/`)

export const getPrevisoes = (params) => api.get('/previsoes/', withParams(params))

export const getNotificacoes = (params) => api.get('/notificacoes/', withParams(params))
export const sincronizarNotificacoes = () => api.post('/notificacoes/sincronizar/')
export const marcarNotificacaoLida = (id) => api.post(`/notificacoes/${id}/marcar_lida/`)
export const marcarTodasNotificacoesLidas = () => api.post('/notificacoes/marcar_todas_lidas/')

export default api
