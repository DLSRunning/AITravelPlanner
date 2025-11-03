
import React, { useState } from 'react'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import PlannerCard from '../components/PlannerCard'
import BudgetCard from '../components/BudgetCard'
import UserCard from '../components/UserCard'
import MapCard from '../components/MapCard'
import Header from '../components/Header'
import SideMenu from '../components/SideMenu'


import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

export default function Dashboard() {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const theme = useTheme()
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

    return (
        <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f5f5f5' }}>
            <SideMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <Header onMenuClick={() => setDrawerOpen(true)} />
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={7}><PlannerCard /></Grid>
                        <Grid item xs={12} md={5}><BudgetCard /></Grid>
                        <Grid item xs={12} md={6}><UserCard /></Grid>
                        <Grid item xs={12} md={6}><MapCard /></Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    )
}