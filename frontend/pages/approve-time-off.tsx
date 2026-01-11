import Nav from '../components/Nav'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'

interface TimeOffRequest {
    id: string
    employeeId: string
    employeeName: string
    startDate: string
    endDate: string
    status: 'pending' | 'approved' | 'rejected'
    notes: string | null
    createdAt: string
}

export default function ApproveTimeOffPage() {
    const { token, authenticated } = useAuth()
    const router = useRouter()
    const [pendingRequests, setPendingRequests] = useState<TimeOffRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [processing, setProcessing] = useState<string | null>(null)

    useEffect(() => {
        if (authenticated && token) {
            fetchPendingRequests()
        }
    }, [authenticated, token])

    async function fetchPendingRequests() {
        if (!token) return
        
        try {
            setLoading(true)
            const res = await fetch('/api/time-off/pending', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!res.ok) {
                throw new Error('Failed to fetch pending time off requests')
            }

            const data = await res.json()
            setPendingRequests(data.timeOff || [])
        } catch (err: any) {
            setError(err?.message ?? 'Failed to load pending requests')
        } finally {
            setLoading(false)
        }
    }

    async function handleApprove(requestId: string) {
        if (!token) return

        setProcessing(requestId)
        try {
            const res = await fetch(`/api/time-off/${requestId}/approve`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data.message || 'Failed to approve request')
            }

            // Remove from pending list
            setPendingRequests(pendingRequests.filter(r => r.id !== requestId))
        } catch (err: any) {
            alert(err?.message ?? 'Failed to approve request')
        } finally {
            setProcessing(null)
        }
    }

    async function handleReject(requestId: string) {
        if (!token) return

        if (!confirm('Are you sure you want to reject this time off request?')) {
            return
        }

        setProcessing(requestId)
        try {
            const res = await fetch(`/api/time-off/${requestId}/reject`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data.message || 'Failed to reject request')
            }

            // Remove from pending list
            setPendingRequests(pendingRequests.filter(r => r.id !== requestId))
        } catch (err: any) {
            alert(err?.message ?? 'Failed to reject request')
        } finally {
            setProcessing(null)
        }
    }

    function calculateDays(start: string, end: string): number {
        const startDate = new Date(start)
        const endDate = new Date(end)
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
        return diffDays
    }

    // If there's an ID in the query, filter to show only that request
    const requestId = router.query.id as string | undefined
    const filteredRequests = requestId 
        ? pendingRequests.filter(r => r.id === requestId)
        : pendingRequests

    if (!authenticated) {
        return (
            <>
                <Nav />
                <main className="max-w-6xl mx-auto p-6">
                    <h1 className="text-2xl font-semibold mb-4">Approve Time Off</h1>
                    <p className="text-gray-600">Please log in to view time off requests.</p>
                </main>
            </>
        )
    }

    return (
        <>
            <Nav />
            <main className="max-w-6xl mx-auto p-6">
                <h1 className="text-2xl font-semibold mb-6">Approve Time Off Requests</h1>

                {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading pending requests...</div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700">
                        {error}
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <div className="bg-white rounded shadow p-6 text-center text-gray-500">
                        {requestId ? 'Time off request not found or already processed.' : 'No pending time off requests.'}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredRequests.map((request) => (
                            <div key={request.id} className="bg-white rounded shadow border-l-4 border-blue-500 p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-lg font-semibold mb-1">{request.employeeName}</h2>
                                        <p className="text-sm text-gray-600">Employee ID: {request.employeeId}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                        Pending
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Start Date</label>
                                        <p className="text-gray-900">{new Date(request.startDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">End Date</label>
                                        <p className="text-gray-900">{new Date(request.endDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Total Days</label>
                                        <p className="text-gray-900">
                                            {calculateDays(request.startDate, request.endDate)} day{calculateDays(request.startDate, request.endDate) !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Requested</label>
                                        <p className="text-gray-900">{new Date(request.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {request.notes && (
                                    <div className="mb-4">
                                        <label className="text-sm font-medium text-gray-500">Notes</label>
                                        <p className="text-gray-900 bg-gray-50 p-3 rounded mt-1">{request.notes}</p>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-4 border-t">
                                    <button
                                        onClick={() => handleApprove(request.id)}
                                        disabled={processing === request.id}
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {processing === request.id ? 'Processing...' : 'Approve'}
                                    </button>
                                    <button
                                        onClick={() => handleReject(request.id)}
                                        disabled={processing === request.id}
                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                                    >
                                        {processing === request.id ? 'Processing...' : 'Reject'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </>
    )
}
