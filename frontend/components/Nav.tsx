import React from 'react'
import Link from 'next/link'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'

export default function Nav() {
    const [open, setOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)
    const ref = useRef<HTMLDivElement | null>(null)
    const router = useRouter()
    const { authenticated, logout, user, token } = useAuth()
    const isAdmin = user?.userType === 'admin'

    useEffect(() => {
        function onDoc(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', onDoc)
        return () => document.removeEventListener('mousedown', onDoc)
    }, [])

    const fetchUnreadCount = useCallback(async () => {
        if (!token) return
        
        try {
            const res = await fetch('/api/notifications', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (res.ok) {
                const data = await res.json()
                const notifications = data.notifications || []
                const unread = notifications.filter((n: any) => !n.read).length
                setUnreadCount(unread)
            }
        } catch (err) {
            // Silently fail - don't show error for badge count
            console.error('Failed to fetch unread count:', err)
        }
    }, [token])

    useEffect(() => {
        if (authenticated && token) {
            fetchUnreadCount()
            // Refresh unread count every 30 seconds
            const interval = setInterval(fetchUnreadCount, 30000)
            return () => clearInterval(interval)
        } else {
            setUnreadCount(0)
        }
    }, [authenticated, token, fetchUnreadCount])

    const linkClass = (path: string) =>
        router.pathname === path 
            ? 'nav-link-active' 
            : 'nav-link'

    return (
        <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
                <div className="flex items-center gap-8">
                    <div className="text-xl font-bold text-gray-900">HR Platform</div>
                    <div className="flex gap-6">
                        <Link href="/" className={linkClass('/')}>Home</Link>
                        <Link href="/people" className={linkClass('/people')}>People</Link>
                        <Link href="/resources" className={linkClass('/resources')}>Resources</Link>
                        <Link href="/time-off" className={linkClass('/time-off')}>Time Off</Link>
                        {isAdmin && (
                            <Link href="/admin" className={linkClass('/admin')}>Admin</Link>
                        )}
                    </div>
                </div>

                {authenticated && (
                    <div className="relative" ref={ref}>
                        <button
                            onClick={() => {
                                setOpen((o) => !o)
                                if (!open && authenticated && token) {
                                    fetchUnreadCount()
                                }
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            aria-haspopup="menu"
                            aria-expanded={open}
                        >
                            <img src="/avatar.svg" alt="Profile" className="w-8 h-8 rounded-full ring-2 ring-gray-200" />
                            <span className="hidden sm:inline text-sm font-medium text-gray-700">Me</span>
                        </button>

                        {open && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-medium border border-gray-100 py-2 z-20">
                                <a href="/profile" onClick={(e) => {
                                    e.preventDefault()
                                    setOpen(false)
                                    if (router) router.push('/profile')
                                }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Profile</a>
                                <a href="/notifications" onClick={(e) => {
                                    e.preventDefault()
                                    setOpen(false)
                                    if (router) router.push('/notifications')
                                }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors relative">
                                    Notifications
                                    {unreadCount > 0 && (
                                        <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                                            {unreadCount > 99 ? '99+' : unreadCount}
                                        </span>
                                    )}
                                </a>
                                <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors" href="#">Settings</a>
                                <div className="border-t border-gray-100 my-1"></div>
                                <a onClick={(e) => { e.preventDefault(); setOpen(false); logout(); router.push('/login') }} className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors" href="#">Logout</a>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}
