import Nav from '../components/Nav'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'
import Link from 'next/link'

type User = {
    id: string
    name: string
    email?: string
    position?: string
}

type Resource = {
    id: string
    filename: string
    size: number
    createdAt: string
    description?: string
}

export default function AdminPage() {
    const router = useRouter()
    const { token, user } = useAuth()
    const [activeTab, setActiveTab] = useState<'users' | 'resources'>('users')
    const [employees, setEmployees] = useState<User[]>([])
    const [resources, setResources] = useState<Resource[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Check if user has admin type
    const isAdmin = user?.userType === 'admin'

    useEffect(() => {
        if (!token) {
            router.push('/login')
            return
        }
        if (!isAdmin) {
            router.push('/')
            return
        }
        fetchEmployees()
        fetchResources()
    }, [token, isAdmin])

    async function fetchEmployees() {
        try {
            const res = await fetch('/api/employees', {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            })
            if (!res.ok) throw new Error(`Status: ${res.status}`)
            const data = await res.json()
            setEmployees(data.employees ?? [])
        } catch (err: any) {
            setError(err?.message ?? String(err))
        }
    }

    async function fetchResources() {
        try {
            const res = await fetch('/api/resources', {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            })
            if (!res.ok) throw new Error(`Status: ${res.status}`)
            const data = await res.json()
            setResources(data.resources ?? [])
        } catch (err: any) {
            console.error('Failed to fetch resources:', err)
        }
    }

    if (!isAdmin) {
        return null
    }

    return (
        <>
            <Nav />
            <main className="max-w-6xl mx-auto p-6">
                <h1 className="text-2xl font-semibold mb-6">Admin Panel</h1>

                <div className="border-b mb-6">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-2 font-medium ${
                            activeTab === 'users'
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Manage Users
                    </button>
                    <button
                        onClick={() => setActiveTab('resources')}
                        className={`px-4 py-2 font-medium ${
                            activeTab === 'resources'
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Manage Resources
                    </button>
                </div>

                {activeTab === 'users' && (
                    <UserManagement
                        employees={employees}
                        onUserAdded={fetchEmployees}
                        token={token}
                    />
                )}

                {activeTab === 'resources' && (
                    <ResourceManagement
                        resources={resources}
                        onResourceAdded={fetchResources}
                        onResourceDeleted={fetchResources}
                        token={token}
                    />
                )}
            </main>
        </>
    )
}

function UserManagement({ employees, onUserAdded, token }: { employees: User[], onUserAdded: () => void, token: string | null }) {
    const [showForm, setShowForm] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        position: '',
        role: '',
        userType: 'user',
        reportsToId: '',
        dateOfBirth: '',
        address: '',
        phone: '',
        startDate: '',
    })
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Filter employees based on search query
    const filteredEmployees = employees.filter((emp) => {
        if (!searchQuery.trim()) return true
        
        const query = searchQuery.toLowerCase().trim()
        const nameMatch = emp.name?.toLowerCase().includes(query) || false
        const emailMatch = emp.email?.toLowerCase().includes(query) || false
        const positionMatch = emp.position?.toLowerCase().includes(query) || false
        const roleMatch = emp.role?.toLowerCase().includes(query) || false
        
        return nameMatch || emailMatch || positionMatch || roleMatch
    })

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSubmitting(true)
        setError(null)

        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    position: formData.position,
                    role: formData.role,
                    userType: formData.userType,
                    reportsToId: formData.reportsToId || undefined,
                    dateOfBirth: formData.dateOfBirth || undefined,
                    address: formData.address || undefined,
                    phone: formData.phone || undefined,
                    startDate: formData.startDate || undefined,
                }),
            })

            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data.message || `Failed to create user (${res.status})`)
            }

            // Reset form
            setFormData({
                name: '',
                email: '',
                password: '',
                position: '',
                role: '',
                userType: 'user',
                reportsToId: '',
                dateOfBirth: '',
                address: '',
                phone: '',
                startDate: '',
            })
            setShowForm(false)
            onUserAdded()
        } catch (err: any) {
            setError(err?.message ?? String(err))
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Users</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary"
                >
                    {showForm ? 'Cancel' : 'Add User'}
                </button>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search users by name, email, position, or role..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field max-w-md"
                />
            </div>

            {showForm && (
                <div className="bg-white rounded shadow p-6 mb-6">
                    <h3 className="text-lg font-medium mb-4">Create New User</h3>
                    {error && <div className="text-red-600 mb-4">{error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Password *</label>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Position</label>
                                <input
                                    type="text"
                                    value={formData.position}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Role</label>
                                <input
                                    type="text"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">User Type *</label>
                                <select
                                    required
                                    value={formData.userType}
                                    onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                                    className="w-full border rounded p-2"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Reports To (User ID)</label>
                                <select
                                    value={formData.reportsToId}
                                    onChange={(e) => setFormData({ ...formData, reportsToId: e.target.value })}
                                    className="w-full border rounded p-2"
                                >
                                    <option value="">None</option>
                                    {employees.map((emp) => (
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
                                    value={formData.dateOfBirth}
                                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Address</label>
                            <textarea
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full border rounded p-2"
                                rows={2}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {submitting ? 'Creating...' : 'Create User'}
                        </button>
                    </form>
                </div>
            )}

            <div className="card overflow-hidden p-0">
                {filteredEmployees.length === 0 && employees.length > 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        No users found matching "{searchQuery}"
                    </div>
                ) : filteredEmployees.length === 0 && employees.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        No users yet. Click "Add User" to create one.
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Position</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Role</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredEmployees.map((emp) => (
                                <tr key={emp.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{emp.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{emp.email || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{emp.position || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{emp.role || '-'}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <Link href={`/profile?id=${emp.id}`} className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

function ResourceManagement({ resources, onResourceAdded, onResourceDeleted, token }: { resources: Resource[], onResourceAdded: () => void, onResourceDeleted: () => void, token: string | null }) {
    const [showForm, setShowForm] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [description, setDescription] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Filter resources based on search query
    const filteredResources = resources.filter((resource) => {
        if (!searchQuery.trim()) return true
        
        const query = searchQuery.toLowerCase().trim()
        const filenameMatch = resource.filename?.toLowerCase().includes(query) || false
        const descriptionMatch = resource.description?.toLowerCase().includes(query) || false
        
        return filenameMatch || descriptionMatch
    })

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!file) {
            setError('Please select a file')
            return
        }

        setSubmitting(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('description', description)

            const res = await fetch('/api/admin/resources', {
                method: 'POST',
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                body: formData,
            })

            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data.message || `Failed to upload resource (${res.status})`)
            }

            setFile(null)
            setDescription('')
            setShowForm(false)
            onResourceAdded()
        } catch (err: any) {
            setError(err?.message ?? String(err))
        } finally {
            setSubmitting(false)
        }
    }

    async function handleDelete(resourceId: string) {
        if (!confirm('Are you sure you want to delete this resource?')) return

        try {
            const res = await fetch(`/api/admin/resources/${resourceId}`, {
                method: 'DELETE',
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            })

            if (!res.ok) {
                throw new Error('Failed to delete resource')
            }

            onResourceDeleted()
        } catch (err: any) {
            alert(err?.message ?? 'Failed to delete resource')
        }
    }

    function formatFileSize(bytes: number): string {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Resources</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary"
                >
                    {showForm ? 'Cancel' : 'Upload Resource'}
                </button>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search resources by filename or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field max-w-md"
                />
            </div>

            {showForm && (
                <div className="bg-white rounded shadow p-6 mb-6">
                    <h3 className="text-lg font-medium mb-4">Upload PDF Resource</h3>
                    {error && <div className="text-red-600 mb-4">{error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">PDF File *</label>
                            <input
                                type="file"
                                accept=".pdf"
                                required
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="w-full border rounded p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full border rounded p-2"
                                rows={3}
                                placeholder="Optional description of the resource"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting || !file}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {submitting ? 'Uploading...' : 'Upload Resource'}
                        </button>
                    </form>
                </div>
            )}

            <div className="card overflow-hidden p-0">
                {filteredResources.length === 0 && resources.length > 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        No resources found matching "{searchQuery}"
                    </div>
                ) : filteredResources.length === 0 && resources.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">No resources uploaded yet</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Filename</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Size</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Uploaded</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredResources.map((resource) => (
                                <tr key={resource.id}>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{resource.filename}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{formatFileSize(resource.size)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{resource.description || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(resource.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const res = await fetch(`/api/resources/${resource.id}`, {
                                                        headers: token ? { Authorization: `Bearer ${token}` } : {},
                                                    })
                                                    if (!res.ok) throw new Error('Failed to download')
                                                    const blob = await res.blob()
                                                    const url = window.URL.createObjectURL(blob)
                                                    const a = document.createElement('a')
                                                    a.href = url
                                                    a.download = resource.filename
                                                    document.body.appendChild(a)
                                                    a.click()
                                                    window.URL.revokeObjectURL(url)
                                                    document.body.removeChild(a)
                                                } catch (err: any) {
                                                    alert(err?.message ?? 'Failed to download resource')
                                                }
                                            }}
                                            className="text-blue-600 hover:underline mr-4"
                                        >
                                            Download
                                        </button>
                                        <button
                                            onClick={() => handleDelete(resource.id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
