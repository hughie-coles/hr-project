import Nav from '../components/Nav'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'

type Employee = { id: string; name: string; role: string; manager?: { id: string; name: string; position: string } }

export default function People() {
    const [employees, setEmployees] = useState<Employee[] | null>(null)
    const [filteredEmployees, setFilteredEmployees] = useState<Employee[] | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { token } = useAuth()
    const router = useRouter()

    useEffect(() => {
        fetchEmployees()
    }, [token])

    async function fetchEmployees() {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch('/api/employees', {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            })
            if (!res.ok) throw new Error(`Status: ${res.status}`)
            const data = await res.json()
            const employeesList = data.employees ?? []
            setEmployees(employeesList)
            setFilteredEmployees(employeesList)
        } catch (err: any) {
            setError(err?.message ?? String(err))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!employees) return

        if (!searchQuery.trim()) {
            setFilteredEmployees(employees)
            return
        }

        const query = searchQuery.toLowerCase().trim()
        const filtered = employees.filter((emp) => {
            const nameMatch = emp.name.toLowerCase().includes(query)
            const roleMatch = emp.role?.toLowerCase().includes(query) || false
            const managerMatch = emp.manager?.name.toLowerCase().includes(query) || false
            return nameMatch || roleMatch || managerMatch
        })
        setFilteredEmployees(filtered)
    }, [searchQuery, employees])

    return (
        <>
            <Nav />
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                                <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">People</h1>
                            <p className="text-gray-600">Browse your organization's team members</p>
                        </div>
                    </div>
                    <div className="max-w-md">
                        <input
                            type="text"
                            placeholder="Search by name, role, or manager..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field w-full"
                        />
                    </div>
                </div>
                
                {loading && (
                    <div className="text-center py-12 text-gray-500">Loading…</div>
                )}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                        Error: {error}
                    </div>
                )}
                {filteredEmployees && (
                    <>
                        {filteredEmployees.length === 0 && employees && employees.length > 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No employees found matching "{searchQuery}"
                            </div>
                        )}
                        {filteredEmployees.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredEmployees.map((e) => (
                            <div key={e.id} className="card">
                                <div className="flex items-center gap-4 mb-4">
                                    <img 
                                        src="/avatar.svg" 
                                        alt={`${e.name}'s profile`} 
                                        className="w-12 h-12 rounded-full ring-2 ring-gray-100"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-gray-900 truncate">{e.name}</div>
                                        <div className="text-sm text-gray-600 truncate">{e.role}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => router.push(`/profile?id=${e.id}`)}
                                    className="btn-primary w-full text-sm"
                                >
                                    View Profile
                                </button>
                                </div>
                        ))}
                            </div>
                        )}
                    </>
                )}
            </main>
        </>
    )
}
