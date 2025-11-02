import { useEffect, useRef, useState } from 'react'


export default function useSpeech() {
    const recognitionRef = useRef(null)
    const [supported, setSupported] = useState(false)
    const [listening, setListening] = useState(false)
    const [error, setError] = useState(null)
    const [transcript, setTranscript] = useState('')


    useEffect(() => {
        const win = window
        const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition
        if (!SpeechRecognition) {
            setSupported(false)
            return
        }
        setSupported(true)
        const r = new SpeechRecognition()
        r.lang = 'zh-CN'
        r.interimResults = true
        r.maxAlternatives = 1


        r.onresult = (e) => {
            let text = ''
            for (let i = 0; i < e.results.length; i++) {
                text += e.results[i][0].transcript
            }
            setTranscript(text)
        }
        r.onerror = (e) => {
            setError(e.error || e.message || 'speech error')
        }
        r.onend = () => {
            setListening(false)
        }
        recognitionRef.current = r
    }, [])


    function start() {
        setError(null)
        if (!recognitionRef.current) return
        try {
            recognitionRef.current.start()
            setListening(true)
            setTranscript('')
        } catch (e) {
            setError(e.message)
        }
    }
    function stop() {
        if (!recognitionRef.current) return
        recognitionRef.current.stop()
        setListening(false)
    }


    return { supported, listening, transcript, error, start, stop }
}