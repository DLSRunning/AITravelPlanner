import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import MainPage from './pages/MainPage'
import HistoryPage from './pages/HistoryPage'
import DetailPage from './pages/DetailPage'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<MainPage />} />
                    <Route path="history" element={<HistoryPage />} />
                    <Route path="plan/:id" element={<DetailPage />} />
                </Route>
            </Routes>
        </AuthProvider>
    )
}
