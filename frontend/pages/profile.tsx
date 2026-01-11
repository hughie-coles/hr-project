import Nav from '../components/Nav'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'

type Profile = {
    id: string
    name: string
    position?: string
    dateOfBirth?: string
    address?: string
    phone?: string
    startDate?: string
    manager?: {
        id: string
        name: string
        position?: string
    }
}

export default function ProfilePage() {
    const [p, setP] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const router = useRouter()
    const { token, user } = useAuth()

    // Get user ID from query string, or default to logged-in user's ID
    const userId = router.query.id as string || user?.id

    useEffect(() => {
        if (!token) {
            router.push('/login')
            return
        }
        if (userId) {
            fetchProfile()
        }
    }, [token, userId])

    async function fetchProfile() {
        if (!userId) return
        
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`/api/users/${userId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            })
            if (!res.ok) throw new Error(`Status ${res.status}`)
            const data = await res.json()
            setP(data)
        } catch (err: any) {
            setError(err?.message ?? String(err))
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Nav />
            <main className="max-w-4xl mx-auto p-6">
                {loading && <p>Loading…</p>}
                {error && <p className="text-red-600">Error: {error}</p>}
                {p && (
                    <>
                        <div className="bg-white rounded shadow p-6 flex gap-6 items-center">
                            <img src="/avatar.svg" alt="Profile" className="w-28 h-28 rounded-full" />
                            <div>
                                <h1 className="text-2xl font-semibold">{p.name}</h1>
                                <div className="text-gray-600">{p.position}</div>
                            </div>
                        </div>

                        <div className="mt-6 bg-white rounded shadow p-6">
                            <h2 className="text-lg font-medium mb-4">Details</h2>
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                                <div>
                                    <dt className="text-sm text-gray-500">Date of birth</dt>
                                    <dd className="mt-1">{p.dateOfBirth}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-gray-500">Start date</dt>
                                    <dd className="mt-1">{p.startDate}</dd>
                                </div>
                                <div className="md:col-span-2">
                                    <dt className="text-sm text-gray-500">Address</dt>
                                    <dd className="mt-1">{p.address}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-gray-500">Phone</dt>
                                    <dd className="mt-1">{p.phone}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-gray-500">Position</dt>
                                    <dd className="mt-1">{p.position}</dd>
                                </div>
                                {p.manager && (
                                    <div>
                                        <dt className="text-sm text-gray-500">Reports to</dt>
                                        <dd className="mt-1">
                                            <button
                                                onClick={() => router.push(`/profile?id=${p.manager!.id}`)}
                                                className="text-blue-600 hover:text-blue-800 hover:underline"
                                            >
                                                {p.manager.name}
                                            </button>
                                            {p.manager.position && (
                                                <span className="text-gray-500 ml-2">({p.manager.position})</span>
                                            )}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </>
                )}
            </main>
        </>
    )
}
