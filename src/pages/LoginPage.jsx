import React, { useState } from 'react'
import { Box, Button, TextField, Typography, Paper } from '@mui/material'
import { signUp, signIn } from '../services/authService'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [isRegister, setIsRegister] = useState(false)
    const { setUser } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            let user
            if (isRegister) {
                user = await signUp(email, password, username)
            } else {
                user = await signIn(email, password)
            }
            setUser(user)
            navigate('/')
        } catch (err) {
            alert(err.message)
        }
    }

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            bgcolor="#f5f5f5"
        >
            <Paper sx={{ p: 4, width: 400 }}>
                <Typography variant="h5" mb={2}>
                    {isRegister ? '注册' : '登录'}
                </Typography>
                <form onSubmit={handleSubmit}>
                    {isRegister && (
                        <TextField
                            label="用户名"
                            fullWidth
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    )}
                    <TextField
                        label="邮箱"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="密码"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                        {isRegister ? '注册' : '登录'}
                    </Button>
                </form>
                <Button
                    color="secondary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => setIsRegister(!isRegister)}
                >
                    {isRegister ? '已有账号？登录' : '没有账号？注册'}
                </Button>
            </Paper>
        </Box>
    )
}
