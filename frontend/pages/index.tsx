import Nav from '../components/Nav'

export default function Home() {
    return (
        <>
            <Nav />
            <main className="max-w-6xl mx-auto p-6">
                <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
                <p className="mb-6">Welcome to the HR SASS dashboard.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white rounded shadow">Company Overview</div>
                    <div className="p-4 bg-white rounded shadow">Recent Activity</div>
                    <div className="p-4 bg-white rounded shadow">Quick Actions</div>
                </div>
            </main>
        </>
    )
}
