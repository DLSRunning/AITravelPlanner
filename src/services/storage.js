const PLANS_KEY = 'rtp_plans'


export function loadPlans() {
    const raw = localStorage.getItem(PLANS_KEY)
    return raw ? JSON.parse(raw) : []
}


export function savePlan(plan) {
    const all = loadPlans()
    all.push(plan)
    localStorage.setItem(PLANS_KEY, JSON.stringify(all))
}


export function clearPlans() {
    localStorage.removeItem(PLANS_KEY)
}