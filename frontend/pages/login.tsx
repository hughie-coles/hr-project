import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const router = useRouter()
    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (typeof window !== 'undefined' && localStorage.getItem('token')) {
            router.replace('/profile')
        }
    }, [router])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            if (!res.ok) {
                const body = await res.json().catch(() => ({}))
                setError(body.message || `Login failed (${res.status})`)
                return
            }

            const data = await res.json()
            // store token and user in auth context and redirect
            login(data.token, data.user)
            router.push('/profile')
        } catch (err: any) {
            setError(err?.message ?? 'Network error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <main className="max-w-md mx-auto p-6">
                <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
                    {error && <div className="text-red-600">{error}</div>}

                    <label className="block">
                        <span className="text-sm text-gray-600">Email</span>
                        <input
                            className="mt-1 block w-full border rounded p-2"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            required
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm text-gray-600">Password</span>
                        <input
                            className="mt-1 block w-full border rounded p-2"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            required
                        />
                    </label>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Signing in…' : 'Sign in'}
                        </button>
                        <div className="text-sm text-gray-500">Demo user: alex@example.com / password</div>
                    </div>
                </form>
            </main>
        </>
    )
}
