

import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import DashboardIcon from '@mui/icons-material/Dashboard'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


export default function Header({ onMenuClick }) {
    const nav = useNavigate()
    const { user, logout } = useAuth()

    return (
        <AppBar position="static">
            <Toolbar>
                {onMenuClick && (
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={onMenuClick}
                        sx={{ mr: 2 }}
                        aria-label="open drawer"
                    >
                        <DashboardIcon />
                    </IconButton>
                )}
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    React Travel Planner (Material) — 占位框架
                </Typography>
                {user ? (
                    <>
                        <Typography sx={{ mr: 2 }}>{user.username}</Typography>
                        <Button color="inherit" onClick={async () => { await logout(); nav('/login') }}>登出</Button>
                    </>
                ) : (
                    <Button color="inherit" onClick={() => nav('/login')}>登录</Button>
                )}
            </Toolbar>
        </AppBar>
    )
}