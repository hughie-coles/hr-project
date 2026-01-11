import Nav from '../components/Nav'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'

type Employee = { id: string; name: string; role: string; manager?: { id: string; name: string; position: string } }

export default function People() {
    const [employees, setEmployees] = useState<Employee[] | null>(null)
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
            setEmployees(data.employees ?? [])
        } catch (err: any) {
            setError(err?.message ?? String(err))
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Nav />
            <main className="max-w-6xl mx-auto p-6">
                <h1 className="text-2xl font-semibold mb-4">People</h1>
                {loading && <p>Loading…</p>}
                {error && <p className="text-red-600">Error: {error}</p>}
                {employees && (
                    <ul className="space-y-2">
                        {employees.map((e) => (
                            <li key={e.id} className="p-3 bg-white rounded shadow flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img 
                                        src="/avatar.svg" 
                                        alt={`${e.name}'s profile`} 
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div>
                                        <div className="font-medium">{e.name}</div>
                                        <div className="text-sm text-gray-500">{e.role}</div>
                                    </div>
                                </div>
                                <div>
                                    <button 
                                        onClick={() => router.push(`/profile?id=${e.id}`)}
                                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline px-3 py-1 rounded hover:bg-blue-50"
                                    >
                                        View
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </>
    )
}
