import { supabase } from '../lib/supabaseClient'

export async function createItinerary(itinerary) {
    const { data, error } = await supabase
        .from('travel_itineraries')
        .insert([itinerary])
        .select()
        .single()

    if (error) throw error
    return data
}

export async function getItinerariesByPlan(planId) {
    const { data, error } = await supabase
        .from('travel_itineraries')
        .select('*')
        .eq('plan_id', planId)
        .order('day_number', { ascending: true })

    if (error) throw error
    return data
}

export async function updateItinerary(itineraryId, updates) {
    const { data, error } = await supabase
        .from('travel_itineraries')
        .update(updates)
        .eq('id', itineraryId)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function deleteItinerary(itineraryId) {
    const { error } = await supabase
        .from('travel_itineraries')
        .delete()
        .eq('id', itineraryId)

    if (error) throw error
    return true
}
