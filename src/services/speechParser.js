// services/speechParser.js
import axios from 'axios'

const API_KEY = import.meta.env.VITE_QWEN_API_KEY

export async function parseSpeechToForm(speech, startDate = '', endDate = '') {
    const system = `
你是一个旅行计划语音解析助手。请从用户语音中提取以下字段，并以JSON格式返回：

字段说明：
- title: 旅行标题（简短描述，如“北京亲子游”）
- destination: 目的地（城市或景点）
- start_date: 开始日期（YYYY-MM-DD）
- end_date: 结束日期（YYYY-MM-DD）
- budget: 预算（数字）
- people_count: 人数（数字）
- preferences: 偏好（字符串，多个用逗号分隔）

规则：
1. 日期优先使用用户说的“明天”“后天”“下周一”等，结合当前日期${new Date().toISOString().split('T')[0]}
2. 若未说明日期，使用 ${startDate || '当前日期后一天'} 到 ${endDate || '当前日期后三天'}
3. 预算若说“五千块”“一千多”，转为数字
4. 人数默认1，若说“一家三口”“我们两个人”，提取数字
5. 偏好提取关键词，如“美食”“拍照”“亲子”“避开人多”

只返回纯JSON，不要任何说明。
`

    const response = await axios.post(
        'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        {
            model: 'qwen3-max',
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: `语音内容：${speech}` }
            ],
            response_format: { type: 'json_object' }
        },
        { headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' } }
    )

    try {
        const result = JSON.parse(response.data.choices[0].message.content)
        return {
            title: result.title || `去${result.destination || '旅行'}`,
            destination: result.destination || '',
            start_date: result.start_date || '',
            end_date: result.end_date || '',
            budget: result.budget ? String(result.budget) : '',
            people_count: result.people_count || 1,
            preferences: result.preferences || ''
        }
    } catch {
        return {}
    }
}