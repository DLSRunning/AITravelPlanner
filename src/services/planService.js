import { supabase } from '../lib/supabaseClient'
import { getCurrentUser } from './authService'

export async function createPlan(plan) {
    const user = getCurrentUser()
    if (!user) throw new Error('Not logged in')

    const payload = {
        ...plan,
        user_id: user.id,
    }

    const { data, error } = await supabase
        .from('travel_plans')
        .insert([payload])
        .select()
        .single()

    if (error) throw error
    return data
}

export async function getUserPlans() {
    const user = getCurrentUser()
    if (!user) throw new Error('Not logged in')

    const { data, error } = await supabase
        .from('travel_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export async function updatePlan(planId, updates) {
    const { data, error } = await supabase
        .from('travel_plans')
        .update(updates)
        .eq('id', planId)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function deletePlan(planId) {
    const { error } = await supabase.from('travel_plans').delete().eq('id', planId)
    if (error) throw error
    return true
}
