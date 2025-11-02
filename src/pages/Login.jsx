import React, { useState } from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { login } from '../services/auth'
import { useNavigate } from 'react-router-dom'


export default function Login() {
    const [username, setUsername] = useState('')
    const nav = useNavigate()


    function handleLogin() {
        if (!username) return alert('请输入用户名')
        login({ username })
        nav('/')
    }


    return (
        <Container maxWidth="sm" sx={{ mt: 6 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h5">登录（占位，模拟）</Typography>
                <TextField label="用户名" value={username} onChange={e => setUsername(e.target.value)} />
                <Button variant="contained" onClick={handleLogin}>登录</Button>
            </Box>
        </Container>
    )
}