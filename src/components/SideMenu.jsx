import React from 'react'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Box from '@mui/material/Box'
import { useNavigate } from 'react-router-dom'


export default function SideMenu({ open, onClose }) {
    const nav = useNavigate()
    return (
        <Drawer
            variant="temporary"
            anchor="left"
            open={open}
            onClose={onClose}
            ModalProps={{ keepMounted: true }}
            sx={{
                [`& .MuiDrawer-paper`]: { width: 240 },
                zIndex: 1300
            }}
        >
            <Box sx={{ mt: 2 }} />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => { nav('/new-plan'); onClose && onClose(); }}>
                        <ListItemText primary="新建行程" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => { nav('/history'); onClose && onClose(); }}>
                        <ListItemText primary="历史行程" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
    )
}