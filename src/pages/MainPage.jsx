import React, { useState } from 'react'
import {
    TextField,
    Button,
    Grid,
    Paper,
    Typography,
    Box,
    LinearProgress,
    Chip,
    Stack,
    InputAdornment,
    IconButton,
    Tooltip,
    Zoom,
} from '@mui/material'
import {
    TravelExplore,
    CalendarToday,
    AttachMoney,
    People,
    Edit,
    AutoAwesome,
    Send,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { generateAIItineraries } from '../services/aiService'

export default function MainPage() {
    const [form, setForm] = useState({
        title: '',
        destination: '',
        start_date: '',
        end_date: '',
        budget: '',
        people_count: 1,
        preferences: '',
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
        // 清除对应错误
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }))
        }
    }

    const validate = () => {
        const newErrors = {}
        if (!form.title.trim()) newErrors.title = '请填写计划标题'
        if (!form.destination.trim()) newErrors.destination = '请填写目的地'
        if (!form.start_date) newErrors.start_date = '请选择开始日期'
        if (!form.end_date) newErrors.end_date = '请选择结束日期'
        if (form.start_date && form.end_date && form.start_date > form.end_date) {
            newErrors.end_date = '结束日期不能早于开始日期'
        }
        if (form.people_count < 1) newErrors.people_count = '人数至少为 1'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (loading || !validate()) return
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('用户未登录')

            const { data: planData, error: planError } = await supabase
                .from('travel_plans')
                .insert([{ ...form, user_id: user.id }])
                .select()

            if (planError) throw planError

            const itineraries = await generateAIItineraries(form)

            if (itineraries?.length > 0) {
                const inserts = itineraries.map((it) =>
                    supabase.from('travel_itineraries').insert([
                        {
                            plan_id: planData[0].id,
                            day_number: it.day_number,
                            date: it.date,
                            location: it.location,
                            transportation: it.transportation,
                            accommodation: it.accommodation,
                            activities: it.activities,
                            meals: it.meals,
                            daily_expense: it.daily_expense,
                            position: it.position,
                        },
                    ])
                )
                await Promise.all(inserts)
            }

            navigate(`/plan/${planData[0].id}`)
        } catch (error) {
            console.error('创建失败:', error)
            setErrors({ submit: error.message || '创建失败，请重试' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box
            sx={{
                minHeight: '80vh',
                bgcolor: '#f5f7fa',
                display: 'flex',
                alignItems: 'center',
                py: { xs: 4, md: 6 },
                px: 2,
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    maxWidth: 700,
                    width: '100%',
                    mx: 'auto',
                    bgcolor: 'white',
                }}
            >
                {/* 顶部标题栏 */}
                <Box
                    sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        p: 3,
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <TravelExplore fontSize="large" />
                        新建旅行计划
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                        智能 AI 一键生成完整行程
                    </Typography>
                </Box>

                {/* 表单内容 */}
                <Box sx={{ p: { xs: 3, md: 4 } }}>
                    {loading && (
                        <Box sx={{ width: '100%', mb: 3 }}>
                            <LinearProgress />
                            <Typography variant="body2" color="primary" textAlign="center" mt={1}>
                                AI 正在为您生成行程...
                            </Typography>
                        </Box>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {/* 标题 */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="计划标题"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    error={!!errors.title}
                                    helperText={errors.title}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Edit color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            {/* 目的地 */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="目的地"
                                    name="destination"
                                    value={form.destination}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    error={!!errors.destination}
                                    helperText={errors.destination}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <TravelExplore color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            {/* 日期 */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="开始日期"
                                    name="start_date"
                                    value={form.start_date}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    error={!!errors.start_date}
                                    helperText={errors.start_date}
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CalendarToday fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="结束日期"
                                    name="end_date"
                                    value={form.end_date}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    error={!!errors.end_date}
                                    helperText={errors.end_date}
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CalendarToday fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            {/* 预算 & 人数 */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="预算（可选）"
                                    name="budget"
                                    value={form.budget}
                                    onChange={handleChange}
                                    disabled={loading}
                                    placeholder="例如：5000"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AttachMoney fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="出行人数"
                                    name="people_count"
                                    type="number"
                                    value={form.people_count}
                                    onChange={handleChange}
                                    disabled={loading}
                                    error={!!errors.people_count}
                                    helperText={errors.people_count || '至少 1 人'}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <People fontSize="small" />
                                            </InputAdornment>
                                        ),
                                        inputProps: { min: 1 },
                                    }}
                                />
                            </Grid>

                            {/* 偏好 */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="旅行偏好（可选）"
                                    name="preferences"
                                    value={form.preferences}
                                    onChange={handleChange}
                                    disabled={loading}
                                    placeholder="例如：喜欢海边、美食、拍照打卡，避免爬山..."
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                                <AutoAwesome color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                    AI 将根据您的偏好智能推荐行程
                                </Typography>
                            </Grid>

                            {/* 提交按钮 */}
                            <Grid item xs={12}>
                                <Tooltip title={loading ? '生成中...' : '点击创建'} TransitionComponent={Zoom}>
                                    <span>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            type="submit"
                                            disabled={loading}
                                            sx={{
                                                py: 1.8,
                                                fontSize: '1.1rem',
                                                fontWeight: 'bold',
                                                bgcolor: 'primary.main',
                                                '&:hover': { bgcolor: 'primary.dark' },
                                                transition: 'all 0.3s ease',
                                                boxShadow: 3,
                                            }}
                                            startIcon={loading ? <AutoAwesome className="animate-spin" /> : <Send />}
                                        >
                                            {loading ? 'AI 正在思考...' : '立即生成行程'}
                                        </Button>
                                    </span>
                                </Tooltip>
                            </Grid>

                            {/* 错误提示 */}
                            {errors.submit && (
                                <Grid item xs={12}>
                                    <Typography color="error" textAlign="center">
                                        {errors.submit}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </form>
                </Box>
            </Paper>
        </Box>
    )
}