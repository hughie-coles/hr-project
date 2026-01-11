import Nav from '../components/Nav'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'

type Profile = {
    id: string
    name: string
    email?: string
    position?: string
    role?: string
    userType?: string
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
    const [isEditing, setIsEditing] = useState(false)
    const [editData, setEditData] = useState<Partial<Profile>>({})
    const [employees, setEmployees] = useState<Array<{id: string, name: string, position?: string}>>([])
    const [saving, setSaving] = useState(false)

    const router = useRouter()
    const { token, user } = useAuth()
    const isAdmin = user?.userType === 'admin'

    // Get user ID from query string, or default to logged-in user's ID
    const userId = router.query.id as string || user?.id

    useEffect(() => {
        if (!token) {
            router.push('/login')
            return
        }
        if (userId) {
            fetchProfile()
            if (isAdmin) {
                fetchEmployees()
            }
        }
    }, [token, userId, isAdmin])

    async function fetchEmployees() {
        try {
            const res = await fetch('/api/employees', {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            })
            if (!res.ok) return
            const data = await res.json()
            setEmployees(data.employees ?? [])
        } catch (err) {
            // Ignore errors
        }
    }

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

    function handleEdit() {
        if (!p) return
        setEditData({
            name: p.name,
            email: p.email,
            position: p.position,
            role: p.role,
            userType: p.userType,
            dateOfBirth: p.dateOfBirth,
            address: p.address,
            phone: p.phone,
            startDate: p.startDate,
            reportsToId: p.manager?.id || '',
        } as any)
        setIsEditing(true)
    }

    async function handleSave() {
        if (!p || !token) return
        
        setSaving(true)
        setError(null)
        
        try {
            // Prepare data for backend (convert manager to reportsToId)
            const updateData: any = {
                name: editData.name,
                email: editData.email,
                position: editData.position,
                role: editData.role,
                userType: editData.userType,
                dateOfBirth: editData.dateOfBirth,
                address: editData.address,
                phone: editData.phone,
                startDate: editData.startDate,
                reportsToId: (editData as any).reportsToId || null,
            }
            if ((editData as any).password) {
                updateData.password = (editData as any).password
            }
            
            const res = await fetch(`/api/admin/users/${p.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updateData),
            })
            
            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data.message || `Failed to update user (${res.status})`)
            }
            
            setIsEditing(false)
            fetchProfile() // Refresh profile data
        } catch (err: any) {
            setError(err?.message ?? String(err))
        } finally {
            setSaving(false)
        }
    }

    function handleCancel() {
        setIsEditing(false)
        setEditData({})
        setError(null)
    }

    return (
        <>
            <Nav />
            <main className="max-w-4xl mx-auto p-6">
                {loading && <p>Loading…</p>}
                {error && <p className="text-red-600">Error: {error}</p>}
                {p && (
                    <>
                        <div className="bg-white rounded shadow p-6 flex gap-6 items-center justify-between">
                            <div className="flex gap-6 items-center">
                                <img src="/avatar.svg" alt="Profile" className="w-28 h-28 rounded-full" />
                                <div>
                                    <h1 className="text-2xl font-semibold">{p.name}</h1>
                                    <div className="text-gray-600">{p.position}</div>
                                </div>
                            </div>
                            {isAdmin && !isEditing && (
                                <button
                                    onClick={handleEdit}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Edit
                                </button>
                            )}
                        </div>

                        {isEditing ? (
                            <div className="mt-6 bg-white rounded shadow p-6">
                                <h2 className="text-lg font-medium mb-4">Edit Profile</h2>
                                {error && <div className="text-red-600 mb-4">{error}</div>}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={editData.name || ''}
                                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                            className="w-full border rounded p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={editData.email || ''}
                                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                            className="w-full border rounded p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Position</label>
                                        <input
                                            type="text"
                                            value={editData.position || ''}
                                            onChange={(e) => setEditData({ ...editData, position: e.target.value })}
                                            className="w-full border rounded p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Role</label>
                                        <input
                                            type="text"
                                            value={editData.role || ''}
                                            onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                                            className="w-full border rounded p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">User Type *</label>
                                        <select
                                            required
                                            value={editData.userType || 'user'}
                                            onChange={(e) => setEditData({ ...editData, userType: e.target.value })}
                                            className="w-full border rounded p-2"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Reports To</label>
                                        <select
                                            value={(editData as any).reportsToId || ''}
                                            onChange={(e) => setEditData({ ...editData, reportsToId: e.target.value } as any)}
                                            className="w-full border rounded p-2"
                                        >
                                            <option value="">None</option>
                                            {employees.filter(emp => emp.id !== p.id).map((emp) => (
                                                <option key={emp.id} value={emp.id}>
                                                    {emp.name} {emp.position ? `- ${emp.position}` : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Date of Birth</label>
                                        <input
                                            type="date"
                                            value={editData.dateOfBirth || ''}
                                            onChange={(e) => setEditData({ ...editData, dateOfBirth: e.target.value })}
                                            className="w-full border rounded p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Start Date</label>
                                        <input
                                            type="date"
                                            value={editData.startDate || ''}
                                            onChange={(e) => setEditData({ ...editData, startDate: e.target.value })}
                                            className="w-full border rounded p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            value={editData.phone || ''}
                                            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                            className="w-full border rounded p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">New Password (leave blank to keep current)</label>
                                        <input
                                            type="password"
                                            value={(editData as any).password || ''}
                                            onChange={(e) => setEditData({ ...editData, password: e.target.value } as any)}
                                            className="w-full border rounded p-2"
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium mb-1">Address</label>
                                    <textarea
                                        value={editData.address || ''}
                                        onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                                        className="w-full border rounded p-2"
                                        rows={2}
                                    />
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        disabled={saving}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-6 bg-white rounded shadow p-6">
                                <h2 className="text-lg font-medium mb-4">Details</h2>
                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                                    {p.email && (
                                        <div>
                                            <dt className="text-sm text-gray-500">Email</dt>
                                            <dd className="mt-1">{p.email}</dd>
                                        </div>
                                    )}
                                    <div>
                                        <dt className="text-sm text-gray-500">Date of birth</dt>
                                        <dd className="mt-1">{p.dateOfBirth || '-'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500">Start date</dt>
                                        <dd className="mt-1">{p.startDate || '-'}</dd>
                                    </div>
                                    <div className="md:col-span-2">
                                        <dt className="text-sm text-gray-500">Address</dt>
                                        <dd className="mt-1">{p.address || '-'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500">Phone</dt>
                                        <dd className="mt-1">{p.phone || '-'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500">Position</dt>
                                        <dd className="mt-1">{p.position || '-'}</dd>
                                    </div>
                                    {p.role && (
                                        <div>
                                            <dt className="text-sm text-gray-500">Role</dt>
                                            <dd className="mt-1">{p.role}</dd>
                                        </div>
                                    )}
                                    {isAdmin && p.userType && (
                                        <div>
                                            <dt className="text-sm text-gray-500">User Type</dt>
                                            <dd className="mt-1">{p.userType}</dd>
                                        </div>
                                    )}
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
                        )}
                    </>
                )}
            </main>
        </>
    )
}
