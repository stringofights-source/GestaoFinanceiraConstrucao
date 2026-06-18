import React, { useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopHeader from './components/TopHeader'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import FluxoCaixa from './pages/FluxoCaixa'
import Fornecedores from './pages/Fornecedores'
import Previsoes from './pages/Previsoes'
import Obras from './pages/Obras'
import { tokenStorage } from './auth/tokenStorage'

function ProtectedRoute({ children }) {
  const token = tokenStorage.getAccessToken()
  if (!token) return <Navigate to="/login" replace />
  return children
}

function AppLayout({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={onLogout} />
      <main className="main-content">
        <TopHeader onToggleSidebar={() => setSidebarOpen((open) => !open)} />
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/obras" element={<Obras />} />
            <Route path="/fluxo-caixa" element={<FluxoCaixa />} />
            <Route path="/fornecedores" element={<Fornecedores />} />
            <Route path="/previsoes" element={<Previsoes />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default function App() {
  const navigate = useNavigate()

  const handleLogout = () => {
    tokenStorage.clear()
    navigate('/login')
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
