import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import {
    Typography,
    Card,
    CardContent,
    Grid,
    Box,
    Chip,
    Stack,
    IconButton,
    Tooltip,
    Zoom,
    Skeleton,
    Paper,
    Button,
} from '@mui/material'
import {
    TravelExplore,
    CalendarToday,
    People,
    AttachMoney,
    Delete,
    Add,
    AutoAwesome,
} from '@mui/icons-material'
import { format } from 'date-fns'

export default function HistoryPage() {
    const [plans, setPlans] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchPlans = async () => {
            setLoading(true)
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    navigate('/login')
                    return
                }

                const { data, error } = await supabase
                    .from('travel_plans')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })

                if (error) throw error
                setPlans(data || [])
            } catch (error) {
                console.error('加载失败:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchPlans()
    }, [navigate])

    const handleDelete = async (planId, e) => {
        e.stopPropagation()
        if (!window.confirm('确定删除此旅行计划？')) return

        try {
            await supabase.from('travel_plans').delete().eq('id', planId)
            setPlans((prev) => prev.filter((p) => p.id !== planId))
        } catch (error) {
            console.error('删除失败:', error)
        }
    }

    // 骨架屏组件
    const SkeletonCard = () => (
        <Card sx={{ height: '100%', bgcolor: 'grey.50' }}>
            <CardContent>
                <Skeleton variant="text" width="80%" height={32} />
                <Skeleton variant="text" width="60%" sx={{ mt: 1 }} />
                <Stack direction="row" spacing={1} mt={2}>
                    <Skeleton variant="rectangular" width={60} height={24} borderRadius={2} />
                    <Skeleton variant="rectangular" width={70} height={24} borderRadius={2} />
                </Stack>
            </CardContent>
        </Card>
    )

    return (
        <Box
            sx={{
                minHeight: '80vh',
                bgcolor: '#f5f7fa',
                py: { xs: 4, md: 6 },
                px: 2,
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    maxWidth: 1400,
                    mx: 'auto',
                    bgcolor: 'white',
                }}
            >
                {/* 标题栏 */}
                <Box
                    sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        p: 3,
                        textAlign: 'center',
                    }}
                >
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                        }}
                    >
                        <TravelExplore fontSize="large" />
                        我的旅行计划
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                        所有 AI 智能生成的行程，一键查看
                    </Typography>
                </Box>

                {/* 内容区 */}
                <Box sx={{ p: { xs: 3, md: 4 } }}>
                    {/* 新建按钮 */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => navigate('/new')}
                            sx={{
                                borderRadius: 3,
                                px: 3,
                                py: 1.2,
                                fontWeight: 'bold',
                                boxShadow: 3,
                            }}
                        >
                            新建计划
                        </Button>
                    </Box>

                    {/* 加载状态 */}
                    {loading && (
                        <Grid container spacing={3}>
                            {[1, 2, 3].map((i) => (
                                <Grid item xs={12} sm={6} lg={4} key={i}>
                                    <SkeletonCard />
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {/* 空状态 */}
                    {!loading && plans?.length === 0 && (
                        <Box
                            textAlign="center"
                            py={8}
                            sx={{
                                bgcolor: 'grey.50',
                                borderRadius: 3,
                                border: '2px dashed',
                                borderColor: 'grey.300',
                            }}
                        >
                            <TravelExplore sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                暂无旅行计划
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mb={3}>
                                立即创建您的第一份 AI 智能行程
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<AutoAwesome />}
                                onClick={() => navigate('/new')}
                            >
                                开始创建
                            </Button>
                        </Box>
                    )}

                    {/* 计划列表 */}
                    {!loading && plans?.length > 0 && (
                        <Grid container spacing={3}>
                            {plans.map((plan) => {
                                const days =
                                    plan.end_date && plan.start_date
                                        ? Math.ceil(
                                            (new Date(plan.end_date) - new Date(plan.start_date)) / (1000 * 60 * 60 * 24)
                                        ) + 1
                                        : 0

                                return (
                                    <Grid item xs={12} sm={6} lg={4} key={plan.id}>
                                        <Zoom in={true} style={{ transitionDelay: `${plans.indexOf(plan) * 50}ms` }}>
                                            <Card
                                                sx={{
                                                    height: '100%',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    borderRadius: 3,
                                                    overflow: 'hidden',
                                                    boxShadow: 3,
                                                    '&:hover': {
                                                        transform: 'translateY(-8px)',
                                                        boxShadow: 8,
                                                    },
                                                }}
                                                onClick={() => navigate(`/plan/${plan.id}`)}
                                            >
                                                <CardContent sx={{ p: 3 }}>
                                                    {/* 标题 */}
                                                    <Typography
                                                        variant="h6"
                                                        fontWeight="bold"
                                                        noWrap
                                                        sx={{ mb: 1.5 }}
                                                    >
                                                        {plan.title}
                                                    </Typography>

                                                    {/* 目的地 + 日期 */}
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}
                                                    >
                                                        <TravelExplore fontSize="small" />
                                                        {plan.destination}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}
                                                    >
                                                        <CalendarToday fontSize="small" />
                                                        {plan.start_date} ~ {plan.end_date}
                                                        {days > 0 && `（${days} 天）`}
                                                    </Typography>

                                                    {/* 标签 */}
                                                    <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                                                        {plan.budget && (
                                                            <Chip
                                                                icon={<AttachMoney fontSize="small" />}
                                                                label={`¥${plan.budget}`}
                                                                size="small"
                                                                color="primary"
                                                                variant="outlined"
                                                            />
                                                        )}
                                                        <Chip
                                                            icon={<People fontSize="small" />}
                                                            label={`${plan.people_count}人`}
                                                            size="small"
                                                            color="info"
                                                            variant="outlined"
                                                        />
                                                        <Chip
                                                            icon={<AutoAwesome fontSize="small" />}
                                                            label="AI 生成"
                                                            size="small"
                                                            color="secondary"
                                                            variant="filled"
                                                        />
                                                    </Stack>

                                                    {/* 创建时间 + 删除 */}
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            mt: 'auto',
                                                        }}
                                                    >
                                                        <Typography variant="caption" color="text.secondary">
                                                            {format(new Date(plan.created_at), 'yyyy年MM月dd日')}
                                                        </Typography>
                                                        <Tooltip title="删除计划">
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={(e) => handleDelete(plan.id, e)}
                                                                sx={{
                                                                    bgcolor: 'error.50',
                                                                    '&:hover': { bgcolor: 'error.100' },
                                                                }}
                                                            >
                                                                <Delete fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Zoom>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    )}
                </Box>
            </Paper>
        </Box>
    )
}