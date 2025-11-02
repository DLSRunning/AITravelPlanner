import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Header from './components/Header'
import SideMenu from './components/SideMenu'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'


export default function App() {
    const loc = useLocation()
    const showDrawer = loc.pathname !== '/login'


    return (
        <>
            <CssBaseline />
            <Header />
            <Box sx={{ display: 'flex' }}>
                {showDrawer && <SideMenu />}
                <Box component="main" sx={{ flexGrow: 1, ml: showDrawer ? '240px' : 0 }}>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </Box>
            </Box>
        </>
    )
}