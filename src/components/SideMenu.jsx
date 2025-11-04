import React, { useEffect, useState } from 'react'
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Box,
    Typography,
    Avatar,
    Stack,
    Chip,
    Zoom,
    useTheme,
} from '@mui/material'
import {
    TravelExplore,
    History,
    Logout,
    Add,
    AutoAwesome,
    AccountCircle,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { signOut } from '../services/authService'
import { useAuth } from '../context/AuthContext'

const drawerWidth = 280

export default function SideMenu({ open, onClose }) {
    const { user, darkMode } = useAuth()
    const navigate = useNavigate()
    const theme = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        if (open) setMounted(true)
    }, [open])

    const handleLogout = async () => {
        await signOut()
        navigate('/login')
        onClose()
    }

    const menuItems = [
        {
            text: '新建计划',
            icon: <Add />,
            path: '/new',
            color: 'success',
        },
        {
            text: '历史行程',
            icon: <History />,
            path: '/history',
            color: 'info',
        },
    ]

    const handleNavigate = (path) => {
        navigate(path)
        onClose()
    }

    return (
        <Drawer
            variant="temporary"
            open={open}
            onClose={onClose}
            ModalProps={{ keepMounted: true }}
            keepMounted={true}
            onBackdropClick={onClose}
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 2,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    bgcolor: darkMode ? 'grey.900' : 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(16px)',
                    borderRight: 'none',
                    boxShadow: '8px 0 32px rgba(0,0,0,0.12)',
                    borderTopRightRadius: { xs: 0, md: 24 },
                    borderBottomRightRadius: { xs: 0, md: 24 },
                    overflow: 'hidden',
                },
            }}
        >
            {/* 顶部用户信息区 */}
            <Box
                sx={{
                    p: 3,
                    background: darkMode
                        ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    textAlign: 'center',
                }}
            >
                <Zoom in={mounted} style={{ transitionDelay: '100ms' }}>
                    <Avatar
                        sx={{
                            width: 72,
                            height: 72,
                            mx: 'auto',
                            mb: 2,
                            bgcolor: 'rgba(255,255,255,0.25)',
                            border: '3px solid rgba(255,255,255,0.4)',
                            fontSize: '2rem',
                            fontWeight: 'bold',
                        }}
                    >
                        {user?.email?.[0]?.toUpperCase() || <AccountCircle />}
                    </Avatar>
                </Zoom>

                <Zoom in={mounted} style={{ transitionDelay: '150ms' }}>
                    <Typography variant="h6" fontWeight="bold" noWrap>
                        {user?.email?.split('@')[0] || '旅行者'}
                    </Typography>
                </Zoom>

                <Zoom in={mounted} style={{ transitionDelay: '200ms' }}>
                    <Stack direction="row" justifyContent="center" spacing={1} mt={1.5}>
                        <Chip
                            icon={<AutoAwesome fontSize="small" />}
                            label="AI 助手"
                            size="small"
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                fontWeight: 'bold',
                                '& .MuiChip-icon': { color: 'inherit' },
                            }}
                        />
                    </Stack>
                </Zoom>
            </Box>

            {/* 导航列表 */}
            <List sx={{ px: 2, pt: 2, flexGrow: 1 }}>
                {menuItems.map((item, index) => (
                    <Zoom
                        key={item.text}
                        in={mounted}
                        style={{ transitionDelay: `${250 + index * 80}ms` }}
                    >
                        <ListItem disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={() => handleNavigate(item.path)}
                                sx={{
                                    borderRadius: 3,
                                    bgcolor: 'transparent',
                                    '&:hover': {
                                        bgcolor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(102,126,234,0.08)',
                                        transform: 'translateX(4px)',
                                    },
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                    border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(102,126,234,0.15)'}`,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: item.color + '.main',
                                        minWidth: 44,
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                    }}
                                />
                                <TravelExplore
                                    sx={{
                                        fontSize: 18,
                                        opacity: 0.3,
                                        ml: 'auto',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    </Zoom>
                ))}
            </List>

            <Divider sx={{ mx: 2, borderColor: darkMode ? 'grey.700' : 'grey.300' }} />

            {/* 退出登录 */}
            <Box sx={{ p: 2 }}>
                <Zoom in={mounted} style={{ transitionDelay: '450ms' }}>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={handleLogout}
                            sx={{
                                borderRadius: 3,
                                bgcolor: 'error.50',
                                color: 'error.main',
                                '&:hover': {
                                    bgcolor: 'error.100',
                                    transform: 'translateX(4px)',
                                },
                                transition: 'all 0.3s ease',
                                border: '1px solid',
                                borderColor: 'error.200',
                            }}
                        >
                            <ListItemIcon sx={{ color: 'error.main', minWidth: 44 }}>
                                <Logout />
                            </ListItemIcon>
                            <ListItemText
                                primary="退出登录"
                                primaryTypographyProps={{
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                </Zoom>
            </Box>

            {/* 底部品牌 */}
            <Box
                sx={{
                    p: 2,
                    textAlign: 'center',
                    borderTop: `1px solid ${darkMode ? 'grey.800' : 'grey.200'}`,
                }}
            >
                <Typography variant="caption" color="text.secondary">
                    © 2025 智能行程规划系统
                </Typography>
            </Box>
        </Drawer>
    )
}