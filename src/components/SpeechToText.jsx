// components/SpeechInputButton.jsx
import React, { useState, useRef, useEffect } from 'react'
import { IconButton, Tooltip, Box, Typography } from '@mui/material'
import { Mic, MicOff } from '@mui/icons-material'
import CryptoJS from 'crypto-js'

const APP_ID = import.meta.env.VITE_XFYUN_APP_ID
const API_KEY = import.meta.env.VITE_XFYUN_API_KEY
const API_SECRET = import.meta.env.VITE_XFYUN_API_SECRET
const HOST = 'iat-api.xfyun.cn'
const URI = '/v2/iat'

// 调试：环境变量

export default function SpeechInputButton({ onTranscript }) {
    const [isRecording, setIsRecording] = useState(false)
    const [status, setStatus] = useState('')
    const [error, setError] = useState('')

    const wsRef = useRef(null)
    const audioContextRef = useRef(null)
    const processorRef = useRef(null)
    const streamRef = useRef(null)
    const resultCacheRef = useRef(new Map()) // 缓存每个 sn 的最终词
    const currentTextRef = useRef('')
    const bufferCacheRef = useRef([])
    const firstFrameSentRef = useRef(false)  // 空首帧标记
    const firstRealFrameSentRef = useRef(false)  // 带音频首帧标记

    // 全局单例 AudioContext
    const globalAudioContextRef = useRef(null)

    const getAudioContext = () => {
        if (!globalAudioContextRef.current || globalAudioContextRef.current.state === 'closed') {
            const AudioContext = window.AudioContext || window.webkitAudioContext
            globalAudioContextRef.current = new AudioContext({
                sampleRate: 16000,
                latencyHint: 'interactive'
            })
        }
        return globalAudioContextRef.current
    }

    const getAuthUrl = () => {
        const now = new Date()
        const date = now.toUTCString()
        const signatureOrigin = `host: ${HOST}\ndate: ${date}\nGET ${URI} HTTP/1.1`
        const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, API_SECRET)
        const signature = CryptoJS.enc.Base64.stringify(signatureSha)
        const authorizationOrigin = `api_key="${API_KEY}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`
        const authorization = btoa(authorizationOrigin)
        const url = `wss://${HOST}${URI}?authorization=${authorization}&date=${encodeURIComponent(date)}&host=${HOST}`
        return url
    }

    const convertFloat32ToInt16 = (buffer) => {
        const l = buffer.length
        const result = new Int16Array(l)
        for (let i = 0; i < l; i++) {
            let s = Math.max(-1, Math.min(1, buffer[i]))
            result[i] = s < 0 ? s * 0x8000 : s * 0x7FFF
        }
        return result
    }

    const arrayBufferToBase64 = (buffer) => {
        let binary = ''
        const bytes = new Uint8Array(buffer)
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i])
        }
        return btoa(binary)
    }

    const startRecording = async () => {
        try {
            if (!APP_ID || !API_KEY || !API_SECRET) {
                throw new Error('认证参数缺失！检查 .env 文件')
            }

            setError('')
            setStatus('连接中...')
            bufferCacheRef.current = []
            firstFrameSentRef.current = false
            firstRealFrameSentRef.current = false

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: 16000,
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                }
            })
            streamRef.current = stream

            audioContextRef.current = getAudioContext()
            const source = audioContextRef.current.createMediaStreamSource(stream)
            const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1)
            processorRef.current = processor

            const ws = new WebSocket(getAuthUrl())
            wsRef.current = ws

            // 正常流程：发送续帧
            const sendContinuationFrame = (inputData) => {
                const maxAmp = Math.max(...inputData.map(Math.abs))

                if (maxAmp < 0.01) return  // 静音跳过

                const audioData = convertFloat32ToInt16(inputData)
                const base64 = arrayBufferToBase64(audioData.buffer)

                const frame = {
                    data: {
                        status: 1,
                        format: 'audio/L16;rate=16000',
                        encoding: 'raw',
                        audio: base64
                    }
                }
                ws.send(JSON.stringify(frame))
            }

            // 首次带音频首帧
            const sendFirstRealFrame = (inputData) => {
                const maxAmp = Math.max(...inputData.map(Math.abs))
                if (maxAmp < 0.01) return

                const audioData = convertFloat32ToInt16(inputData)
                const base64 = arrayBufferToBase64(audioData.buffer)

                const firstFrame = {
                    common: { app_id: APP_ID },
                    business: { language: 'zh_cn', domain: 'iat', accent: 'mandarin', dwa: 'wpgs', ptt: 1 },
                    data: { status: 0, format: 'audio/L16;rate=16000', encoding: 'raw', audio: base64 }
                }
                ws.send(JSON.stringify(firstFrame))
                firstRealFrameSentRef.current = true
                // 切换到续帧
                processor.onaudioprocess = (e) => sendContinuationFrame(e.inputBuffer.getChannelData(0))
            }

            processor.onaudioprocess = (e) => {
                if (!firstRealFrameSentRef.current) {
                    sendFirstRealFrame(e.inputBuffer.getChannelData(0))
                } else {
                    sendContinuationFrame(e.inputBuffer.getChannelData(0))
                }
            }

            ws.onopen = () => {
                setStatus('录音中...')
                setIsRecording(true)
                source.connect(processor)
                processor.connect(audioContextRef.current.destination)

                // 发送空首帧（建立会话）
                const initFrame = {
                    common: { app_id: APP_ID },
                    business: { language: 'zh_cn', domain: 'iat', accent: 'mandarin', dwa: 'wpgs', ptt: 1 },
                    data: { status: 0, format: 'audio/L16;rate=16000', encoding: 'raw', audio: '' }
                }
                ws.send(JSON.stringify(initFrame))
            }

            ws.onmessage = (e) => {
                try {
                    const data = JSON.parse(e.data)

                    // 错误处理
                    if (data.code !== 0) {
                        console.error('讯飞错误:', data.message)
                        setError(data.message)
                        return
                    }

                    const result = data.data?.result
                    if (!result) return

                    const { sn, pgs, ls, bg, ed, ws } = result

                    // 1. 中间结果更新（pgs === 'rpl' 表示替换）
                    if (pgs === 'rpl' && result.rg) {
                        // 替换模式：清除 rg 范围内的旧词
                        const [start, end] = result.rg.map(Number)
                        const words = currentTextRef.current.split('')
                        words.splice(start, end - start)
                        currentTextRef.current = words.join('')
                        resultCacheRef.current.clear() // 替换后清空缓存，等待新词
                    }

                    // 2. 存储当前 sn 的词（仅第一次或更新时）
                    if (ws && !resultCacheRef.current.has(sn)) {
                        const wordList = ws.map(word => ({
                            w: word.cw[0].w,
                            bg: bg,
                            ed: ed
                        }))
                        resultCacheRef.current.set(sn, wordList)
                    }

                    // 3. 重新构建完整文本（仅用未替换的部分）
                    let fullText = ''
                    const sortedKeys = Array.from(resultCacheRef.current.keys()).sort((a, b) => a - b)
                    for (const key of sortedKeys) {
                        const words = resultCacheRef.current.get(key)
                        if (words) {
                            fullText += words.map(w => w.w).join('')
                        }
                    }

                    // 4. 最后一句结束（ls === true）
                    if (ls === true && data.data.status === 2) {
                        currentTextRef.current = fullText
                        onTranscript(fullText.trim())

                        // 可选：清理缓存
                        resultCacheRef.current.clear()
                        currentTextRef.current = ''
                    } 
                } catch (err) {
                    console.error('解析错误:', err)
                }
            }

            ws.onerror = (err) => {
                console.error('WS Error:', err)
                setError('连接失败')
            }

            ws.onclose = () => {
                setIsRecording(false)
            }

        } catch (err) {
            setError('无麦克风权限')
            console.error(err)
        }
    }

    const stopRecording = () => {
        setIsRecording(false)
        setStatus('识别中...')

        if (wsRef.current?.readyState === WebSocket.OPEN) {
            const endFrame = {
                data: {
                    status: 2,
                    format: 'audio/L16;rate=16000',
                    encoding: 'raw',
                    audio: ''
                }
            }
            wsRef.current.send(JSON.stringify(endFrame))

            // 延迟 2 秒关闭，等待 status:2 结果
            setTimeout(() => {
                if (wsRef.current?.readyState === WebSocket.OPEN) {
                    wsRef.current.close()
                }
            }, 2000)
        }

        // 停止麦克风
        streamRef.current?.getTracks().forEach(t => t.stop())
        processorRef.current?.disconnect()
        audioContextRef.current?.close().catch(() => { })

        // 延迟清空引用
        setTimeout(() => {
            wsRef.current = null
            streamRef.current = null
            processorRef.current = null
            audioContextRef.current = null
            bufferCacheRef.current = []
            firstFrameSentRef.current = false
            firstRealFrameSentRef.current = false
        }, 2500)
    }

    useEffect(() => {
        return () => {
            if (isRecording) stopRecording()
        }
    }, [isRecording])

    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <Tooltip title={isRecording ? '停止录音' : '语音输入行程'} arrow>
                <IconButton
                    onClick={isRecording ? stopRecording : startRecording}
                    color={isRecording ? 'error' : 'primary'}
                    size="large"
                    sx={{
                        bgcolor: isRecording ? 'error.light' : 'primary.light',
                        color: 'white',
                        '&:hover': { bgcolor: isRecording ? 'error.dark' : 'primary.dark' },
                        boxShadow: 2,
                    }}
                >
                    {isRecording ? <MicOff /> : <Mic />}
                </IconButton>
            </Tooltip>
            {(status || error) && (
                <Typography
                    variant="caption"
                    sx={{
                        position: 'absolute',
                        top: 50,
                        whiteSpace: 'nowrap',
                        color: error ? 'error.main' : 'primary.main',
                        fontWeight: error ? 'bold' : 'normal'
                    }}
                >
                    {error || status}
                </Typography>
            )}
        </Box>
    )
}