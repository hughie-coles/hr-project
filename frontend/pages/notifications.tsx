import Nav from '../components/Nav'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

interface Notification {
    id: string
    title: string
    message: string
    type: string | null
    read: boolean
    createdAt: string
    link: string | null
}

export default function NotificationsPage() {
    const { token, authenticated } = useAuth()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (authenticated && token) {
            fetchNotifications()
        }
    }, [authenticated, token])

    async function fetchNotifications() {
        if (!token) return
        
        try {
            setLoading(true)
            const res = await fetch('/api/notifications', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!res.ok) {
                throw new Error('Failed to fetch notifications')
            }

            const data = await res.json()
            setNotifications(data.notifications || [])
        } catch (err: any) {
            setError(err?.message ?? 'Failed to load notifications')
        } finally {
            setLoading(false)
        }
    }

    async function markAsRead(notificationId: string) {
        if (!token) return

        try {
            const res = await fetch(`/api/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!res.ok) {
                throw new Error('Failed to mark notification as read')
            }

            // Update local state
            setNotifications(notifications.map(n => 
                n.id === notificationId ? { ...n, read: true } : n
            ))
        } catch (err: any) {
            alert(err?.message ?? 'Failed to mark notification as read')
        }
    }

    async function markAllAsRead() {
        if (!token) return

        try {
            const res = await fetch('/api/notifications/read-all', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!res.ok) {
                throw new Error('Failed to mark all notifications as read')
            }

            // Update local state
            setNotifications(notifications.map(n => ({ ...n, read: true })))
        } catch (err: any) {
            alert(err?.message ?? 'Failed to mark all notifications as read')
        }
    }

    function getTypeColor(type: string | null): string {
        switch (type) {
            case 'success':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'warning':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'error':
                return 'bg-red-100 text-red-800 border-red-200'
            default:
                return 'bg-blue-100 text-blue-800 border-blue-200'
        }
    }

    const unreadCount = notifications.filter(n => !n.read).length

    if (!authenticated) {
        return (
            <>
                <Nav />
                <main className="max-w-6xl mx-auto p-6">
                    <h1 className="text-2xl font-semibold mb-4">Notifications</h1>
                    <p className="text-gray-600">Please log in to view notifications.</p>
                </main>
            </>
        )
    }

    return (
        <>
            <Nav />
            <main className="max-w-6xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold">Notifications</h1>
                        {unreadCount > 0 && (
                            <p className="text-sm text-gray-600 mt-1">
                                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                            Mark All as Read
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading notifications...</div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700">
                        {error}
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="bg-white rounded shadow p-6 text-center text-gray-500">
                        No notifications yet
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`bg-white rounded shadow border-l-4 ${
                                    notification.read 
                                        ? 'border-gray-300 opacity-75' 
                                        : 'border-blue-500'
                                } ${getTypeColor(notification.type)}`}
                            >
                                <div className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                {notification.link ? (
                                                    <a 
                                                        href={notification.link}
                                                        className="font-medium hover:underline"
                                                    >
                                                        {notification.title}
                                                    </a>
                                                ) : (
                                                    <h3 className="font-medium">{notification.title}</h3>
                                                )}
                                                {!notification.read && (
                                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-700 mb-2">
                                                {notification.message}
                                            </p>
                                            {notification.link && (
                                                <a
                                                    href={notification.link}
                                                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline mb-2 inline-block"
                                                >
                                                    View & Approve →
                                                </a>
                                            )}
                                            <p className="text-xs text-gray-500">
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        {!notification.read && (
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="ml-4 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
                                            >
                                                Mark as read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </>
    )
}
