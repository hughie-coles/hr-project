import Nav from '../components/Nav'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

interface TimeOffRequest {
    id: string
    startDate: string
    endDate: string
    status: 'pending' | 'approved' | 'rejected'
    notes: string | null
    createdAt: string
}

export default function TimeOffPage() {
    const { token, authenticated } = useAuth()
    const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [showForm, setShowForm] = useState(false)

    // Form state
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [notes, setNotes] = useState('')

    useEffect(() => {
        if (authenticated && token) {
            fetchTimeOffRequests()
        }
    }, [authenticated, token])

    async function fetchTimeOffRequests() {
        if (!token) return

        try {
            setLoading(true)
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
            setError(err?.message ?? 'Failed to load time off requests')
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!token) return

        if (!startDate || !endDate) {
            setError('Please select both start and end dates')
            return
        }

        // Validate dates
        const start = new Date(startDate)
        const end = new Date(endDate)
        if (end < start) {
            setError('End date must be after start date')
            return
        }

        setSubmitting(true)
        setError(null)

        try {
            const res = await fetch('/api/time-off', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    startDate,
                    endDate,
                    notes: notes || undefined,
                }),
            })

            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data.message || 'Failed to submit time off request')
            }

            // Reset form
            setStartDate('')
            setEndDate('')
            setNotes('')
            setShowForm(false)

            // Refresh the list
            await fetchTimeOffRequests()
        } catch (err: any) {
            setError(err?.message ?? 'Failed to submit time off request')
        } finally {
            setSubmitting(false)
        }
    }

    function getStatusColor(status: string): string {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800'
            case 'rejected':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-yellow-100 text-yellow-800'
        }
    }

    function calculateDays(start: string, end: string): number {
        const startDate = new Date(start)
        const endDate = new Date(end)
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // +1 to include both start and end days
        return diffDays
    }

    if (!authenticated) {
        return (
            <>
                <Nav />
                <main className="max-w-6xl mx-auto p-6">
                    <h1 className="text-2xl font-semibold mb-4">Time Off</h1>
                    <p className="text-gray-600">Please log in to view and request time off.</p>
                </main>
            </>
        )
    }

    return (
        <>
            <Nav />
            <main className="max-w-6xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Time Off</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        {showForm ? 'Cancel' : 'Request Time Off'}
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white rounded shadow p-6 mb-6">
                        <h2 className="text-lg font-medium mb-4">Request Time Off</h2>
                        {error && <div className="text-red-600 mb-4">{error}</div>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Start Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full border rounded p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">End Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        min={startDate || new Date().toISOString().split('T')[0]}
                                        className="w-full border rounded p-2"
                                    />
                                </div>
                            </div>
                            {startDate && endDate && (
                                <div className="text-sm text-gray-600">
                                    Total days: {calculateDays(startDate, endDate)} day{calculateDays(startDate, endDate) !== 1 ? 's' : ''}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add any additional notes or reason for time off..."
                                    className="w-full border rounded p-2"
                                    rows={3}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                {submitting ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded shadow overflow-hidden">
                    <h2 className="text-lg font-medium p-6 border-b">My Time Off Requests</h2>

                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Loading time off requests...</div>
                    ) : error && !showForm ? (
                        <div className="bg-red-50 border border-red-200 rounded m-6 p-4 text-red-700">
                            {error}
                        </div>
                    ) : timeOffRequests.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            No time off requests yet. Click "Request Time Off" to create one.
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Start Date</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">End Date</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Days</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Notes</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Requested</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {timeOffRequests.map((request) => (
                                    <tr key={request.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {new Date(request.startDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {new Date(request.endDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {calculateDays(request.startDate, request.endDate)} day{calculateDays(request.startDate, request.endDate) !== 1 ? 's' : ''}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {request.notes || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </>
    )
}
