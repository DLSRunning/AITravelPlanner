import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { loadPlans, clearPlans } from '../services/storage'
import { currentUser } from '../services/auth'


export default function UserCard() {
    const user = currentUser()
    const plans = loadPlans()


    return (
        <Card>
            <CardContent>
                <Typography variant="h6">用户与云端同步（占位）</Typography>
                <Typography>当前用户：{user ? user.username : '未登录'}</Typography>
                <Typography sx={{ mt: 1 }}>已保存计划（本地示例）：{plans.length} 个</Typography>
                <div style={{ marginTop: 12 }}>
                    <Button variant="outlined" sx={{ mr: 1 }} onClick={() => alert('云端同步占位 — 后续实现')}>云端同步（占位）</Button>
                    <Button variant="text" onClick={() => { clearPlans(); alert('本地示例计划已清除') }}>清除本地计划</Button>
                </div>
            </CardContent>
        </Card>
    )
}