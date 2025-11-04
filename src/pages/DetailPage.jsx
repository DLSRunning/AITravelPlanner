import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import {
    Typography,
    Grid,
    Box,
    CircularProgress,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Divider,
    Paper,
    Chip,
    Stack,
} from '@mui/material'
import { Map, APILoader } from '@uiw/react-baidu-map';

export default function DetailPage() {
    const { id } = useParams()
    const [plan, setPlan] = useState(null)
    const [itineraries, setItineraries] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedDay, setSelectedDay] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: planData, error: planError } = await supabase
                    .from('travel_plans')
                    .select('*')
                    .eq('id', id)
                    .single()
                if (planError) throw planError

                const { data: itineraryData, error: itineraryError } = await supabase
                    .from('travel_itineraries')
                    .select('*')
                    .eq('plan_id', id)
                    .order('day_number')
                if (itineraryError) throw itineraryError

                setPlan(planData)
                setItineraries(itineraryData || [])
                if (itineraryData?.length > 0) {
                    setSelectedDay(itineraryData[0].day_number) // 默认选中第一天
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id])

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                bgcolor="#f5f7fa"
            >
                <CircularProgress size={60} thickness={5} />
            </Box>
        )
    }

    if (!plan) {
        return (
            <Box textAlign="center" mt={8}>
                <Typography variant="h5" color="error">
                    未能加载旅行计划，请稍后再试。
                </Typography>
            </Box>
        )
    }

    const selectedItinerary = itineraries.find((it) => it.day_number === selectedDay)

    return (
        <Box
            sx={{
                minHeight: '80vh',
                bgcolor: '#f5f7fa',
                p: { xs: 2, md: 3 },
            }}
        >
            <Grid container spacing={3} sx={{ height: 'calc(100vh - 160px)' }}>
                {/* 左侧：行程选择 */}
                <Grid
                    item
                    xs={12}
                    md={2.5}
                    sx={{ display: 'flex', height: '90%' }}
                >
                    <Paper
                        elevation={4}
                        sx={{
                            borderRadius: 3,
                            overflow: 'hidden',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            bgcolor: '#ffffff',
                        }}
                    >
                        <Box
                            sx={{
                                p: 2.5,
                                bgcolor: 'primary.main',
                                color: 'white',
                            }}
                        >
                            <Typography variant="h6" fontWeight="bold">
                                行程日程
                            </Typography>
                        </Box>
                        <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
                            {itineraries.map((it) => (
                                <ListItem key={it.id} disablePadding>
                                    <ListItemButton
                                        selected={it.day_number === selectedDay}
                                        onClick={() => setSelectedDay(it.day_number)}
                                        sx={{
                                            py: 2,
                                            px: 3,
                                            borderLeft: 4,
                                            borderColor:
                                                it.day_number === selectedDay ? 'primary.main' : 'transparent',
                                            bgcolor:
                                                it.day_number === selectedDay
                                                    ? 'primary.50'
                                                    : 'transparent',
                                            '&:hover': {
                                                bgcolor: 'grey.100',
                                            },
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        <ListItemText
                                            primary={`第 ${it.day_number} 天`}
                                            secondary={it.location}
                                            primaryTypographyProps={{
                                                fontWeight: 'bold',
                                                color: it.day_number === selectedDay ? 'primary.main' : 'inherit',
                                            }}
                                            secondaryTypographyProps={{ fontSize: '0.875rem' }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* 中间：行程详情 */}
                <Grid
                    item
                    xs={12}
                    md={3.5}
                    sx={{ display: 'flex', height: '90%' }}
                >
                    <Paper
                        elevation={4}
                        sx={{
                            borderRadius: 3,
                            p: 3,
                            width: '100%',
                            overflowY: 'auto',
                            bgcolor: '#ffffff',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {selectedItinerary ? (
                            <>
                                <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                                    第 {selectedItinerary.day_number} 天 · {selectedItinerary.location}
                                </Typography>

                                <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                                    <Chip label={selectedItinerary.transportation} size="small" color="info" />
                                    <Chip label={selectedItinerary.accommodation} size="small" color="success" />
                                </Stack>

                                <Divider sx={{ my: 2 }} />

                                {/* 活动安排 */}
                                <Typography variant="h6" gutterBottom color="text.primary">
                                    活动安排
                                </Typography>
                                <Stack spacing={1} mb={3}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            上午
                                        </Typography>
                                        <Typography>{selectedItinerary.activities?.morning || '自由活动'}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            下午
                                        </Typography>
                                        <Typography>{selectedItinerary.activities?.afternoon || '自由活动'}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            晚上
                                        </Typography>
                                        <Typography>{selectedItinerary.activities?.evening || '自由活动'}</Typography>
                                    </Box>
                                </Stack>

                                {/* 餐饮安排 */}
                                <Typography variant="h6" gutterBottom color="text.primary">
                                    餐饮安排
                                </Typography>
                                <Stack spacing={1}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            早餐
                                        </Typography>
                                        <Typography>{selectedItinerary.meals?.breakfast || '自理'}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            午餐
                                        </Typography>
                                        <Typography>{selectedItinerary.meals?.lunch || '自理'}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            晚餐
                                        </Typography>
                                        <Typography>{selectedItinerary.meals?.dinner || '自理'}</Typography>
                                    </Box>
                                </Stack>
                            </>
                        ) : (
                            <Typography color="text.secondary" textAlign="center" mt={4}>
                                请选择一个行程日期
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                {/* 右侧：地图 */}
                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{ display: 'flex', height: '90%' }}
                >
                    <Paper
                        elevation={4}
                        sx={{
                            borderRadius: 3,
                            overflow: 'hidden',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            bgcolor: '#ffffff',
                        }}
                    >
                        <Box
                            sx={{
                                p: 2.5,
                                bgcolor: 'grey.900',
                                color: 'white',
                            }}
                        >
                            <Typography variant="h6" fontWeight="bold">
                                地图位置
                            </Typography>
                        </Box>
                        <Box sx={{ flex: 1, position: 'relative'}}>
                            {selectedItinerary ? (
                                <APILoader akay="LVrZWFDaAQV3VaxnT2EKjwoKfpFLz2iv">
                                    <Map
                                        style={{ width: '100%', height: '100%' }}
                                        center={{ lng: selectedItinerary.position.lng, lat: selectedItinerary.position.lat }}
                                        zoom={20}
                                        enableScrollWheelZoom={true}
                                        enableDragging={true}
                                        enableDoubleClickZoom={true}
                                    />
                                </APILoader>
                            ) : (
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    height="100%"
                                    bgcolor="#f0f0f0"
                                >
                                    <Typography color="text.secondary">
                                        请选择行程查看地图
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}