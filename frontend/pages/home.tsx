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

interface TimeOffRequest {
    id: string
    startDate: string
    endDate: string
    status: 'pending' | 'approved' | 'rejected'
    notes: string | null
    createdAt: string
}

export default function HomePage() {
    const { token, authenticated, user } = useAuth()
    const router = useRouter()
    const [directReports, setDirectReports] = useState<DirectReport[]>([])
    const [loading, setLoading] = useState(true)
    const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([])
    const [timeOffLoading, setTimeOffLoading] = useState(true)

    useEffect(() => {
        if (authenticated && token) {
            fetchDirectReports()
            fetchTimeOffRequests()
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

    async function fetchTimeOffRequests() {
        if (!token) return

        try {
            setTimeOffLoading(true)
            const res = await fetch('/api/time-off', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!res.ok) {
                throw new Error('Failed to fetch time off requests')
            }

            const data = await res.json()
            setTimeOffRequests(data.timeOff || [])
        } catch (err: any) {
            console.error('Error fetching time off requests:', err)
            setTimeOffRequests([])
        } finally {
            setTimeOffLoading(false)
        }
    }

    function formatDate(dateString: string): string {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    function getStatusColor(status: string): string {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'
            case 'rejected':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    // Filter upcoming and recent time off requests (all future requests + past 30 days)
    const now = new Date()
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - 30)

    const relevantTimeOff = timeOffRequests.filter((req) => {
        const endDate = new Date(req.endDate)
        // Show all future requests or requests from the past 30 days
        return endDate >= pastDate
    }).slice(0, 5) // Show up to 5 most recent/relevant requests

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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="card">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">My Time Off</h2>
                                <p className="text-sm text-gray-600 mt-1">Upcoming and recent time off requests</p>
                            </div>
                            {timeOffRequests.length > 0 && (
                                <button
                                    onClick={() => router.push('/time-off')}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    View All
                                </button>
                            )}
                        </div>

                        {timeOffLoading ? (
                            <div className="text-center py-8 text-gray-500">Loading...</div>
                        ) : relevantTimeOff.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p className="mb-2">No upcoming time off requests</p>
                                <button
                                    onClick={() => router.push('/time-off')}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Request Time Off
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {relevantTimeOff.map((request) => (
                                    <div
                                        key={request.id}
                                        className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                                        onClick={() => router.push('/time-off')}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium text-gray-900">
                                                        {formatDate(request.startDate)} - {formatDate(request.endDate)}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                    </span>
                                                </div>
                                                {request.notes && (
                                                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                                        {request.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {directReports.slice(0, 6).map((report) => (
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
                </div>
            </main>
        </>
    )
}
