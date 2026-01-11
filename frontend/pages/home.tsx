import Nav from '../components/Nav'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'

interface DirectReport {
    id: string
    name: string
    email?: string
    position?: string
    role?: string
}

export default function HomePage() {
    const { token, authenticated, user } = useAuth()
    const router = useRouter()
    const [directReports, setDirectReports] = useState<DirectReport[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (authenticated && token) {
            fetchDirectReports()
        }
    }, [authenticated, token])

    async function fetchDirectReports() {
        if (!token) return

        try {
            setLoading(true)
            const res = await fetch('/api/direct-reports', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!res.ok) {
                // If user has no direct reports, that's okay
                if (res.status === 404) {
                    setDirectReports([])
                    return
                }
                throw new Error('Failed to fetch direct reports')
            }

            const data = await res.json()
            setDirectReports(data.directReports || [])
        } catch (err: any) {
            console.error('Error fetching direct reports:', err)
            setDirectReports([])
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Nav />
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                    <p className="text-gray-600">Welcome to your HR Platform dashboard</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Company Overview</h3>
                        <p className="text-sm text-gray-600">View company statistics and insights</p>
                    </div>
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Recent Activity</h3>
                        <p className="text-sm text-gray-600">Track recent updates and changes</p>
                    </div>
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h3>
                        <p className="text-sm text-gray-600">Access frequently used features</p>
                    </div>
                </div>

                {directReports.length > 0 && (
                    <div className="card">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Direct Reports</h2>
                                <p className="text-sm text-gray-600 mt-1">Team members reporting to you</p>
                            </div>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {directReports.length}
                            </span>
                        </div>

                        {loading ? (
                            <div className="text-center py-8 text-gray-500">Loading...</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {directReports.map((report) => (
                                    <div
                                        key={report.id}
                                        className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                                        onClick={() => router.push(`/profile?id=${report.id}`)}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <img
                                                src="/avatar.svg"
                                                alt={`${report.name}'s profile`}
                                                className="w-10 h-10 rounded-full ring-2 ring-white"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-gray-900 truncate">
                                                    {report.name}
                                                </div>
                                                {report.position && (
                                                    <div className="text-sm text-gray-600 truncate">
                                                        {report.position}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {report.email && (
                                            <div className="text-xs text-gray-500 truncate mt-2">
                                                {report.email}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </>
    )
}
