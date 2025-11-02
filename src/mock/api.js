export async function generateItinerary({ destination, days, budget, people, preferences }) {
    // 模拟延迟
    await new Promise(r => setTimeout(r, 700))
    return {
        title: `为 ${destination} 生成的 ${days} 天行程（示例）`,
        items: [
            { day: 1, summary: `抵达 ${destination}，入住酒店，城市散策。` },
            { day: 2, summary: '推荐景点 A、餐厅 B（美食）' },
            { day: 3, summary: '推荐景点 C（适合孩子）' },
            { day: 4, summary: '自由活动 + 购物' },
            { day: 5, summary: '返程' }
        ],
        budgetAnalysis: `预算 ${budget} 元，推荐每日平均花费 ${(budget / (days || 1)).toFixed(2)} 元（示例）。`
    }
}