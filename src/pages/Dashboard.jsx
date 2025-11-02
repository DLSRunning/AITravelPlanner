import React from 'react'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import PlannerCard from '../components/PlannerCard'
import BudgetCard from '../components/BudgetCard'
import UserCard from '../components/UserCard'
import MapCard from '../components/MapCard'


export default function Dashboard() {
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={7}><PlannerCard /></Grid>
                <Grid item xs={12} md={5}><BudgetCard /></Grid>
                <Grid item xs={12} md={6}><UserCard /></Grid>
                <Grid item xs={12} md={6}><MapCard /></Grid>
            </Grid>
        </Container>
    )
}