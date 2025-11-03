
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Header from '../components/Header'
import SideMenu from '../components/SideMenu'
import { useTheme } from '@mui/material/styles'

export default function Dashboard() {
    const [drawerOpen, setDrawerOpen] = useState(false)

    return (
        <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f5f5f5' }}>
            <SideMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <Header onMenuClick={() => setDrawerOpen(true)} />
            </Box>
        </Box>
    )
}