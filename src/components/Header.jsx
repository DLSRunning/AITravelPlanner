import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'


export default function Header() {
    const nav = useNavigate()


    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    React Travel Planner (Material) — 占位框架
                </Typography>
                {user ? (
                    <>
                        <Typography sx={{ mr: 2 }}>{user.username}</Typography>
                        <Button color="inherit" onClick={() => { logout(); nav('/login') }}>登出</Button>
                    </>
                ) : (
                    <Button color="inherit" onClick={() => nav('/login')}>登录</Button>
                )}
            </Toolbar>
        </AppBar>
    )
}