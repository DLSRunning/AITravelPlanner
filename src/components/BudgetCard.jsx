import React, { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import useSpeech from '../hooks/useSpeech'


export default function BudgetCard() {
    const [records, setRecords] = useState([])
    const [note, setNote] = useState('')
    const [amount, setAmount] = useState('')
    const { supported, listening, transcript, start, stop } = useSpeech()


    function addRecord() {
        if (!amount) return alert('请输入金额')
        const rec = { id: Date.now(), amount: Number(amount), note: note || transcript || '手动', createdAt: new Date().toISOString() }
        setRecords(prev => [rec, ...prev])
        setNote('')
        setAmount('')
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">费用预算与管理（占位）</Typography>
                <Typography variant="body2">语音记录开销（占位）</Typography>
                <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
                    <TextField label="金额 (元)" value={amount} onChange={e => setAmount(e.target.value)} />
                    <TextField label="备注 / 语音转写" value={note || transcript} onChange={e => setNote(e.target.value)} />
                    <div>
                        {supported ? (
                            <Button onClick={() => listening ? stop() : start()}>{listening ? '停止录音' : '用语音记录费用'}</Button>
                        ) : (
                            <Typography variant="caption">语音识别不受支持</Typography>
                        )}
                        <Button variant="contained" sx={{ ml: 1 }} onClick={addRecord}>添加记录</Button>
                    </div>
                </div>


                <List>
                    {records.map(r => (
                        <ListItem key={r.id}>
                            <ListItemText primary={`¥ ${r.amount} — ${r.note}`} secondary={new Date(r.createdAt).toLocaleString()} />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    )
}