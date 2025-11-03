import React, { useState } from 'react'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Header from '../components/Header'
import SideMenu from '../components/SideMenu'
import { Outlet } from 'react-router-dom'

export default function Dashboard() {
    const [drawerOpen, setDrawerOpen] = useState(false)

    return (
        <Box sx={{ display: 'flex', bgcolor: '#f5f5f5', height: '100vh' }}>
            <CssBaseline />
            <Header onMenuClick={() => setDrawerOpen(true)} />
            <SideMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, overflowY: 'auto' }}>
                <Outlet />
            </Box>
        </Box>
    )
}
