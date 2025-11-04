import React, { useState, useEffect } from 'react'
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Zoom,
    Box,
    useTheme,
    useMediaQuery,
} from '@mui/material'
import {
    Menu as MenuIcon,
    TravelExplore,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Header({ onMenuClick }) {
    const { user, setUser, darkMode, toggleDarkMode } = useAuth()
    const navigate = useNavigate()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    background: darkMode
                        ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    borderBottomLeftRadius: { xs: 0, md: 16 },
                    borderBottomRightRadius: { xs: 0, md: 16 },
                    transition: 'all 0.4s ease',
                }}
            >
                <Toolbar sx={{ height: 70, px: { xs: 1, md: 3 } }}>
                    {/* 左侧菜单按钮 */}
                    <Zoom in={mounted} style={{ transitionDelay: '50ms' }}>
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={onMenuClick}
                            sx={{
                                mr: 2,
                                bgcolor: 'rgba(255,255,255,0.15)',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Zoom>

                    {/* Logo + 标题 */}
                    <Zoom in={mounted} style={{ transitionDelay: '100ms' }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                flexGrow: 1,
                            }}
                            onClick={() => navigate('/history')}
                        >
                            <TravelExplore sx={{ fontSize: 32, mr: 1.5 }} />
                            {!isMobile && (
                                <Typography
                                    variant="h5"
                                    fontWeight="bold"
                                    sx={{
                                        background: 'linear-gradient(90deg, #fff, #e0f2ff)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        letterSpacing: '0.5px',
                                    }}
                                >
                                    智能行程规划
                                </Typography>
                            )}
                        </Box>
                    </Zoom>
                </Toolbar>
            </AppBar>
        </>
    )
}