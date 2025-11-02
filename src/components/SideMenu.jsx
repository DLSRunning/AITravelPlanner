import React from 'react'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Box from '@mui/material/Box'
import { useNavigate } from 'react-router-dom'


export default function SideMenu() {
    const nav = useNavigate()
    return (
        <Drawer variant="permanent" anchor="left" sx={{ width: 240, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: 240 } }}>
            <Box sx={{ mt: 2 }} />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => nav('/')}>
                        <ListItemText primary="仪表盘" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => nav('/login')}>
                        <ListItemText primary="登录/用户" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
    )
}