import React from 'react'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import TravelExploreIcon from '@mui/icons-material/TravelExplore'
import HistoryIcon from '@mui/icons-material/History'
import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate } from 'react-router-dom'
import { signOut } from '../services/authService'

const drawerWidth = 240

export default function SideMenu({ open, onClose }) {
    const navigate = useNavigate()

    const handleLogout = async () => {
        await signOut()
        navigate('/login')
    }

    return (
        <Drawer
            variant="temporary"
            open={open}
            onClose={onClose}
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 2,
                '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' }
            }}
        >
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => { navigate('/'); onClose(); }}>
                        <ListItemIcon><TravelExploreIcon /></ListItemIcon>
                        <ListItemText primary="新建计划" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => { navigate('/history'); onClose(); }}>
                        <ListItemIcon><HistoryIcon /></ListItemIcon>
                        <ListItemText primary="历史行程" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout}>
                        <ListItemIcon><LogoutIcon /></ListItemIcon>
                        <ListItemText primary="退出登录" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
    )
}
