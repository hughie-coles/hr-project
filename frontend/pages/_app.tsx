import React, { useEffect, useState } from 'react'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { AuthProvider, useAuth } from '../context/AuthContext'

function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { authenticated } = useAuth()
    const [mounted, setMounted] = useState(false)

    // Wait for client-side hydration before checking auth
    useEffect(() => {
        // Small delay to ensure AuthContext has hydrated
        const timer = setTimeout(() => {
            setMounted(true)
        }, 0)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (!mounted) return // Don't check auth until after hydration
        
        const publicPaths = ['/login']
        const check = (url: string) => {
            const path = url.split('?')[0]
            // Check localStorage directly as a fallback to ensure we have the latest auth state
            const hasToken = typeof window !== 'undefined' && localStorage.getItem('token')
            const isAuthenticated = authenticated || !!hasToken
            
            // Only redirect if we're sure the user is not authenticated (after hydration)
            if (!isAuthenticated && !publicPaths.includes(path)) {
                router.push('/login')
            }
        }

        // initial check
        check(router.pathname)
        const handler = (url: string) => check(url)
        router.events.on('routeChangeStart', handler)
        return () => router.events.off('routeChangeStart', handler)
    }, [authenticated, router, mounted])

    // Don't render children until after hydration to prevent flash
    if (!mounted) {
        return null
    }

    return <>{children}</>
}

export default function App({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <AuthGuard>
                <Component {...pageProps} />
            </AuthGuard>
        </AuthProvider>
    )
}
