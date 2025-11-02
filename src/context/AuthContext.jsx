import React, { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser, signOut } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadUser() {
            try {
                const u = await getCurrentUser()
                if (u) {
                    setUser(u)
                }
            } catch (error) {
                console.warn('getCurrentUser error:', error)
            } finally {
                setLoading(false)
            }
        }
        loadUser()
    }, [])

    const logout = async () => {
        try {
            await signOut()
        } catch (error) {
            console.error('signOut error:', error)
        } finally {
            setUser(null)
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
