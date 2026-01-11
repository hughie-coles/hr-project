import React, { createContext, useContext, useEffect, useState } from 'react'

type User = {
    id: string
    email?: string
    name?: string
    position?: string
    userType?: string
}

type AuthContextValue = {
    token: string | null
    user: User | null
    authenticated: boolean
    login: (token: string, user: User | null) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Always start with null to ensure server and client render the same
    const [token, setToken] = useState<string | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [mounted, setMounted] = useState(false)

    // Hydrate from localStorage after mount (client-side only)
    useEffect(() => {
        setMounted(true)
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')
        if (storedToken) setToken(storedToken)
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser))
            } catch (e) {
                // Invalid JSON, ignore
            }
        }
    }, [])

    useEffect(() => {
        if (!mounted) return
        
        function onStorage(e: StorageEvent) {
            if (e.key === 'token') setToken(e.newValue)
            if (e.key === 'user') setUser(e.newValue ? JSON.parse(e.newValue) : null)
        }

        window.addEventListener('storage', onStorage)
        return () => window.removeEventListener('storage', onStorage)
    }, [mounted])

    function login(t: string, u: User | null) {
        setToken(t)
        setUser(u)
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', t)
            if (u) localStorage.setItem('user', JSON.stringify(u))
            else localStorage.removeItem('user')
        }
    }

    function logout() {
        setToken(null)
        setUser(null)
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        }
    }

    const value: AuthContextValue = {
        token,
        user,
        authenticated: !!token,
        login,
        logout,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
