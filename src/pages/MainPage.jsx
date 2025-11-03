import React, { useState } from 'react'
import { TextField, Button, Grid, Paper, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function MainPage() {
    const [form, setForm] = useState({
        title: '',
        destination: '',
        start_date: '',
        end_date: '',
        budget: '',
        people_count: 1,
        preferences: ''
    })
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { data: user } = await supabase.auth.getUser()
        const userId = user.user.id

        const { data, error } = await supabase
            .from('travel_plans')
            .insert([{ ...form, user_id: userId }])
            .select()

        if (!error && data?.length > 0) {
            navigate(`/plan/${data[0].id}`)
        }
    }

    return (
        <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom>新建旅行计划</Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}><TextField fullWidth label="计划标题" name="title" value={form.title} onChange={handleChange} required /></Grid>
                    <Grid item xs={12}><TextField fullWidth label="目的地" name="destination" value={form.destination} onChange={handleChange} required /></Grid>
                    <Grid item xs={6}><TextField type="date" fullWidth label="开始日期" name="start_date" value={form.start_date} onChange={handleChange} InputLabelProps={{ shrink: true }} required /></Grid>
                    <Grid item xs={6}><TextField type="date" fullWidth label="结束日期" name="end_date" value={form.end_date} onChange={handleChange} InputLabelProps={{ shrink: true }} required /></Grid>
                    <Grid item xs={6}><TextField fullWidth label="预算" name="budget" value={form.budget} onChange={handleChange} /></Grid>
                    <Grid item xs={6}><TextField fullWidth label="人数" name="people_count" value={form.people_count} onChange={handleChange} type="number" /></Grid>
                    <Grid item xs={12}><TextField fullWidth multiline rows={3} label="旅行偏好" name="preferences" value={form.preferences} onChange={handleChange} /></Grid>
                    <Grid item xs={12}><Button fullWidth variant="contained" type="submit">创建计划</Button></Grid>
                </Grid>
            </form>
        </Paper>
    )
}
