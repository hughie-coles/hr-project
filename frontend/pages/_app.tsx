import React, { useEffect } from 'react'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { AuthProvider, useAuth } from '../context/AuthContext'

function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { authenticated } = useAuth()

    useEffect(() => {
        const publicPaths = ['/login']
        const check = (url: string) => {
            const path = url.split('?')[0]
            if (!authenticated && !publicPaths.includes(path)) {
                router.push('/login')
            }
        }

        // initial
        check(router.pathname)
        const handler = (url: string) => check(url)
        router.events.on('routeChangeStart', handler)
        return () => router.events.off('routeChangeStart', handler)
    }, [authenticated, router])

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
