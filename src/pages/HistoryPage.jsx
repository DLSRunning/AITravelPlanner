import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { Typography, Card, CardContent, Grid, CircularProgress } from '@mui/material'

export default function HistoryPage() {
    const [plans, setPlans] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchPlans = async () => {
            const { data: user } = await supabase.auth.getUser()
            const userId = user.user.id
            const { data } = await supabase
                .from('travel_plans')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
            setPlans(data)
        }
        fetchPlans()
    }, [])

    if (!plans) return <CircularProgress />

    return (
        <>
            <Typography variant="h5" gutterBottom>历史行程</Typography>
            <Grid container spacing={2}>
                {plans.map((plan) => (
                    <Grid item xs={12} md={6} lg={4} key={plan.id}>
                        <Card sx={{ cursor: 'pointer' }} onClick={() => navigate(`/plan/${plan.id}`)}>
                            <CardContent>
                                <Typography variant="h6">{plan.title}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {plan.destination} | {plan.start_date} ~ {plan.end_date}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    )
}
