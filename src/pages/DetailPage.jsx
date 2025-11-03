import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { Typography, Card, CardContent, Grid, CircularProgress } from '@mui/material'

export default function DetailPage() {
    const { id } = useParams()
    const [plan, setPlan] = useState(null)
    const [itineraries, setItineraries] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const { data: planData } = await supabase.from('travel_plans').select('*').eq('id', id).single()
            const { data: itineraryData } = await supabase.from('travel_itineraries').select('*').eq('plan_id', id).order('day_number')
            setPlan(planData)
            setItineraries(itineraryData || [])
        }
        fetchData()
    }, [id])

    if (!plan) return <CircularProgress />

    return (
        <>
            <Typography variant="h5" gutterBottom>{plan.title}</Typography>
            <Typography variant="subtitle1" gutterBottom>
                {plan.destination} | {plan.start_date} ~ {plan.end_date}
            </Typography>

            <Typography variant="h6" sx={{ mt: 3 }}>每日行程</Typography>
            <Grid container spacing={2}>
                {itineraries.map((it) => (
                    <Grid item xs={12} md={6} lg={4} key={it.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">第 {it.day_number} 天</Typography>
                                <Typography>地点: {it.location}</Typography>
                                <Typography>交通: {it.transportation}</Typography>
                                <Typography>住宿: {it.accommodation}</Typography>
                                <Typography>开销: {it.daily_expense || 0}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    )
}
