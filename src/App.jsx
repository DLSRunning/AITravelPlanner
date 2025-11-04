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
                {/* 公开页面 */}
                <Route path="/login" element={<LoginPage />} />

                {/* 受保护的 Dashboard 布局 */}
                <Route
                    path="/"                           // 根路径
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                >
                    {/* 这里的子路由都是相对路径 */}
                    <Route index element={<HistoryPage />} />           {/* / */}
                    <Route path="new" element={<MainPage />} />         {/* /new */}
                    <Route path="history" element={<HistoryPage />} /> {/* /history */}
                    <Route path="plan/:id" element={<DetailPage />} /> {/* /plan/:id */}
                </Route>

                {/* 404（可选） */}
                <Route path="*" element={<div>404 - 页面未找到</div>} />
            </Routes>
        </AuthProvider>
    )
}