import React from 'react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'

export default function Nav() {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement | null>(null)
    const router = useRouter()
    const { authenticated, logout } = useAuth()

    useEffect(() => {
        function onDoc(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', onDoc)
        return () => document.removeEventListener('mousedown', onDoc)
    }, [])

    const linkClass = (path: string) =>
        `text-sm ${router.pathname === path ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-gray-900'}`

    return (
        <nav className="w-full bg-white border-b">
            <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
                <div className="flex items-center gap-6">
                    <div className="text-lg font-semibold">HR SASS</div>
                    <div className="flex gap-4">
                        <Link href="/" className={linkClass('/')}>Home</Link>
                        <Link href="/people" className={linkClass('/people')}>People</Link>
                        <Link href="/resources" className={linkClass('/resources')}>Resources</Link>
                    </div>
                </div>

                {authenticated && (
                    <div className="relative" ref={ref}>
                        <button
                            onClick={() => setOpen((o) => !o)}
                            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100"
                            aria-haspopup="menu"
                            aria-expanded={open}
                        >
                            <img src="/avatar.svg" alt="Profile" className="w-8 h-8 rounded-full" />
                            <span className="hidden sm:inline text-sm text-gray-700">Me</span>
                        </button>

                        {open && (
                            <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-md py-1 z-20">
                                <a href="/profile" onClick={(e) => {
                                    e.preventDefault()
                                    setOpen(false)
                                    if (router) router.push('/profile')
                                }} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                                <a className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100" href="#">Settings</a>
                                <a onClick={(e) => { e.preventDefault(); setOpen(false); logout(); router.push('/login') }} className="block px-3 py-2 text-sm text-red-600 hover:bg-red-50" href="#">Logout</a>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}
