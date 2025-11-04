import React, { useState, useEffect } from 'react'
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    IconButton,
    InputAdornment,
    LinearProgress,
    Zoom,
    Stack,
    Chip,
} from '@mui/material'
import {
    Email,
    Lock,
    Person,
    Visibility,
    VisibilityOff,
    TravelExplore,
    AutoAwesome,
} from '@mui/icons-material'
import { signUp, signIn } from '../services/authService'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
    const [isRegister, setIsRegister] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const { setUser } = useAuth()
    const navigate = useNavigate()

    // 表单校验
    const validate = () => {
        const newErrors = {}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!email) newErrors.email = '请输入邮箱'
        else if (!emailRegex.test(email)) newErrors.email = '邮箱格式不正确'

        if (!password) newErrors.password = '请输入密码'
        else if (password.length < 6) newErrors.password = '密码至少6位'

        if (isRegister) {
            if (!username.trim()) newErrors.username = '请输入用户名'
            else if (username.length < 2) newErrors.username = '用户名至少2位'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate() || loading) return

        setLoading(true)
        try {
            let user
            if (isRegister) {
                user = await signUp(email, password, username)
            } else {
                user = await signIn(email, password)
            }
            setUser(user)
            navigate('/history') // 登录后跳转到历史页
        } catch (err) {
            setErrors({ submit: err.message || '操作失败，请重试' })
        } finally {
            setLoading(false)
        }
    }

    // 切换动画延迟
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
            }}
        >
            <Zoom in={mounted} style={{ transitionDelay: '100ms' }}>
                <Paper
                    elevation={12}
                    sx={{
                        borderRadius: 4,
                        overflow: 'hidden',
                        width: '100%',
                        maxWidth: 420,
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
                            {isRegister ? '注册账号' : '欢迎回来'}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                            {isRegister ? '加入 AI 旅行助手' : '登录查看您的智能行程'}
                        </Typography>
                    </Box>

                    {/* 表单区 */}
                    <Box sx={{ p: 4 }}>
                        {loading && (
                            <Box sx={{ width: '100%', mb: 2 }}>
                                <LinearProgress />
                            </Box>
                        )}

                        <form onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                {/* 注册时显示用户名 */}
                                <Zoom in={isRegister} style={{ transitionDelay: '50ms' }}>
                                    <div>
                                        {isRegister && (
                                            <TextField
                                                fullWidth
                                                label="用户名"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                disabled={loading}
                                                error={!!errors.username}
                                                helperText={errors.username}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Person color="action" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        )}
                                    </div>
                                </Zoom>

                                {/* 邮箱 */}
                                <TextField
                                    fullWidth
                                    label="邮箱地址"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Email color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                {/* 密码 */}
                                <TextField
                                    fullWidth
                                    label="密码"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    error={!!errors.password}
                                    helperText={errors.password || (isRegister ? '至少6位' : '')}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock color="action" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                    disabled={loading}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                {/* 提交按钮 */}
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={loading}
                                    sx={{
                                        py: 1.6,
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        borderRadius: 3,
                                        boxShadow: 3,
                                        bgcolor: 'primary.main',
                                        '&:hover': { bgcolor: 'primary.dark' },
                                    }}
                                    startIcon={loading ? <AutoAwesome className="animate-spin" /> : null}
                                >
                                    {loading ? '处理中...' : isRegister ? '立即注册' : '登录'}
                                </Button>

                                {/* 错误提示 */}
                                {errors.submit && (
                                    <Typography color="error" textAlign="center" variant="body2">
                                        {errors.submit}
                                    </Typography>
                                )}
                            </Stack>
                        </form>

                        {/* 切换登录/注册 */}
                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Button
                                color="inherit"
                                onClick={() => {
                                    setIsRegister(!isRegister)
                                    setErrors({})
                                }}
                                disabled={loading}
                                sx={{
                                    textTransform: 'none',
                                    fontSize: '0.95rem',
                                    '&:hover': { bgcolor: 'grey.100' },
                                    borderRadius: 2,
                                    px: 2,
                                }}
                            >
                                {isRegister ? (
                                    <>已有账号？<Typography component="span" color="primary" fontWeight="bold" ml={0.5}>立即登录</Typography></>
                                ) : (
                                    <>没有账号？<Typography component="span" color="primary" fontWeight="bold" ml={0.5}>免费注册</Typography></>
                                )}
                            </Button>
                        </Box>

                        {/* 品牌标签 */}
                        <Stack direction="row" justifyContent="center" spacing={1} mt={4}>
                            <Chip
                                icon={<AutoAwesome fontSize="small" />}
                                label="AI 智能行程"
                                size="small"
                                color="secondary"
                                variant="outlined"
                            />
                        </Stack>
                    </Box>
                </Paper>
            </Zoom>
        </Box>
    )
}