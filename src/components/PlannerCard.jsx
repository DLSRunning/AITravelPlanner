import React, { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import { generateItinerary } from '../mock/api'
import useSpeech from '../hooks/useSpeech'
import { savePlan } from '../services/storage'


export default function PlannerCard() {
    const [form, setForm] = useState({ destination: '日本', days: 5, budget: 10000, people: 2, preferences: '美食, 动漫' })
    const [loading, setLoading] = useState(false)
    const [itinerary, setItinerary] = useState(null)
    const { supported, listening, transcript, error, start, stop } = useSpeech()


    async function handleGenerate() {
        setLoading(true)
        try {
            const res = await generateItinerary(form)
            setItinerary(res)
        } finally {
            setLoading(false)
        }
    }


    function handleSave() {
        const plan = { id: Date.now(), createdAt: new Date().toISOString(), meta: form, itinerary }
        savePlan(plan)
        alert('计划已保存（本地存储示例）')
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">智能行程规划（占位）</Typography>
                <Box sx={{ mt: 2, display: 'grid', gap: 1 }}>
                    <TextField label="目的地" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} />
                    <TextField label="天数" type="number" value={form.days} onChange={e => setForm({ ...form, days: Number(e.target.value) })} />
                    <TextField label="预算 (元)" type="number" value={form.budget} onChange={e => setForm({ ...form, budget: Number(e.target.value) })} />
                    <TextField label="同行人数" type="number" value={form.people} onChange={e => setForm({ ...form, people: Number(e.target.value) })} />
                    <TextField label="旅行偏好（逗号分隔）" value={form.preferences} onChange={e => setForm({ ...form, preferences: e.target.value })} />
                </Box>


                <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Button variant="contained" onClick={handleGenerate} disabled={loading}>{loading ? '生成中...' : '生成行程'}</Button>
                    <Button variant="outlined" onClick={handleSave} disabled={!itinerary}>保存计划</Button>
                    <Box>
                        {supported ? (
                            <>
                                <Button variant="text" onClick={() => listening ? stop() : start()}>{listening ? '停止录音' : '用语音填写（占位）'}</Button>
                                <Typography variant="caption">识别文本：{transcript}</Typography>
                            </>
                        ) : (
                            <Typography variant="caption">语音识别不受支持（占位）</Typography>
                        )}
                    </Box>
                </Box>


                <Box sx={{ mt: 2 }}>
                    {itinerary ? (
                        <>
                            <Typography variant="subtitle1">{itinerary.title}</Typography>
                            <Typography>{itinerary.budgetAnalysis}</Typography>
                            {itinerary.items.map(it => (
                                <Box key={it.day} sx={{ mt: 1 }}>
                                    <Typography variant="body2">第 {it.day} 天 — {it.summary}</Typography>
                                </Box>
                            ))}
                        </>
                    ) : (
                        <Typography sx={{ mt: 1 }}>AI 生成内容将在此显示（占位）。</Typography>
                    )}
                </Box>
            </CardContent>
        </Card>
    )
}