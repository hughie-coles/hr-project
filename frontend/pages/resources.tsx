import Nav from '../components/Nav'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

interface Resource {
    id: string
    filename: string
    size: number
    description: string | null
    createdAt: string
}

export default function Resources() {
    const { token, authenticated } = useAuth()
    const [resources, setResources] = useState<Resource[]>([])
    const [filteredResources, setFilteredResources] = useState<Resource[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (authenticated && token) {
            fetchResources()
        }
    }, [authenticated, token])

    async function fetchResources() {
        if (!token) return
        
        try {
            setLoading(true)
            const res = await fetch('/api/resources', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!res.ok) {
                throw new Error('Failed to fetch resources')
            }

            const data = await res.json()
            const resourcesList = data.resources || []
            setResources(resourcesList)
            setFilteredResources(resourcesList)
        } catch (err: any) {
            setError(err?.message ?? 'Failed to load resources')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!resources.length) {
            setFilteredResources([])
            return
        }

        if (!searchQuery.trim()) {
            setFilteredResources(resources)
            return
        }

        const query = searchQuery.toLowerCase().trim()
        const filtered = resources.filter((resource) => {
            const filenameMatch = resource.filename.toLowerCase().includes(query)
            const descriptionMatch = resource.description?.toLowerCase().includes(query) || false
            return filenameMatch || descriptionMatch
        })
        setFilteredResources(filtered)
    }, [searchQuery, resources])

    async function handleDownload(resourceId: string, filename: string) {
        if (!token) return

        try {
            const res = await fetch(`/api/resources/${resourceId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!res.ok) {
                throw new Error('Failed to download resource')
            }

            const blob = await res.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = filename
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (err: any) {
            alert(err?.message ?? 'Failed to download resource')
        }
    }

    function formatFileSize(bytes: number): string {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    if (!authenticated) {
        return (
            <>
                <Nav />
                <main className="max-w-6xl mx-auto p-6">
                    <h1 className="text-2xl font-semibold mb-4">Resources</h1>
                    <p className="text-gray-600">Please log in to view resources.</p>
                </main>
            </>
        )
    }

    return (
        <>
            <Nav />
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <div className="mb-4">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resources</h1>
                        <p className="text-gray-600">Access and download company resources</p>
                    </div>
                    <div className="max-w-md">
                        <input
                            type="text"
                            placeholder="Search by filename or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field w-full"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading resources...</div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700">
                        {error}
                    </div>
                ) : filteredResources.length === 0 && resources.length === 0 ? (
                    <div className="card p-6 text-center text-gray-500">
                        No resources available
                    </div>
                ) : filteredResources.length === 0 && resources.length > 0 ? (
                    <div className="card p-6 text-center text-gray-500">
                        No resources found matching "{searchQuery}"
                    </div>
                ) : (
                    <div className="card overflow-hidden p-0">
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
                                    <tr key={resource.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {resource.filename}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {formatFileSize(resource.size)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {resource.description || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(resource.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                        <button
                                            onClick={() => handleDownload(resource.id, resource.filename)}
                                            className="btn-primary text-sm"
                                        >
                                            Download
                                        </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </>
    )
}
