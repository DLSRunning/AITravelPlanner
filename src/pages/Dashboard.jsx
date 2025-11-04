// src/layouts/Dashboard.jsx
import React, { useState, useEffect } from 'react'
import {
    Box,
    CssBaseline,
    useTheme,
    useMediaQuery,
    Paper,
} from '@mui/material'
import Header from '../components/Header'
import SideMenu from '../components/SideMenu'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const HEADER_HEIGHT = 50

export default function Dashboard() {
    const [mobileOpen, setMobileOpen] = useState(false) // 仅移动端用
    const { darkMode } = useAuth()
    const theme = useTheme()

    // 桌面端 = 永久打开；移动端 = 抽屉
    const drawerVariant = 'temporary'
    const drawerOpen = mobileOpen

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: darkMode ? 'grey.900' : '#f5f7fa' }}>
            <CssBaseline />

            {/* 顶部栏 */}
            <Header onMenuClick={handleDrawerToggle} />

            {/* 侧边栏 */}
            <SideMenu
                open={drawerOpen}
                onClose={handleDrawerToggle}
                variant={drawerVariant}   // ← 关键
            />

            {/* 主内容 */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    mt: `${HEADER_HEIGHT}px`,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        flexGrow: 1,
                        m: 3,
                        p: 3,
                        borderRadius: 4,
                        bgcolor: darkMode ? 'grey.850' : 'white',
                        boxShadow: darkMode ? 4 : 2,
                        overflow: 'hidden',
                    }}
                >
                    <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                        <Outlet />
                    </Box>
                </Paper>
            </Box>
        </Box>
    )
}