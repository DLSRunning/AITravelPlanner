// src/services/authService.js
import { supabase } from '../lib/supabaseClient'

export async function signUp(email, password, username) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { username },
        },
    })
    if (error) throw error
    return data
}

export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })
    if (error) throw error
    return data
}

export async function signOut() {
    await supabase.auth.signOut()
}

export async function getCurrentUser() {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return data.user
}
