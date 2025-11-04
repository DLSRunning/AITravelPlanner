import axios from 'axios'

const API_KEY = import.meta.env.VITE_QWEN_API_KEY

export async function generateAIItineraries(plan) {
    const system = `
    你是一名专业的旅行规划AI助手，请根据以下信息为用户生成详细的旅行行程。生成的行程需满足以下要求：

    1. 请以JSON格式返回每日行程数组，行程信息包含：日期、位置、活动、餐饮、交通、住宿、每日开销等内容。
    2. 日期格式必须为YYYY-MM-DD，位置需要包含经纬度（latitude、longitude）坐标。
    3. 每日的餐饮安排必须包含早餐（breakfast）、午餐（lunch）和晚餐（dinner）。
    4. 每日的活动需详细列出，分别为：早上（morning）、下午（afternoon）和晚上（evening）。
    5. 预算需要合理分配至每一天，确保总体预算不会超支，同时保证活动内容丰富多样，涵盖景点、餐饮和交通等方面。
    6. 为确保旅行计划的合理性和多样性，尽量为用户提供不同风格的活动安排（如文化、休闲、户外等）。
    7. 每日开销（daily_expense）应根据预算比例进行分配，并考虑住宿和餐饮的费用。
    8. 请避免输出除JSON外的任何文字或解释。

    示例输入：  
    计划标题：北京二日游  
    目的地：北京  
    出发日期：2024-07-01  
    结束日期：2024-07-02  
    预算：5000 元  
    人数：2  
    旅行偏好：文化、历史、美食  

    输出示例：  
    [
        {
            "day_number": 1,
            "date": "2024-07-01",
            "location": "天安门广场附近",
            "position": {
                "lat": 39.908722,
                "lng": 116.397499
            },
            "transportation": "地铁",
            "accommodation": "北京饭店",
            "meals": { 
                "breakfast": "酒店自助餐", 
                "lunch": "全聚德烤鸭", 
                "dinner": "东来顺涮羊肉"
            },
            "activities": {
                "morning": "参观天安门广场和故宫",
                "afternoon": "游览王府井大街",
                "evening": "观看杂技表演"
            },
            "daily_expense": 1500
        },
        {
            "day_number": 2,
            "date": "2024-07-02",
            "location": "颐和园附近",
            "position": {
                "lat": 39.999999,
                "lng": 116.274610
            },
            "transportation": "公交",
            "accommodation": "北京饭店",
            "meals": { 
                "breakfast": "酒店自助餐", 
                "lunch": "农家菜", 
                "dinner": "北京烤鸭" 
            },
            "activities": {
                "morning": "游览颐和园",
                "afternoon": "参观圆明园遗址",
                "evening": "漫步后海酒吧街"
            },
            "daily_expense": 1200
        }
    ]
    
    注意：
    - 输出的日期、位置、活动、餐饮、交通、住宿等都需要根据用户输入的旅行偏好和预算进行合理安排。
    - 如果预算不足以涵盖用户需求，请尝试在不影响行程丰富度的情况下进行调整，或者提供多个行程选择。
`

    const prompt = `
    计划标题：${plan.title}
    目的地：${plan.destination}
    出发日期：${plan.start_date}
    结束日期：${plan.end_date}
    预算：${plan.budget} 元
    人数：${plan.people_count}
    旅行偏好：${plan.preferences}
`

    const response = await axios.post(
        'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        {
            model: 'qwen3-max',
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: prompt },
            ],
            response_format: { type: 'json_object' },
        },
        {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,                                          
                'Content-Type': 'application/json',
            },
        }
    );
    const result = response.data.choices[0].message.content

    try {
        return JSON.parse(result)
    } catch {
        console.error('AI返回格式不正确:', result)
        return []
    }
}
